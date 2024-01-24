// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

// ** Context Imports
import { Box } from '@mui/system'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { DateType } from 'src/types/forms/reactDatepickerTypes';

// ** Customs
import ChartIngresosAnualesEntrenador from './charts/chartIngresosAnuales'
import ChartIngresosMensualesEntrenador from './charts/chartIngresosMensuales'
import CircularProgress from '@mui/material/CircularProgress';
import ChartSubsMasSolicitadas from './charts/chartSubsMasSolicitadas';
import ChartSubsUltimoAño from './charts/chartSubsUltimoAño';

interface amount {
  amount: number;
  date: Date
}

interface PopularSubs {
  date: Date;
  subscriptionId: string;
  subsName: string
}

const TrainerInsights = () => {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const [year, setYear] = useState<DateType>(new Date());
  const thisYear = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  const [yearSubs, setYearSubs] = useState<DateType>(lastYear);

  const updateYear = (newYear: DateType) => {
    setYear(newYear);
  };

  const updateYearSubs = (newYear: DateType) => {
    setYearSubs(newYear);
  };

  //!INGRESOS MENSUALES
  const [montosMensuales, setMontosMensuales] = useState<amount[] | undefined>()
  const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const lastDayOfMonth = getLastDayOfMonth(currentYear, currentMonth);
  const daysOfMonth = Array.from({ length: lastDayOfMonth }, (_, index) => index + 1);

  const dataMensual = daysOfMonth.map((day) => {
    const dateKey = `${day.toString().padStart(2, '0')}`;
    const totalAmount = (montosMensuales ?? [])
      .filter((item) => new Date(item.date).getDate() === day)
      .reduce((acc, item) => acc + item.amount, 0);

    return { pv: totalAmount, name: dateKey };
  });
  const totalMensual = (montosMensuales ?? [])
    .reduce((acc, item) => acc + item.amount, 0);

  //!INGRESOS ANUALES
  const [montosAnuales, setMontosAnuales] = useState<amount[] | undefined>();
  const obtenerDatosAnuales = (montosAnuales: amount[] | undefined, year: number | undefined) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dataAnual = meses.map((mes, index) => {
      const totalMes = (montosAnuales ?? [])
        .filter((item) => new Date(item.date).getFullYear() === year)
        .filter((item) => new Date(item.date).getMonth() === index)
        .reduce((acc, item) => acc + item.amount, 0);

      return { pv: totalMes, name: mes };
    });

    return dataAnual;
  };
  const dataAnual = obtenerDatosAnuales(montosAnuales, year?.getFullYear());
  const totalAnual = (montosAnuales ?? []).filter((item) => new Date(item.date).getFullYear() === year?.getFullYear()).reduce((acc, item) => acc + item.amount, 0);


  const [subsMasSolicitadas, setSubsMasSolicitadas] = useState<PopularSubs[]>()

  //!SUBS MAS SOLICITADAS ESTE AÑO

  const obtenerSubsMasSolicitadasAnual = (subsMasSolicitadas: PopularSubs[] | undefined, year: number | undefined) => {
    const monthlyStats: Record<string, number[]> = {};

    subsMasSolicitadas?.forEach((sub: PopularSubs) => {
      const date = new Date(sub.date);
      const subMonth = date.getMonth() + 1;
      const subYear = date.getFullYear();

      if (subYear === year) {
        const subsId = sub.subscriptionId;

        if (!monthlyStats[subsId]) {
          monthlyStats[subsId] = Array(12).fill(0);
        }

        monthlyStats[subsId][subMonth - 1]++;
      }
    });

    const series = Object.keys(monthlyStats).map(subsId => ({
      name: subsMasSolicitadas?.find(sub => sub.subscriptionId === subsId)?.subsName || 'Sin Nombre',
      data: monthlyStats[subsId],
    }));

    return series;
  };

  const seriesSubsMasSolicitadasAnual = obtenerSubsMasSolicitadasAnual(subsMasSolicitadas, thisYear.getFullYear())
  const totalSubsAnual = seriesSubsMasSolicitadasAnual.reduce((total, serie) => total.map((value, i) => value + (serie.data[i] || 0)), Array(12).fill(0));
  const totalGeneralAnual = totalSubsAnual.reduce((acc, count) => acc + count, 0);

  //!SUBS MAS SOLICITADAS AÑO VARIABLE


  const obtenerSubsMasSolicitadas = (subsMasSolicitadas: PopularSubs[] | undefined, year: number | undefined) => {
    const monthlyStats: Record<string, number[]> = {};

    subsMasSolicitadas?.forEach((sub: PopularSubs) => {
      const date = new Date(sub.date);
      const subMonth = date.getMonth() + 1;
      const subYear = date.getFullYear();

      if (subYear === year) {
        const subsId = sub.subscriptionId;

        if (!monthlyStats[subsId]) {
          monthlyStats[subsId] = Array(12).fill(0);
        }

        monthlyStats[subsId][subMonth - 1]++;
      }
    });

    const series = Object.keys(monthlyStats).map(subsId => ({
      name: subsMasSolicitadas?.find(sub => sub.subscriptionId === subsId)?.subsName || 'Sin Nombre',
      data: monthlyStats[subsId],
    }));

    return series;
  };

  const seriesSubsMasSolicitadas = obtenerSubsMasSolicitadas(subsMasSolicitadas, yearSubs?.getFullYear())
  const totalSubs = seriesSubsMasSolicitadas.reduce((total, serie) => total.map((value, i) => value + (serie.data[i] || 0)), Array(12).fill(0));
  const totalGeneral = totalSubs.reduce((acc, count) => acc + count, 0);

  useEffect(() => {
    const fetchMyRequests = async () => {

      const id = route.query.id

      try {
        const res = await fetch(
          `/api/insights/?id=` + id,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setMontosMensuales(data.montosMensuales)
          setMontosAnuales(data.montosAnuales)
          setSubsMasSolicitadas(data.subsMasSolicitadas)
          setIsLoading(false);
        }
        if (res.status == 404) {
          route.replace('/404');
        }
        if (res.status == 500) {
          route.replace('/500');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyRequests();
  }, []);


  if (!isLoading) {
    return (
      <Grid>
        <Box sx={{ mb: 5 }}>
          <ChartIngresosMensualesEntrenador direction='ltr' data={dataMensual} total={totalMensual}></ChartIngresosMensualesEntrenador>
        </Box>
        <Box sx={{ mb: 5 }}>
          <ChartSubsUltimoAño series={seriesSubsMasSolicitadasAnual} year={thisYear} total={totalGeneralAnual}></ChartSubsUltimoAño>
        </Box>
        <Box sx={{ mb: 5 }}>
          <ChartSubsMasSolicitadas series={seriesSubsMasSolicitadas} year={yearSubs} total={totalGeneral} updateYear={updateYearSubs}></ChartSubsMasSolicitadas>
        </Box>
        <Box>
          <ChartIngresosAnualesEntrenador direction='ltr' data={dataAnual} total={totalAnual} year={year} updateYear={updateYear}></ChartIngresosAnualesEntrenador>
        </Box>
      </Grid >
    )
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
}

TrainerInsights.acl = {
  action: 'manage',
  subject: 'trainerInsights-page'
}


export default TrainerInsights
