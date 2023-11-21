// ** React Imports

// ** Context Imports
import { Box } from '@mui/system'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs
import ChartIngresosAnualesEntrenador from './chartIngresosAnuales'
import ChartIngresosMensualesEntrenador from './chartIngresosMensuales'

const TrainerInsights = () => {


  return (
    <Grid>
      <Box sx={{ mb: 5 }}>
        <ChartIngresosMensualesEntrenador direction='ltr'></ChartIngresosMensualesEntrenador>
      </Box>
      <Box>
        <ChartIngresosAnualesEntrenador direction='ltr'></ChartIngresosAnualesEntrenador>
      </Box>
    </Grid>
  )
}

TrainerInsights.acl = {
  action: 'manage',
  subject: 'trainerInsights-page'
}


export default TrainerInsights
