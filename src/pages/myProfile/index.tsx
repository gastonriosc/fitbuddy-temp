// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs
import AlumnoProfile from './alumnoProfile'
import EntrenadorProfile from './entrenadorProfile'

const MyProfile = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  return (
    <Grid container spacing={6}>
      {ability?.can('manage', 'perfilEntrenador') ? (
        <EntrenadorProfile></EntrenadorProfile>
      ) : null}
      {ability?.can('manage', 'perfilAlumno') ? (
        <AlumnoProfile></AlumnoProfile>
      ) : null}
    </Grid>
  )
}

MyProfile.acl = {
  action: 'manage',
  subject: 'myProfile-page'
}


export default MyProfile
