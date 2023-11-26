// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

// ** Context Imports
import { Box } from '@mui/system'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs
import ChartIngresosAnualesEntrenador from './chartIngresosAnuales'
import ChartIngresosMensualesEntrenador from './chartIngresosMensuales'
import CircularProgress from '@mui/material/CircularProgress';

interface amount {
  amount: number;
  date: Date
}

const TrainerInsights = () => {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();




  //!MENSUAL
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

  //!ANUAL
  const [montosAnuales, setMontosAnuales] = useState<amount[] | undefined>();
  const obtenerDatosAnuales = (montosAnuales: amount[] | undefined) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dataAnual = meses.map((mes, index) => {
      const totalMes = (montosAnuales ?? [])
        .filter((item) => new Date(item.date).getMonth() === index)
        .reduce((acc, item) => acc + item.amount, 0);

      return { pv: totalMes, name: mes };
    });

    return dataAnual;
  };
  const dataAnual = obtenerDatosAnuales(montosAnuales);
  const totalAnual = (montosAnuales ?? []).reduce((acc, item) => acc + item.amount, 0);



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
        <Box>
          <ChartIngresosAnualesEntrenador direction='ltr' data={dataAnual} total={totalAnual}></ChartIngresosAnualesEntrenador>
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
