/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'


interface Data {
  _id: string
  date: Date,
  number: number,
  difficult: number,
  fatigue: number
}

interface Tracking {
  _id: string,
  planId: string,
  data: [Data]
}

interface Props {
  tracking: Tracking
}

const CardTrackingFatigueReport = (props: Props) => {
  // ** Hook
  const theme = useTheme()

  const { tracking } = props

  const counts: { [key: number]: number } = {};
  let cont = 0;

  tracking.data.forEach(item => {
    cont += 1;
    const fatigue = item.fatigue;
    counts[fatigue] = (counts[fatigue] || 0) + 1;
  });

  const resultArray = [];
  for (let i = 1; i <= 4; i++) {
    resultArray.push(counts[i] || 0);
  }

  const seriesData = [{ data: resultArray }];

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: -10 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      }
    },
    tooltip: {
      theme: 'dark',
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      },

    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: [
        'Poco', 'Moderado', 'Considerable', 'Extremo'
      ]
    }
  }

  return (
    <Card>
      <CardHeader
        title='Cansancio del entrenamiento'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}

      />
      <CardContent>
        <ReactApexcharts type='line' height={373} options={options} series={seriesData} />
      </CardContent>
    </Card>
  )
}

export default CardTrackingFatigueReport
