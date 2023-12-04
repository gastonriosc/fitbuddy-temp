// ** React Imports

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// ** Context Imports
import CircularProgress from '@mui/material/CircularProgress';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import { DateType } from 'src/types/forms/reactDatepickerTypes';

// ** Customs
import ChartIngresosMensualesEntrenador from '../insights/charts/chartIngresosMensuales'
import ChartIngresosAnualesEntrenador from '../insights/charts/chartIngresosAnuales'
import ChartNuevosUsuarios from './chartNuevosUsuarios'

interface User {
  role: string,
  registrationDate: Date
}

interface amount {
  amount: number;
  date: Date
}

const AdminInsights = () => {

  // ** Hook
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const [newUsers, setNewUsers] = useState<User[]>();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [yearIngresos, setYearIngresos] = useState<DateType>(new Date());
  const [yearUsuarios, setYearUsuarios] = useState<DateType>(new Date());

  const updateYearIngresos = (newYear: DateType) => {
    setYearIngresos(newYear);
  };

  const updateYearUsuarios = (newYear: DateType) => {
    setYearUsuarios(newYear);
  };

  //! MONTOS MENSUALES
  const [montosMensuales, setMontosMensuales] = useState<amount[] | undefined>()
  const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
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

  //! MONTOS ANUALES
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
  const dataAnual = obtenerDatosAnuales(montosAnuales, yearIngresos?.getFullYear());
  const totalAnual = (montosAnuales ?? []).filter((item) => new Date(item.date).getFullYear() === yearIngresos?.getFullYear()).reduce((acc, item) => acc + item.amount, 0);
  console.log(montosAnuales)

  //! USUARIOS ANUALES
  console.log(newUsers)
  const monthlyStats = {
    Entrenadores: Array(12).fill(0),
    Alumnos: Array(12).fill(0),
  };

  const obtenerNuevosUsuarios = (users: User[] | undefined, year: DateType | undefined) => {
    users?.forEach((user: User) => {
      const registrationDate = new Date(user.registrationDate);

      const userMonth = registrationDate.getMonth() + 1;
      const userYear = registrationDate.getFullYear();

      if (userYear === year?.getFullYear() && userMonth <= currentMonth) {
        if (user.role === 'Entrenador') {
          monthlyStats.Entrenadores[userMonth - 1]++;
        } else if (user.role === 'Alumno') {
          monthlyStats.Alumnos[userMonth - 1]++;
        }
      }
    });

    const series = [
      {
        name: 'Entrenadores',
        data: monthlyStats.Entrenadores,
      },
      {
        name: 'Alumnos',
        data: monthlyStats.Alumnos,
      },
    ];

    return series
  }

  const seriesUsuarios = obtenerNuevosUsuarios(newUsers, yearUsuarios)
  const totalEntrenadores = monthlyStats.Entrenadores.reduce((acc, count) => acc + count, 0);
  const totalAlumnos = monthlyStats.Alumnos.reduce((acc, count) => acc + count, 0);
  const totalUsuarios = totalEntrenadores + totalAlumnos;

  useEffect(() => {
    const fetchMyRequests = async () => {

      try {
        const res = await fetch(
          `/api/adminInsights/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setNewUsers(data.newUsers);
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
      <Grid >
        <Box>
          <ChartIngresosMensualesEntrenador direction='ltr' data={dataMensual} total={totalMensual}></ChartIngresosMensualesEntrenador>
        </Box>
        <Box sx={{ mt: 5 }}>
          <ChartNuevosUsuarios series={seriesUsuarios} total={totalUsuarios} year={yearUsuarios} updateYear={updateYearUsuarios}></ChartNuevosUsuarios>
        </Box>
        <Box sx={{ mt: 5 }}>
          <ChartIngresosAnualesEntrenador direction='ltr' data={dataAnual} total={totalAnual} year={yearIngresos} updateYear={updateYearIngresos}></ChartIngresosAnualesEntrenador>
        </Box>
      </Grid>
    )
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
}

AdminInsights.acl = {
  action: 'manage',
  subject: 'adminInsights-page'
}


export default AdminInsights
