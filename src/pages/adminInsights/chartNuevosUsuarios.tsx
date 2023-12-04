// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import CustomInput from '../../views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Util Import

interface Props {
  series: {
    name: string;
    data: number[];
  }[];
  total: number
  year: DateType
  updateYear: (newYear: DateType) => void;
}

const ChartNuevosUsuarios = ({ series, total, year, updateYear }: Props) => {
  // ** Hook
  const titleYear = year?.getFullYear()

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
        top: -5,
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
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      labels: {
        style: { colors: theme.palette.text.primary }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: theme.palette.text.primary },
        formatter: (value) => {
          return value.toFixed(0);
        },
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title={`Nuevos usuarios en ${titleYear}`}
          subheader={`Total de ${total} nuevos usuarios en este año`}
          titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
          subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
                <DatePicker
                  showYearPicker
                  selected={year}
                  id='year-picker'
                  dateFormat='yyyy'
                  maxDate={new Date()}
                  onChange={(date: Date) => updateYear(date)}
                  customInput={<CustomInput label='Selecciona el año' />}
                />
              </DatePickerWrapper>
            </Box>

          }
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
