// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#40CDFA',
  series5: '#ffa1a1'
}

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


const CardTrackingDifficult = (props: Props) => {
  // ** Hook
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

  const theme = useTheme()

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: ['Fácil', 'Moderado', 'Intenso', 'Muy intenso'],
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: 'Registros',
              formatter: () => '',
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }



  return (
    <Card>
      <CardHeader
        title='¿Qué tan difícil le pareció el entrenamiento?'
        subheader={`Total de ${cont} registros`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <ReactApexcharts type='donut' height={400} options={options} series={resultArray} />
      </CardContent>
    </Card>
  )
}

export default CardTrackingDifficult
