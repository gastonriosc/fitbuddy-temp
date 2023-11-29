// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { min } from 'date-fns'

interface Props {
  direction: 'ltr' | 'rtl'
  data: { weight: number; date: string }[];
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
            <LineChart height={350} data={data} style={{ direction }} margin={{ left: -0 }} >
              <CartesianGrid />
              <XAxis
                dataKey='date'
                reversed={direction === 'rtl'}
              />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} domain={[40]} />
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
