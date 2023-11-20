// ** React Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// ** MUI Imports
import Card from '@mui/material/Card'

import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports

import { ApexOptions } from 'apexcharts'


// ** Icon Imports


// ** Types


// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const columnColors = {
  series1: '#826af9',
  series2: '#d2b0ff'
}

// interface PickerProps {
//   start: Date | number
//   end: Date | number
// }




interface User {
  role: string,
  registrationDate: Date
}

const ApexColumnChart = () => {
  // ** Hook
  const theme = useTheme()
  const route = useRouter();
  const [newUsers, setNewUsers] = useState<User[]>();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Los meses en JavaScript son de 0 a 11, por eso sumamos 1

  // Inicializa un objeto para almacenar las estadísticas mensuales por rol
  const monthlyStats = {
    Entrenadores: Array(12).fill(0), // Inicializa un array de 12 elementos con valores 0
    Alumnos: Array(12).fill(0),
  };

  newUsers?.forEach((user: User) => {
    const registrationDate = new Date(user.registrationDate);

    const userMonth = registrationDate.getMonth() + 1;
    const userYear = registrationDate.getFullYear();

    // Verifica si el usuario está registrado en el año y mes actual
    if (userYear === currentYear && userMonth <= currentMonth) {
      // Incrementa el contador correspondiente al rol del usuario
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
          console.log(data.newUsers)
          console.log(newUsers)
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
  }, [newUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  // ** States
  // const [endDate, setEndDate] = useState<DateType>(null)
  // const [startDate, setStartDate] = useState<DateType>(null)

  const options: ApexOptions = {
    chart: {
      offsetX: -10,
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    colors: [columnColors.series1, columnColors.series2],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.primary },
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    stroke: {
      show: true,
      colors: ['transparent']
    },
    plotOptions: {
      bar: {
        columnWidth: '70%',

      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%'
            }
          }
        }
      }
    ]
  }

  // const CustomInput = forwardRef((props: PickerProps, ref) => {
  //   const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  //   const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  //   const value = `${startDate}${endDate !== null ? endDate : ''}`

  //   return (
  //     <TextField
  //       {...props}
  //       size='small'
  //       value={value}
  //       inputRef={ref}
  //       InputProps={{
  //         startAdornment: (
  //           <InputAdornment position='start'>
  //             <Icon icon='mdi:bell-outline' />
  //           </InputAdornment>
  //         ),
  //         endAdornment: (
  //           <InputAdornment position='end'>
  //             <Icon icon='mdi:chevron-down' />
  //           </InputAdornment>
  //         )
  //       }}
  //     />
  //   )
  // })

  // const handleOnChange = (dates: any) => {
  //   const [start, end] = dates
  //   setStartDate(start)
  //   setEndDate(end)
  // }

  return (
    <Card>
      <CardHeader
        title={`Ingresos del año de ${currentYear}`}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <ReactApexcharts type='bar' height={400} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default ApexColumnChart
