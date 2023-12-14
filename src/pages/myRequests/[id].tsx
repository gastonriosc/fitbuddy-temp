/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

//import { useSession } from 'next-auth/react';

// ** MUI Imports
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid, { GridProps } from '@mui/material/Grid';
import Icon from 'src/@core/components/icon';

import RequestPopUp from './requestPopUp';
import { CardHeader, FormControl, Input, InputLabel, Select, MenuItem } from '@mui/material';
import CustomChip from 'src/@core/components/mui/chip'
import { useSession } from 'next-auth/react';

// Styled Grid component
const StyledGrid1 = styled(Grid)<GridProps>(({ }) => ({
}));

// Styled Grid component
const StyledGrid2 = styled(Grid)<GridProps>(({ }) => ({
}));

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
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
  avatar: string;
  amount: number
  disease: string
  subscriptionDaysPerWeek: number
  subscriptionFollowing: string
  subscriptionIntensity: string
  trainerName: string
  trainerAvatar: string
  expirationDate: string
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
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOption, setFilterOption] = useState('desc');
  const [filterState, setFilterState] = useState<string>('vigentes');
  const [nameSubs, setNameSubs] = useState([])

  const session = useSession();

  const itemsPerPage = 2;
  const aceptarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('aceptar');
    setSubsRequestId(sub._id);
    setTitle('aceptada');

  };

  const esEntrenador = session && session.data && session.data.user && session.data.user.role === 'Entrenador';

  const rechazarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('rechazar');
    setSubsRequestId(sub._id);
    setTitle('rechazada');
  };

  const borrarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('borrar');
    setSubsRequestId(sub._id);
    setTitle('borrar');
  };

  const cancelarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('cancelar');
    setSubsRequestId(sub._id);
    setTitle('cancelada');
  };

  useEffect(() => {
    const fetchData = async () => {
      const id = route.query.id;

      try {
        if (session?.data?.user.role === 'Entrenador') {
          // Llamada a la API específica para Entrenador
          const res1 = await fetch(`/api/subsRequests/?id=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res1.status === 200) {
            const data1 = await res1.json();
            console.log('data1:', data1)
            setSubsRequest(data1.subsRequest);
            setNameSubs(data1.nameSubs);
            setIsLoading(true);
          } else if (res1.status === 404) {
            route.replace('/404');
          } else if (res1.status === 500) {
            route.replace('/500');
          }
        } else if (session?.data?.user.role === 'Alumno') {
          // Llamada a la API específica para Alumno
          const res2 = await fetch(`/api/subsRequestsStudent/?id=${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res2.status === 200) {
            const data2 = await res2.json();
            console.log('data2:', data2)
            setSubsRequest(data2.subsRequest);
            setNameSubs(data2.nameSubs);
            setIsLoading(true);
          } else if (res2.status === 404) {
            route.replace('/404');
          } else if (res2.status === 500) {
            route.replace('/500');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [session, route.query.id]); // Dependencias para ejecutar cuando cambie la sesión o la ID de la ruta


  const filteredSubs = subsRequest
    .filter((sub: subsRequest) => {
      const lowercaseFilterName = filterName.toLowerCase();
      const lowercaseFilterPlan = filterPlan.toLowerCase();

      if (esEntrenador) {
        return (
          sub.studentName.toLowerCase().includes(lowercaseFilterName) &&
          sub.subscriptionName.toLowerCase().includes(lowercaseFilterPlan)
        );
      } else {
        return (
          sub.trainerName.toLowerCase().includes(lowercaseFilterName) &&
          sub.subscriptionName.toLowerCase().includes(lowercaseFilterPlan)
        );
      }
    })
    .filter((sub: subsRequest) => {
      if (filterState === 'vigentes') {
        return new Date(sub.expirationDate) > new Date();
      } else {
        return new Date(sub.expirationDate) <= new Date();
      }
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (filterOption === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

  const totalPages = Math.max(1, Math.ceil(filteredSubs.length / itemsPerPage));

  const paginatedSubs = filteredSubs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



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
                <Grid item sm={3} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input-plan'>Plan</InputLabel>
                    <Select
                      label='Plan'
                      fullWidth
                      value={filterPlan}
                      id='search-input-plan'
                      onChange={(e) => setFilterPlan(e.target.value)}
                    >
                      <MenuItem value=''>SIN FILTRO</MenuItem>
                      {Array.from(new Set(subsRequest.map((subs: subsRequest) => subs.subscriptionName))).map((uniqueSubscriptionName, index) => (
                        <MenuItem key={index} value={uniqueSubscriptionName}>
                          {uniqueSubscriptionName.toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input'>Fecha</InputLabel>
                    <Select
                      label='Fecha'
                      fullWidth
                      value={filterOption}
                      id='search-input'
                      onChange={(e) => setFilterOption(e.target.value)}
                    >
                      <MenuItem value='asc'>MAS ANTIGUOS</MenuItem>
                      <MenuItem value='desc'>MAS RECIENTES</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input'>Estado</InputLabel>
                    <Select
                      label='Estado'
                      fullWidth
                      value={filterState}
                      id='search-input'
                      onChange={(e) => setFilterState(e.target.value)}
                    >
                      <MenuItem value='vigentes'>VIGENTES</MenuItem>
                      <MenuItem value='novigentes'>NO VIGENTES</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={3} xs={12}>
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
          </Card>

          {subsRequest.length > 0 ? (
            paginatedSubs.map((sub: subsRequest, index) => (
              <Card key={index} sx={{ marginBottom: 2, marginTop: 2, opacity: new Date(sub.expirationDate) <= new Date() ? 0.7 : 1 }}>
                <Grid container spacing={0}>
                  <StyledGrid2 item xs={12} md={2} sx={{ alignItems: 'center', justifyContent: 'center', pt: 3, pl: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {esEntrenador && (<Img alt='Avatar' src={sub.avatar} sx={{ width: '170px', height: '170px' }} />)}
                      {!esEntrenador && (<Img alt='Avatar' src={sub.trainerAvatar} sx={{ width: '170px', height: '170px' }} />)}
                    </CardContent>
                  </StyledGrid2>
                  <StyledGrid1 item xs={12} md={10}>
                    <Box sx={{ display: { md: 'flex' } }} >
                      <CardContent sx={{ p: (theme) => `${theme.spacing(6)} !important`, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                          <Box>
                            <Typography variant='h5' sx={{ mb: 2 }}>
                              {esEntrenador && sub.studentName}
                              {!esEntrenador && sub.trainerName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant='h5' sx={{ mb: 2 }}>
                              <CustomChip sx={{ mx: 2 }} skin='light' color='warning' label={new Date(sub.date).toLocaleDateString('es-ES')} />
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant='h5' sx={{ mb: 2 }}>
                              <CustomChip sx={{ mx: 2 }} skin='light' color='success'
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                                    <Icon icon='mdi:arrow-up' fontSize='1rem' />
                                    <span>${sub.amount}</span>
                                  </Box>
                                }
                              />
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant='body1' sx={{ mb: 2 }}>
                          <ul>
                            <li>
                              <b>Descripción de la solicitud:</b> {sub.description}
                            </li>
                            <li>
                              Características del plan solicitado:
                              <ul>
                                <li>
                                  <b>Nombre:</b> {sub.subscriptionName}
                                </li>
                                <li>
                                  <b>Días de entrenamiento por semana:</b> {sub.subscriptionDaysPerWeek}
                                </li>
                                <li>
                                  <b>Seguimiento:</b> {sub.subscriptionFollowing}
                                </li>
                                <li>
                                  <b>Intensidad:</b> {sub.subscriptionIntensity}
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </Typography>
                        <Typography sx={{ mb: 2, fontSize: '13px' }}>
                          <CustomChip sx={{ mx: 2 }} skin='light' rounded color='primary'
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                                <Icon icon='mdi:pencil' fontSize='1rem' />
                                <span><b>Observaciones:</b>  </span>
                              </Box>
                            }
                          />
                          {sub.disease ? sub.disease : "No presenta"}
                        </Typography>
                      </CardContent>
                      <CardContent sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: 'center', justifyContent: 'center', mt: { md: 5 }, mr: { md: 3 } }}>
                        <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                          {esEntrenador && new Date(sub.expirationDate) > new Date() && (
                            <Button
                              variant='contained'
                              color='success'
                              title='Aceptar'
                              onClick={() => aceptarSubsRequest(sub)}
                            >
                              <Icon icon='line-md:confirm' />
                            </Button>
                          )}
                        </Box>
                        <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                          {esEntrenador && new Date(sub.expirationDate) > new Date() && (<Button
                            variant='contained'
                            color='error'
                            title='Rechazar'
                            onClick={() => rechazarSubsRequest(sub)}
                          >
                            <Icon icon='line-md:cancel' />
                          </Button>)}
                          {esEntrenador && new Date(sub.expirationDate) <= new Date() && (<Button
                            variant='contained'
                            color='error'
                            title='Borrar'
                            onClick={() => borrarSubsRequest(sub)}
                          >
                            <Icon icon='mdi:trash' />
                          </Button>)}
                          {esEntrenador || new Date(sub.expirationDate) > new Date() && (
                            <Button
                              variant='contained'
                              color='error'
                              title='Cancelar'
                              onClick={() => cancelarSubsRequest(sub)}
                            >
                              Cancelar mi solicitud
                            </Button>)}
                        </Box>
                        <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                          {esEntrenador && (<Button
                            variant='contained'
                            color='primary'
                            title='Perfil'
                            href={'/myProfile/myStudentProfile/' + sub.studentId}
                          >
                            <Icon icon='mdi:eye' />
                          </Button>)}
                        </Box>
                      </CardContent>
                    </Box>
                  </StyledGrid1>
                </Grid>
              </Card>
            ))
          ) : (
            <Box sx={{ mt: '50px', mb: '20px' }}>
              <Typography variant='h6' sx={{ textAlign: 'center' }}>No tenés solicitudes de suscripciones por el momento.</Typography>
            </Box>
          )}
          <Box className='demo-space-y' mt={7} alignItems={'center'} justifyContent='center' display={'flex'}>
            <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
          </Box>
        </Grid>
        <RequestPopUp
          requestPopUp={requestPopUp}
          setRequestPopUp={setRequestPopUp}
          type={typeAction}
          title={title}
          requestId={subsRequestId}
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
