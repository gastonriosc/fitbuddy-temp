// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import CustomInput from '../../../views/forms/form-elements/pickers/PickersCustomInput'


interface Props {
  direction: 'ltr' | 'rtl'
  data: { pv: number; name: string }[]
  total: number
  year: DateType
  updateYear: (newYear: DateType) => void;
}


const CustomTooltip = (props: TooltipProps<any, any>) => {
  // ** Props
  const { active, payload } = props

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography sx={{ fontSize: '0.875rem' }}>{`${payload[0].value}`}</Typography>
      </div>
    )
  }

  return null
}

const ChartIngresosAnualesEntrenador = ({ direction, data, total, year, updateYear }: Props) => {

  const titleYear = year?.getFullYear()

  return (
    <Card>
      <CardHeader
        title={`Ingresos del año  ${titleYear}`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <Box mr={5}>
              <CustomChip
                skin='light'
                color='success'
                sx={{ fontWeight: 500, borderRadius: 1, fontSize: '0.875rem' }}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                    <Icon icon='mdi:dollar' fontSize='1rem' />
                    <span>{total}</span>
                  </Box>
                }
              />
            </Box>
            <Box>
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
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={data} style={{ direction }} margin={{ left: -0 }}>
              <CartesianGrid
                stroke="#6D6D6D"
                strokeDasharray="5"
                vertical={false}
                horizontal
              />
              <XAxis dataKey='name' reversed={direction === 'rtl'} />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='pv' stroke='#ff9f43' strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ChartIngresosAnualesEntrenador
