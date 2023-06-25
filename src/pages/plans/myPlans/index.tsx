
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const myPlans = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Mis Planes' />
          <CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

myPlans.acl = {
  action: 'manage',
  subject: 'myPlans-page'
}


export default myPlans
