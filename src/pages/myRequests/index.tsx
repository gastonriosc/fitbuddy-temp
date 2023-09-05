import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Grid, { GridProps } from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

// Styled Grid component
const StyledGrid1 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    paddingTop: '0 !important'
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3, 4.75),
    [theme.breakpoints.down('md')]: {
      paddingTop: 0
    }
  }
}))

// Styled Grid component
const StyledGrid2 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '0 !important'
  },
  [theme.breakpoints.down('md')]: {
    order: -1
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  height: '11rem',
  borderRadius: theme.shape.borderRadius
}))

const MyRequests = () => {
  return (
    <Card>
      <Grid container spacing={6}>
        <StyledGrid2 item xs={12} md={3}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Img alt='Avatar' src='/images/avatars/3.png' />
          </CardContent>
        </StyledGrid2>
        <StyledGrid1 item xs={12} md={9}>
          <CardContent sx={{ p: theme => `${theme.spacing(6)} !important`, flexGrow: 1 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Gastón Ríos Cardona
            </Typography>
            <Typography variant='body1' color='light-grey' sx={{ mb: 2 }}>
              Tipo de plan:
              <Chip sx={{ mx: 2 }} label='Basic' />
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Estoy buscando un plan de entrenamiento que me permita aumentar mi masa muscular.
            </Typography>
          </CardContent>
          <CardActions className='card-action-dense' sx={{ width: '100%', mb: 2 }}>
            <Button variant='contained' color='success'>Aceptar</Button>
            <Button variant='contained' color='error'>Rechazar</Button>
          </CardActions>
        </StyledGrid1>
      </Grid>
    </Card>
  )
}

MyRequests.acl = {
  action: 'manage',
  subject: 'myRequests-page'
}

export default MyRequests
