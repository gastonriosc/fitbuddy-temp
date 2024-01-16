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
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { useState } from 'react'
import NewInsightItem from '../newInsightItem'
import { addDays } from 'date-fns';
import DeleteInsight from '../deleteInsight'

interface StudentInsightItem {
  _id: string;
  name: string;
  dataOfItem: StudentInsightDataOfItem[];
}

interface StudentInsightDataOfItem {
  _id: string;
  date: Date;
  weight: number;
  deleted: boolean;
}
interface Props {
  direction: 'ltr' | 'rtl'
  data: StudentInsightItem;

  // startDate: DateType
  // endDate: DateType
  // handleOnChangeDates: (dates: any) => void;
}

const CustomTooltip = (props: any) => {
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

const ChartRegistroPesos = ({ direction, data }: Props) => {
  const [dataChart, setDataChart] = useState<StudentInsightItem>(data)
  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [borrarRegistro, setBorrarRegistro] = useState<boolean>(false)
  const currentEndDate = new Date();
  currentEndDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 0);
  const [startDate, setStartDate] = useState<DateType>(addDays(currentEndDate, -183))
  const [endDate, setEndDate] = useState<DateType>(currentDate)

  const handleOnChangeDates = (dates: any) => {
    const [start, end] = dates
    setStartDate(start);
    setEndDate(end);

  };

  const transformarDatosAFormatoSeries = (datos: StudentInsightItem, startDate: DateType, endDate: DateType) => {
    const seriesTransformadas = {
      data: datos?.dataOfItem
        .map(item => ({
          weight: item.weight,
          date: new Date(item.date), // Mantener la fecha como objeto
        }))
        .filter(item => item.date >= startDate && item.date <= endDate?.setHours(23, 59, 59, 0))
        .sort((a, b) => a.date.getTime() - b.date.getTime()) // Ordenar directamente por fecha
        .map(item => ({
          weight: item.weight,
          date: formatDate(item.date),
        })),
    };

    return seriesTransformadas;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const series = transformarDatosAFormatoSeries(dataChart, startDate, endDate);

  // const first = dataChart.dataOfItem.map(item => ({
  //   weight: item.weight,
  //   date: new Date(item.date), // Mantener la fecha como objeto
  // })).sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <Card>
      <CardHeader
        title={`${dataChart.name.toUpperCase()}`}

        // subheader={`El primer registro en FitBuddy fue de ${first[0].weight} kg.`}
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
            <Box sx={{ mx: 4, my: 2, display: 'flex' }}>
              <Button sx={{ mr: 2 }} variant='contained' onClick={() => setNuevoRegistro(true)}>
                <Icon icon='mdi:plus' />
              </Button>
              <Button variant='contained' color='error' onClick={() => setBorrarRegistro(true)}>
                <Icon icon='mdi:trash' />
              </Button>
            </Box>
          </Box>

        }

      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={series.data} style={{ direction }} margin={{ left: -0, right: 30 }} >
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
                orientation={direction === 'rtl' ? 'right' : 'left'} domain={[50, 62]}
              />
              <Tooltip content={CustomTooltip} />
              <Line dataKey='weight' stroke='#ff9f43' strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
      <NewInsightItem setNuevoRegistro={setNuevoRegistro} nuevoRegistro={nuevoRegistro} dataPeso={dataChart.dataOfItem} setDataPeso={setDataChart} dataId={data._id} name={data.name.toLocaleLowerCase()} />
      <DeleteInsight setBorrarRegistro={setBorrarRegistro} borrarRegistro={borrarRegistro} dataPeso={dataChart.dataOfItem} setDataPeso={setDataChart} dataId={data._id} />
    </Card>
  )
}

export default ChartRegistroPesos
