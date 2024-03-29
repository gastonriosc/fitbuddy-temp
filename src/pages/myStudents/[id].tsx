import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon';
import { CardHeader, FormControl, Input, InputLabel, Select, MenuItem } from '@mui/material';
import RequestPopUp from '../myRequests/requestPopUp';

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
  expirationDate: string | any
}

const MyStudents = () => {

  const route = useRouter();
  const [subsRequest, setSubsRequest] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestPopUp, setRequestPopUp] = useState<boolean>(false);
  const [typeAction, setTypeAction] = useState<string>('');
  const [subsRequestId, setSubsRequestId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const [filterPlan, setFilterPlan] = useState<string>('');
  const [filterOption, setFilterOption] = useState('desc');
  const [nameSubs, setNameSubs] = useState([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // Cantidad de elementos por página

  const rechazarSubsRequest = (sub: subsRequest) => {
    setRequestPopUp(true);
    setTypeAction('rechazar');
    setSubsRequestId(sub._id);
    setTitle('rechazada');
  };

  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id;

      try {
        // ** Llamada a la API para obtener datos paginados
        const res = await fetch(
          `/api/myStudents/?id=${id}`,
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
          setNameSubs(data.nameSubs);
          setIsLoading(true);
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyRequests();
  }, []); // Actualizar cuando cambie la página actual

  const filteredStudents = subsRequest.filter((sub: subsRequest) =>
    sub.studentName.toLowerCase().includes(filterName.toLowerCase()) &&
    sub.subscriptionName.toLowerCase().includes(filterPlan.toLowerCase())
  )
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (filterOption === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    })


  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));

  const paginatedSubs = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


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
                    <Select
                      label='Plan'
                      fullWidth
                      value={filterPlan}
                      id='search-input-plan'
                      onChange={(e) => setFilterPlan(e.target.value)}
                    >
                      <MenuItem value=''>SIN FILTRO</MenuItem>
                      {Array.from(new Set(subsRequest.map((subs: subsRequest) => subs.subscriptionName)))
                        .map((uniqueSubscriptionName, index) => (
                          <MenuItem key={index} value={uniqueSubscriptionName}>
                            {uniqueSubscriptionName ? uniqueSubscriptionName.toUpperCase() : ''}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                </Grid>
                <Grid item sm={4} xs={12}>
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
            {/* <Divider /> */}
          </Card>

          {subsRequest.length > 0 ? (

            paginatedSubs.map((sub: subsRequest, index) => (
              <Card key={index} sx={{ my: 3 }}>
                <Grid container spacing={6}>
                  <StyledGrid2 item xs={12} md={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Img alt='Avatar' src={sub.avatar} sx={{ width: '130px', height: '130px' }} />
                    </CardContent>
                  </StyledGrid2>
                  <StyledGrid1 item xs={12} md={10}>
                    <Box sx={{ display: { md: 'flex' } }} >
                      <CardContent sx={{ p: (theme) => `${theme.spacing(6)} !important`, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex' }}>
                          <Box>
                            <Typography variant='h5' sx={{ mb: 2 }}>
                              {sub.studentName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant='h5' sx={{ mb: 2 }}>
                              <CustomChip sx={{ mx: 2 }} skin='light' color='warning' label={sub.subscriptionName.toUpperCase()} />
                            </Typography>
                          </Box>
                          <Box>

                            <Typography variant='h5' sx={{ mb: 2 }}>
                              <CustomChip sx={{ mx: 2 }} skin='light' color='warning' label={new Date(sub.date).toLocaleDateString('es-ES')} />
                            </Typography>
                          </Box>
                          <Typography variant='h5' sx={{ mb: 2 }}>
                            <CustomChip sx={{ mx: 2 }} skin='light' color='error' label={new Date(sub.expirationDate).toLocaleDateString('es-ES')} />
                          </Typography>
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
                          <b>Objetivo:</b> {sub.description}
                        </Typography>
                        <Typography sx={{ mb: 2, fontSize: '13px' }}>
                          <CustomChip sx={{ mr: 2, mb: 2 }} skin='light' rounded color='primary'
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
                          <Button
                            variant='contained'
                            color='secondary'
                            title='Crear plan'
                            href={'/plans/newPlan/?id=' + sub.studentId + '&subsReq=' + sub._id}
                          >
                            <Icon icon='line-md:plus' />
                          </Button>
                        </Box>
                        <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                          <Button
                            variant='contained'
                            color='error'
                            title='Rechazar'
                            onClick={() => rechazarSubsRequest(sub)}
                          >
                            <Icon icon='line-md:cancel' />
                          </Button>
                        </Box>
                        <Box sx={{ marginTop: 1, marginLeft: 1 }}>
                          <Button
                            variant='contained'
                            color='primary'
                            title='Perfil'
                            href={'/myProfile/myStudentProfile/' + sub.studentId}
                          >
                            <Icon icon='mdi:eye' />
                          </Button>
                        </Box>
                      </CardContent>
                    </Box>

                  </StyledGrid1>
                </Grid>
              </Card >
            ))
          ) : (
            <Box sx={{ mt: '50px', mb: '20px' }}>
              <Typography variant='h6' sx={{ textAlign: 'center' }}>No tenés alumnos con la solicitud de creación de plan aceptada.</Typography>
            </Box>

            // <Card sx={{ mt: 2, height: 70, justifyContent: 'center', alignContent: 'center' }}>
            //   <CardHeader title="No tenes alumnos con la solicitud de creacion de plan aceptada." />
            // </Card>
          )}
          <Box className='demo-space-y' mt={7} alignItems={'center'} justifyContent='center' display={'flex'}>
            <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)}
            />
          </Box>
          < RequestPopUp
            requestPopUp={requestPopUp}
            setRequestPopUp={setRequestPopUp}
            type={typeAction}
            title={title}
            requestId={subsRequestId}
            setSubsRequest={setSubsRequest}
          />
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

MyStudents.acl = {
  action: 'manage',
  subject: 'myRequests-page',
};

export default MyStudents;
