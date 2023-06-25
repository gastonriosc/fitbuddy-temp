
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const newPlan = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Nuevo Plan' />
          <CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

newPlan.acl = {
  action: 'manage',
  subject: 'newPlan-page'
}

export default newPlan
