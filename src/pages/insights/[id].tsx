// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs
import TrainerInsights from './trainerInsights'
import StudentInsights from './studentInsights'

const MyInsights = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  return (
    <Grid>
      {ability?.can('manage', 'trainerInsights-page') ? (
        <TrainerInsights></TrainerInsights>
      ) : null}
      {ability?.can('manage', 'studentInsights-page') ? (
        <StudentInsights></StudentInsights>
      ) : null}
    </Grid>
  )
}

MyInsights.acl = {
  action: 'manage',
  subject: 'insight-page'
}


export default MyInsights
