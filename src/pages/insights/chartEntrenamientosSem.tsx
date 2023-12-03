// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { startOfWeek, addDays, addWeeks, format } from 'date-fns';

// ** Util Import

interface Props {
  insights: string[];
}

const ChartNuevosUsuarios = ({ insights }: Props) => {
  // ** Hook
  const [lunesSemanales, setLunesSemanales] = useState<string[]>([])
  const total = insights?.length

  //! grafico de entrenamientos semanales
  function getNextMonday(date: Date): Date {
    const currentDayOfWeek = date.getDay();
    const daysUntilNextMonday = currentDayOfWeek === 0 ? 1 : 8 - currentDayOfWeek;

    return addDays(date, daysUntilNextMonday);
  }

  function getMondaysArray(numberOfMondays: number): string[] {
    const currentDate = new Date();

    const mondaysArray: string[] = [];

    for (let i = 0; i < numberOfMondays; i++) {
      const nextMonday = getNextMonday(addWeeks(currentDate, -i));
      mondaysArray.unshift(format(nextMonday, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
    }

    setLunesSemanales(mondaysArray);
  }



  const contarFechasPorSemana = (fechasBaseDatos: string[], fechasSemanas: string[]): number[] => {
    const contadorSemanas: number[] = Array(fechasSemanas.length).fill(0);

    fechasBaseDatos.forEach((fechaBaseDatos) => {
      const fechaBaseDatosObj = new Date(fechaBaseDatos);

      fechasSemanas.some((fechaSemana, index) => {
        const fechaSemanaObj = new Date(fechaSemana);
        const fechaSiguiente = new Date(fechasSemanas[index + 1] || Infinity);

        if (fechaBaseDatosObj >= fechaSemanaObj && fechaBaseDatosObj < fechaSiguiente) {
          contadorSemanas[index]++;

          return true;
        }

        return false;
      });
    });

    return contadorSemanas;
  };

  const contador = contarFechasPorSemana(insights, lunesSemanales)
  const convertirFormatoFechas = (fechas: string[]): string[] => {
    return fechas.map((fecha) => {
      const fechaObj = new Date(fecha);
      const dia = fechaObj.getDate().toString().padStart(2, '0');
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');

      return `${dia}/${mes}`;
    });
  };

  useEffect(() => {
    getMondaysArray(26)
  }, []);

  const series = [{ name: 'Entrenamientos', data: contador }]
  const theme = useTheme()
  const columnColors = {
    series1: '#826af9',
    series2: '#d2b0ff'
  }
  const options: ApexOptions = {
    chart: {
      offsetX: -10,
      parentHeightOffset: 0,
      stacked: false,
      toolbar: { show: false }
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.secondary },
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    colors: [columnColors.series1, columnColors.series2],

    // colors: [
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, .3),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, .3),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 0.3),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 1),
    //   hexToRGBA(theme.palette.primary.main, 0.3)
    // ],
    grid: {
      show: true,
      borderColor: '#6D6D6D',
      strokeDashArray: 5,
      padding: {
        top: -15,
        left: 10,
        right: 10
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: false,
        columnWidth: '50%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      show: true,
      colors: ['transparent']
    },
    xaxis: {
      axisTicks: { show: true },
      axisBorder: { show: false },
      categories: convertirFormatoFechas(lunesSemanales),
      labels: {
        style: { colors: theme.palette.text.primary }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: theme.palette.text.primary },
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title={`Entrenamientos por semana`}
          subheader={`Total de ${total} entrenamientos`}
          titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
          subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        />
        <CardContent>
          <ReactApexcharts type='bar' height={290} options={options} series={series} />
          {/* <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6' sx={{ mb: 0.75, fontWeight: 600, color: '#81c784' }}>Hubo un incremento</Typography>
              <Typography variant='body2'>del 32% con respecto al año pasado.</Typography>
            </Box>
          </Box> */}
        </CardContent>
      </Card>
    </>
  )
}

export default ChartNuevosUsuarios
