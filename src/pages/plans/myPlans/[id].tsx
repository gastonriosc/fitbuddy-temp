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
import ReportPopUp from '../reporte/report';

//import Chip from '@mui/material/Chip';
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip'

// import RequestPopUp from '../myRequests/requestPopUp';
import { CardHeader, Divider, FormControl, Input, InputLabel, Select, MenuItem } from '@mui/material';


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

interface planType {
  _id: string;
  nombrePlan: string;
  trainerId: string;
  studentId: string;
  subsRequestId: string;
  date: string;
  expirationDate: string;
  studentName: string;
  trainerName: string;
  subscriptionName: string;
  avatar: string;
}



const MyRequests = () => {

  const route = useRouter();
  const [plan, setPlan] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filterName, setFilterName] = useState<string>('');
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOption, setFilterOption] = useState('desc');
  const [filterState, setFilterState] = useState('vigentes');
  const [nameSubs, setNameSubs] = useState([])
  const [planId, setPlanId] = useState<string>(null)
  const [reportPopUp, setReportPopUp] = useState<boolean>(false)
  const itemsPerPage = 4; // Cantidad de elementos por página



  console.log(plan)
  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id;

      try {
        // ** Llamada a la API para obtener datos paginados
        const res = await fetch(
          `/api/studentsPlans/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setPlan(data.plan);
          console.log(data.plan)
          setNameSubs(data.nameSubs);
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

    fetchMyRequests();

    return () => {
      setCurrentPage(1);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReport = (planId: string) => {
    setPlanId(planId)
    setReportPopUp(true)
  }

  const totalPages = Math.ceil(plan.length / itemsPerPage);

  if (isLoading) {
    return (
      <>
        <Grid>
          <Card >
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
                      {Array.from(new Set(plan.map((OPlan: planType) => OPlan.subscriptionName))).map((uniqueSubscriptionName, index) => (
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
          <Divider sx={{ mt: 2 }} />

          {/* <Card sx={{ mt: 2, bgcolor: '#142751', display: 'flex' }}> */}
          <Grid item container spacing={2}>
            {plan.length > 0 ? (
              plan
                .filter((OPlan: planType) =>
                  OPlan.trainerName.toLowerCase().includes(filterName.toLowerCase()) &&
                  OPlan.subscriptionName.toLowerCase().includes(filterPlan.toLowerCase())
                )
                .filter((OPlan: planType) => {
                  if (filterState === 'vigentes') {
                    return new Date(OPlan.expirationDate) > new Date();
                  } else {
                    return new Date(OPlan.expirationDate) <= new Date();
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
                })
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((OPlan: planType, index) => (


                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index} my={2}  >
                    <Card sx={{ opacity: new Date(OPlan.expirationDate) <= new Date() ? 0.7 : 1 }}>
                      <StyledGrid2 >
                        <Box display={'flex'} justifyContent={'center'}>
                          <CardContent sx={{ flexWrap: 'wrap', pb: '0 !important', justifyContent: 'center', }}>
                            <Img alt='Avatar' src={OPlan.avatar} sx={{ width: '130px', height: '130px', justifySelf: 'center' }} />
                          </CardContent>
                        </Box>
                      </StyledGrid2>
                      <StyledGrid1  >
                        <Box >
                          <CardContent sx={{ p: (theme) => `${theme.spacing(6)} !important`, flexGrow: 1 }}>
                            <Box textAlign={'center'}>
                              <Typography variant='h5' sx={{ mb: 2 }}>
                                {OPlan.trainerName}
                              </Typography>
                            </Box>
                            <Box display={'flex'} justifyContent={'center'} mb={2}>
                              <Box>
                                <Typography variant='h5' >
                                  <CustomChip sx={{ mx: 2 }} skin='light' color='warning' label={OPlan.nombrePlan} />
                                </Typography>
                              </Box>
                              <Box >
                                <Typography variant='h5' >
                                  <CustomChip sx={{ mx: 2 }} skin='light' color='warning' label={OPlan.subscriptionName.toUpperCase()} />
                                </Typography>
                              </Box>

                            </Box>
                            <Box display={'flex'} justifyContent={'center'}>
                              <Box>
                                <Typography variant='h5' sx={{ mb: 2 }}>
                                  <CustomChip sx={{ mx: 2 }} color='success' skin='light' label={new Date(OPlan.date).toLocaleDateString('es')} />
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant='h5' sx={{ mb: 2 }}>
                                  <CustomChip sx={{ mx: 2 }} color='error' skin='light' variant='outlined' label={new Date(OPlan.expirationDate).toLocaleDateString('es')} />
                                </Typography>
                              </Box>
                            </Box>
                            {/* <Typography variant='body1' sx={{ mb: 2 }}>
                            {plan.description}
                          </Typography> */}
                          </CardContent>
                          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                              <Button
                                variant='contained'
                                color='primary'
                                title='Plan'

                                // href={'/plans/' + OPlan._id + '&subsReq=' + OPlan.subsRequestId}
                                href={'/plans/' + OPlan._id}
                              >
                                <Icon icon='mdi:file-eye-outline' />
                              </Button>
                            </Box>
                            <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                              <Button
                                variant='contained'
                                color='primary'
                                title='Perfil'
                                href={'/myProfile/' + OPlan.trainerId}
                              >
                                <Icon icon='mdi:eye' />
                              </Button>
                            </Box>

                            {new Date(OPlan.expirationDate) <= new Date() ? (
                              <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                                <Button
                                  variant='contained'
                                  color='primary'
                                  title='Reporte final'

                                  onClick={() => handleReport(OPlan._id)
                                  }
                                >
                                  <Icon icon='bxs:report' />
                                </Button>
                              </Box>
                            ) : null}
                          </CardContent>
                        </Box>

                      </StyledGrid1>
                    </Card >
                  </Grid>
                ))

            ) : (
              <Card sx={{ mt: 4, justifyContent: 'center', alignContent: 'center', minWidth: '100%' }}>
                <CardHeader title="No tenés planes por el momento." sx={{ textAlign: 'center' }} />
              </Card>
            )}
          </Grid >
          {/* </Card> */}
          {plan.length > 0 && (
            <Box className='demo-space-y' mt={7} alignItems={'center'} justifyContent='center' display={'flex'}>
              <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
            </Box>
          )}
          <ReportPopUp reportPopUp={reportPopUp} handleReportPopUp={setReportPopUp} planId={planId}></ReportPopUp>
        </Grid >

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
  subject: 'myPlans-page',
};

export default MyRequests;
