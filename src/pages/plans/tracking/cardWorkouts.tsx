// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Data {
  _id: string
  date: Date,
  number: number
}

interface Tracking {
  _id: string,
  planId: string,
  data: [Data]
}

interface Props {
  tracking: Tracking
}

const CardWorkoutMensual = (props: Props) => {
  // ** Hook
  const { tracking } = props

  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      theme: 'dark',
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, .3),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, .3),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.3),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.3)
    ],
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
        borderRadius: 8,
        distributed: true,
        columnWidth: '55%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      labels: {
        style: { colors: theme.palette.text.primary }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: theme.palette.text.primary }
      }
    }
  }

  const series = [ //datos en eje y
    {
      name: "Entrenamientos",
      data: [4, 2, 5, 1]
    }
  ];

  return (
    <>
      <Card>
        <Box>
          <CardHeader
            title='Entrenamientos'
            subheader='Total de *ENTRENAMIENTOS* este mes'
            titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
            subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
          />
          <CardContent>
            <ReactApexcharts type='bar' height={373} options={options} series={series} />
            {/* <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6' sx={{ mb: 0.75, fontWeight: 600, color: '#81c784' }}>Hubo un incremento</Typography>
              <Typography variant='body2'>del 32% con respecto al año pasado.</Typography>
            </Box>
          </Box> */}
          </CardContent>
        </Box>
      </Card>
    </>
  )
}

export default CardWorkoutMensual
