// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs


const TrainerInsights = () => {


  return (
    <Grid container spacing={6}>

    </Grid>
  )
}

TrainerInsights.acl = {
  action: 'manage',
  subject: 'trainerInsights-page'
}


export default TrainerInsights
