
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Search = () => {
  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Buscar' />
          <CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Search.acl = {
  action: 'manage',
  subject: 'search-page'
}


export default Search
