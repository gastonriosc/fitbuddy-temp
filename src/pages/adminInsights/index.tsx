// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'

// ** Customs
import ChartIngresosAnuales from './chartIngresosAnuales'
import ChartIngresosMensuales from './chartIngresosMensuales'
import ChartNuevosUsuarios from './chartNuevosUsuarios'

const AdminInsights = () => {


  return (
    <Grid >
      <Box>
        <ChartIngresosMensuales direction='ltr'></ChartIngresosMensuales>
      </Box>
      <Box sx={{ mt: 5 }}>
        <ChartNuevosUsuarios direction='ltr'></ChartNuevosUsuarios>
      </Box>
      <Box sx={{ mt: 5 }}>
        <ChartIngresosAnuales direction='ltr'></ChartIngresosAnuales>
      </Box>
    </Grid>
  )
}

AdminInsights.acl = {
  action: 'manage',
  subject: 'adminInsights-page'
}


export default AdminInsights
