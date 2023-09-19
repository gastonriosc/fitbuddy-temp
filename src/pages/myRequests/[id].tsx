import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

//import { useSession } from 'next-auth/react';

// ** MUI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid, { GridProps } from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Icon from 'src/@core/components/icon';
import RequestPopUp from './requestPopUp';
import { CardHeader, Divider, FormControl, Input, InputLabel } from '@mui/material';

// Styled Grid component
const StyledGrid1 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    paddingTop: '0 !important',
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(3, 4.75),
    [theme.breakpoints.down('md')]: {
      paddingTop: 0,
    },
  },
}));

// Styled Grid component
const StyledGrid2 = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    paddingLeft: '0 !important',
  },
  [theme.breakpoints.down('md')]: {
    order: -1,
  },
}));

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  height: '11rem',
  borderRadius: theme.shape.borderRadius,
}));

interface subsRequest {
  _id: string;
  description: string;
  status: string;
  trainerId: string;
  studentId: string;
  subscriptionId: string;
  date: string;
  studentName: string;
  subscriptionName: string;
}

const MyRequests = () => {

  const route = useRouter();
  const [subsRequest, setSubsRequest] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestPopUp, setRequestPopUp] = useState<boolean>(false);
  const [typeAction, setTypeAction] = useState<string>('');
  const [subsRequestId, setSubsRequestId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2; // Cantidad de elementos por página


  const aceptarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('aceptar');
    setSubsRequestId(sub._id);
    setTitle('aceptada');

  };

  const rechazarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('rechazar');
    setSubsRequestId(sub._id);
    setTitle('rechazada');
  };

  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id;
      const offset = (currentPage - 1) * itemsPerPage; // Calcular el desplazamiento
      try {
        // ** Llamada a la API para obtener datos paginados
        const res = await fetch(
          `/api/subsRequests/?id=${id}&offset=${offset}&limit=${itemsPerPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setSubsRequest(data.subsRequest);
          setIsLoading(true);
        }

        // ...
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyRequests();
  }, [currentPage]); // Actualizar cuando cambie la página actual

  console.log(subsRequest);

  const totalPages = Math.ceil(subsRequest.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <>
        <Grid spacing={2}>
          <Card>
            <CardHeader
              title='Filtros'
              sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input-plan'>Plan</InputLabel>
                    <Input
                      fullWidth
                      value={filterPlan}
                      id='search-input-plan'
                      onChange={(e) => setFilterPlan(e.target.value)}
                      placeholder='Ingrese un plan para buscar'
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input'>Fecha</InputLabel>
                    <Input
                      fullWidth
                      value={filterDate}
                      id='search-input'
                      onChange={(e) => setFilterDate(e.target.value)}
                      placeholder='Ingrese una fecha para buscar (DD/M/YYYY)'
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input'>Nombre</InputLabel>
                    <Input
                      fullWidth
                      value={filterName}
                      id='search-input'
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder='Ingrese un nombre para buscar'
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
          </Card>

          {subsRequest
            .filter((sub: subsRequest) =>
              sub.studentName.toLowerCase().includes(filterName.toLowerCase()) &&
              sub.subscriptionName.toLowerCase().includes(filterPlan.toLowerCase()) &&
              (filterDate === '' ||
                new Date(sub.date).toLocaleDateString().includes(filterDate))
            )
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((sub: subsRequest, index) => (
              <Card key={index} sx={{ marginBottom: 2, marginTop: 2 }}>
                <Grid container spacing={6}>
                  <StyledGrid2 item xs={12} md={3}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Img alt='Avatar' src='/images/avatars/1.png' />
                    </CardContent>
                  </StyledGrid2>
                  <StyledGrid1 item xs={12} md={9}>
                    <CardContent sx={{ p: (theme) => `${theme.spacing(6)} !important`, flexGrow: 1 }}>
                      <Typography variant='h5' sx={{ mb: 2 }}>
                        {sub.studentName}
                      </Typography>
                      <Box display='flex'>
                        <Typography variant='body1' color='light-grey' sx={{ mb: 2 }}>
                          Tipo de plan:
                          <Chip sx={{ mx: 2 }} label={sub.subscriptionName} />
                        </Typography>
                        <Typography>
                          Fecha:
                          <Chip sx={{ mx: 2 }} label={new Date(sub.date).toLocaleDateString()} />
                        </Typography>
                      </Box>
                      <Typography variant='body1' sx={{ mb: 2 }}>
                        {sub.description}
                      </Typography>
                    </CardContent>
                    <CardActions className='card-action-dense' sx={{ width: '100%', mb: 2 }}>
                      <Box marginRight={1}>
                        <Button
                          variant='contained'
                          color='success'
                          title='Aceptar'
                          onClick={() => aceptarSubsRequest(sub)}

                          href={'/plans/newPlan/?id=' + sub.studentId}
                        >
                          <Icon icon='line-md:confirm' />
                        </Button>
                      </Box>
                      <Box marginRight={1}>
                        <Button
                          variant='contained'
                          color='error'
                          title='Rechazar'
                          onClick={() => rechazarSubsRequest(sub)}
                        >
                          <Icon icon='iconoir:cancel' />
                        </Button>
                      </Box>
                      <Box marginRight={1}>
                        <Button
                          variant='contained'
                          color='primary'
                          title='Perfil'
                          href={'/myProfile/myStudentProfile/' + sub.studentId}
                        >
                          <Icon icon='mdi:eye' />
                        </Button>
                      </Box>
                    </CardActions>
                  </StyledGrid1>
                </Grid>
              </Card>
            ))}
        </Grid>
        <div>
          <Button onClick={prevPage} disabled={currentPage === 1}>
            Página Anterior
          </Button>
          <Button onClick={nextPage} disabled={currentPage === totalPages}>
            Página Siguiente
          </Button>
        </div>
        <RequestPopUp
          requestPopUp={requestPopUp}
          setRequestPopUp={setRequestPopUp}
          type={typeAction}
          title={title}
          requestId={subsRequestId}
          subsRequest={subsRequest}
          setSubsRequest={setSubsRequest}
        />
      </>
    );
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
};

MyRequests.acl = {
  action: 'manage',
  subject: 'myRequests-page',
};

export default MyRequests;
