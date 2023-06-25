
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const EntrenadorProfile = () => {
  return (
    <Grid item md={6} xs={12}>
      <Card>
        <CardHeader title='Mi perfil Entrenador' />
        <CardContent>
        </CardContent>
      </Card>
    </Grid>
  )
}

EntrenadorProfile.acl = {
  action: 'manage',
  subject: 'perfilEntrenador'
}


export default EntrenadorProfile
