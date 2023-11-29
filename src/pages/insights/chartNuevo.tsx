// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Third Party Imports
import { Scatter } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'

interface ScatterProps {
  green: string
  warning: string
  primary: string
  labelColor: string
  borderColor: string
  legendColor: string
}

const ChartNuevo = (props: ScatterProps) => {
  // ** Props
  const { green, warning, primary, labelColor, borderColor, legendColor } = props

  // ** State
  const [active, setActive] = useState<string | null>('daily')

  const handleActive = (event: MouseEvent<HTMLElement>, newActive: string | null) => {
    setActive(newActive)
  }

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    layout: {
      padding: { top: -20 }
    },
    scales: {
      x: {
        min: 0,
        max: 140,
        grid: {
          drawTicks: false,
          color: borderColor
        },
        ticks: {
          stepSize: 10,
          color: labelColor
        }
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          drawTicks: false,
          color: borderColor
        },
        ticks: {
          stepSize: 100,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const data: ChartData<'scatter'> = {
    datasets: [
      {
        pointRadius: 5,
        label: 'iPhone',
        pointBorderWidth: 2,
        backgroundColor: primary,
        pointHoverBorderWidth: 2,
        borderColor: 'transparent',
        data: [
          { x: 72, y: 225 },
          { x: 81, y: 270 },
          { x: 90, y: 230 },
          { x: 103, y: 305 },
          { x: 103, y: 245 },
          { x: 108, y: 275 },
          { x: 110, y: 290 },
          { x: 111, y: 315 },
          { x: 109, y: 350 },
          { x: 116, y: 340 },
          { x: 113, y: 260 },
          { x: 117, y: 275 },
          { x: 117, y: 295 },
          { x: 126, y: 280 },
          { x: 127, y: 340 },
          { x: 133, y: 330 }
        ]
      },
    ]
  }

  return (
    <Card>
      <CardHeader
        title='New Product Data'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <ToggleButtonGroup exclusive value={active} onChange={handleActive}>
            <ToggleButton value='daily'>Daily</ToggleButton>
            <ToggleButton value='monthly'>Monthly</ToggleButton>
            <ToggleButton value='yearly'>Yearly</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Scatter data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartNuevo
