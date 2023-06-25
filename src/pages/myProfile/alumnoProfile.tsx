
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const AlumnoProfile = () => {
  return (
    <Grid item md={6} xs={12}>
      <Card>
        <CardHeader title='Mi perfil Alumno' />
        <CardContent>
        </CardContent>
      </Card>
    </Grid>
  )
}

AlumnoProfile.acl = {
  action: 'manage',
  subject: 'perfilAlumno'
}


export default AlumnoProfile
