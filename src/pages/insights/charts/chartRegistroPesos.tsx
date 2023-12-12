// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'

interface DataItem {
  weight: number
  date: Date
}
interface Props {
  direction: 'ltr' | 'rtl'
  data: DataItem[];
  dataPeso: number
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

const ChartRegistroPesos = ({ direction, data, dataPeso }: Props) => {
  const totalTicks = 8;

  // Asegurarte de tener al menos dos fechas para mostrar (la primera y la última)
  const availableDates = data.length >= 2 ? data : [{ date: new Date() }, { date: new Date() }];

  const ticks = Array.from({ length: totalTicks }, (_, index) => {
    if (index === 0) {
      return availableDates[0].date; // El primer tick corresponde a la primera fecha
    } else if (index === totalTicks - 1) {
      return availableDates[availableDates.length - 1].date; // El último tick corresponde a la última fecha
    } else {
      const interval = Math.floor((availableDates.length - 1) / (totalTicks - 1));
      const tickIndex = index * interval;

      return availableDates[tickIndex].date;
    }
  });
  console.log(ticks)
  console.log(data)
  const encontrarPesoMasBajo = (data: DataItem[]): number | undefined => {

    let pesoMasBajo = data[0].weight;


    for (let i = 1; i < data.length; i++) {
      const pesoActual = data[i].weight;
      if (pesoActual < pesoMasBajo) {
        pesoMasBajo = pesoActual;
      }
    }

    return pesoMasBajo;
  };

  const pesoMasBajo = encontrarPesoMasBajo(data);

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
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} domain={[pesoMasBajo]} />
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
