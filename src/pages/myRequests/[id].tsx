import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// ** MUI Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
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

  const [subsRequest, setSubsRequest] = useState<[]>([]);
  const route = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id
      debugger
      try {
        // ** Login API Call to match the user credentials and receive user data in response along with his role
        const res = await fetch('/api/subsRequests/?id=' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        if (res.status == 200) {
          const data = await res.json();
          setSubsRequest(data.subsRequest);
          setIsLoading(true);
        }
        if (res.status == 404) {
          route.replace('/404')
        }
        if (res.status == 500) {
          route.replace('/500')
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyRequests(); //Se llama a la función fetchAlumnoUsers dentro de useEffect. Esto asegura que la llamada a la API se realice solo una vez
  }, []);

  console.log(subsRequest)

  if (isLoading) {
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

  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color="primary" />
      </Box>
    )

  }
}
MyRequests.acl = {
  action: 'manage',
  subject: 'myRequests-page'
}

export default MyRequests
