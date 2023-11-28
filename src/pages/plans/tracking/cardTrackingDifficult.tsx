/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports

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

// import CardTrackingDifficult from 'src/pages/plans/tracking/cardTrackingDifficult'

const columnColors = {
  bg: 'transparent',
  series1: '#826af9',
  series2: '#d2b0ff'
}



interface Data {
  _id: string
  date: Date,
  number: number,
  difficult: number
}

interface Tracking {
  _id: string,
  planId: string,
  data: [Data]
}

interface Props {
  tracking: Tracking
}

const CardTrackingDifficult = (props: Props) => {
  // ** Hook
  const theme = useTheme()

  const { tracking } = props

  const counts: { [key: number]: number } = {};
  let cont = 0;

  tracking.data.forEach(item => {
    cont += 1;
    const number = item.difficult;
    counts[number] = (counts[number] || 0) + 1;
  });

  const resultArray = [];
  for (let i = 1; i <= 4; i++) {
    resultArray.push(counts[i] || 0);
  }

  const seriesData = [{ data: resultArray }];

  // ** States

  const options: ApexOptions = {
    chart: {
      offsetX: -10,
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      theme: 'dark',
    },
    dataLabels: { enabled: false },
    colors: [columnColors.series1, columnColors.series2],
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
    stroke: {
      show: true,
      colors: ['transparent']
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        colors: {
          backgroundBarRadius: 10,
          backgroundBarColors: [columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg]
        }
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
      categories: ['Facil', 'Moderado', 'Intenso', 'Muy intenso'],
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



  return (
    <Card>
      <CardHeader
        title='Dificultad del entrenamiento'
        subheader='¿Qué tan díficil le pareció el entrenamiento?'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}

      />
      <CardContent>
        <ReactApexcharts type='bar' height={373} options={options} series={seriesData}
        />
      </CardContent>
    </Card>
  )
}

export default CardTrackingDifficult
