// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Customs
import AlumnoProfile from './alumnoSettings'
import EntrenadorProfile from './entrenadorSettings'
import AdminProfile from './adminSettings'

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
      {ability?.can('manage', 'perfilAdmin') ? (
        <AdminProfile></AdminProfile>
      ) : null}
    </Grid>
  )
}

MyProfile.acl = {
  action: 'manage',
  subject: 'mySettings-page'
}


export default MyProfile
