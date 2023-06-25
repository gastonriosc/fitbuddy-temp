
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const MyStudents = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Mis Alumnos' />
          <CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

MyStudents.acl = {
  action: 'manage',
  subject: 'myStudents-page'
}


export default MyStudents
