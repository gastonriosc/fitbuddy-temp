// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from '../../../views/forms/form-elements/pickers/PickersCustomInput'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface DataItem {
  weight: number
  date: Date
}
interface Props {
  direction: 'ltr' | 'rtl'
  data: DataItem[];
  dataPeso: number
  startDate: DateType
  endDate: DateType
  handleOnChangeDates: (dates: any) => void;
}

const CustomTooltip = (props) => {
  // ** Props
  const { active, payload, label } = props;

  if (active && payload) {
    return (
      <div >
        <Typography sx={{ fontSize: '0.875rem' }}>{`Fecha: ${label}`}</Typography>
        <Typography sx={{ fontSize: '0.875rem' }}>{`Peso: ${payload[0].value}kg`}</Typography>
      </div>
    );
  }

  return null;
};

const ChartRegistroPesos = ({ direction, data, dataPeso, startDate, endDate, handleOnChangeDates }: Props) => {

  // const encontrarPesoMasBajo = (data: DataItem[]): number | undefined => {

  //   let pesoMasBajo = data[0].weight;


  //   for (let i = 1; i < data.length; i++) {
  //     const pesoActual = data[i].weight;
  //     if (pesoActual < pesoMasBajo) {
  //       pesoMasBajo = pesoActual;
  //     }
  //   }

  //   return pesoMasBajo;
  // };

  // const pesoMasBajo = encontrarPesoMasBajo(data);

  // const encontrarPesoMasAlto = (data: DataItem[]): number | undefined => {

  //   let pesoMasAlto = data[0].weight;


  //   for (let i = 1; i < data.length; i++) {
  //     const pesoActual = data[i].weight;
  //     if (pesoActual > pesoMasAlto) {
  //       pesoMasAlto = pesoActual;
  //     }
  //   }

  //   return pesoMasAlto;
  // };

  // const pesoMasAlto = encontrarPesoMasAlto(data);




  return (
    <Card>
      <CardHeader
        title={`Registro de pesos`}
        subheader={`El primer registro de peso en FitBuddy fue de ${dataPeso} kg.`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
              <DatePicker
                selectsRange
                maxDate={new Date()}
                endDate={endDate}
                dateFormat='dd/MM/yyyy'
                selected={startDate}

                startDate={startDate}
                id='date-range-picker'
                onChange={(dates: any) => handleOnChangeDates(dates)}
                shouldCloseOnSelect={false}

                customInput={
                  <CustomInput label='Seleccione rango' />
                }
              />
            </DatePickerWrapper>
          </Box>

        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={data} style={{ direction }} margin={{ left: -0, right: 30 }} >
              <CartesianGrid
                stroke="#6D6D6D"
                strokeDasharray="5"
                vertical={false}
                horizontal
              />
              <XAxis
                dataKey='date'
                reversed={direction === 'rtl'}

              />
              <YAxis
                orientation={direction === 'rtl' ? 'right' : 'left'}

              // domain={[pesoMasBajo, pesoMasAlto]}

              />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='weight' stroke='#ff9f43' strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ChartRegistroPesos
