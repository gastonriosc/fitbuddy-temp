import { useEffect, useState } from 'react';

//import { useSession } from 'next-auth/react';

// ** MUI Imports
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

//import Chip from '@mui/material/Chip';
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip'

// import RequestPopUp from '../myRequests/requestPopUp';
import { CardHeader, Divider, FormControl, Input, InputLabel, Select, MenuItem, DialogContent, Dialog, DialogTitle } from '@mui/material';


// Styled Grid component
// const StyledGrid1 = styled(Grid)<GridProps>(({ }) => ({
// }));

// // Styled Grid component
// const StyledGrid2 = styled(Grid)<GridProps>(({ }) => ({
// }));

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
  exerciseName: string;
  muscleGroup: string;
  linkExercise: string;
}

interface Exercise {
  _id: string;
  nombrePlan: string;

  // Add other properties based on the actual structure of your Exercise objects
  exerciseName: string;
  muscleGroup: string;
  avatar: string;
  linkExercise: string;

  // ... other properties
}


// const fixedCards = [
//   {
//     exerciseName: 'Press de Banca plano',
//     muscleGroup: 'Pecho',
//     avatar: '/images/avatars/pecho.png',
//     linkExercise: 'https://www.youtube.com/shorts/i14IBMNQDQQ',
//   },
//   {
//     exerciseName: 'Press de Banca inclinado',
//     muscleGroup: 'Pecho',
//     avatar: '/images/avatars/pecho.png',
//     linkExercise: 'https://www.youtube.com/shorts/SqT0lZDPm-Y'

//   },
//   {
//     exerciseName: 'Press de Banca declinado',
//     muscleGroup: 'Pecho',
//     avatar: '/images/avatars/pecho.png',
//     linkExercise: 'https://www.youtube.com/shorts/i14IBMNQDQQ',
//   },
//   {
//     exerciseName: 'Cruce de poleas',
//     muscleGroup: 'Pecho',
//     avatar: '/images/avatars/pecho.png',
//     linkExercise: 'https://www.youtube.com/shorts/B_5amA7vPbA',
//   },
//   {
//     exerciseName: 'Curl de biceps',
//     muscleGroup: 'Brazos',
//     avatar: '/images/avatars/biceps.png',
//     linkExercise: 'https://www.youtube.com/shorts/YQgahl1e3oA',
//   },
//   {
//     exerciseName: 'Triceps en polea',
//     muscleGroup: 'Brazos',
//     avatar: '/images/avatars/biceps.png',
//     linkExercise: 'https://www.youtube.com/shorts/smLEQsRMnc8',
//   },
//   {
//     exerciseName: 'Biceps alternados ',
//     muscleGroup: 'Brazos',
//     avatar: '/images/avatars/biceps.png',
//     linkExercise: 'https://www.youtube.com/shorts/3AdTKHAbRns',
//   },
//   {
//     exerciseName: 'Curl W 21',
//     muscleGroup: 'Brazos',
//     avatar: '/images/avatars/biceps.png',
//     linkExercise: 'https://www.youtube.com/shorts/Npgq90WZ4ys',
//   },
//   {
//     exerciseName: 'Sentadillas con barra',
//     muscleGroup: 'Piernas',
//     avatar: '/images/avatars/legs.png',
//     linkExercise: 'https://www.youtube.com/shorts/NHD0vH7XXgw',
//   },
//   {
//     exerciseName: 'Peso muerto con barra',
//     muscleGroup: 'Piernas',
//     avatar: '/images/avatars/legs.png',
//     linkExercise: 'https://www.youtube.com/shorts/3EhkrUEEPOg',
//   },
//   {
//     exerciseName: 'Hack squat',
//     muscleGroup: 'Piernas',
//     avatar: '/images/avatars/legs.png',
//     linkExercise: 'https://www.youtube.com/shorts/itmlCUc0P3k',
//   },
//   {
//     exerciseName: 'Camilla Isquiotibiales',
//     muscleGroup: 'Piernas',
//     avatar: '/images/avatars/legs.png',
//     linkExercise: 'https://www.youtube.com/shorts/hYwksAJzRt8',
//   },
//   {
//     exerciseName: 'Press Militar',
//     muscleGroup: 'Hombros',
//     avatar: '/images/avatars/hombros.png',
//     linkExercise: 'https://www.youtube.com/shorts/PWtkHROaH3Y'
//   },
//   {
//     exerciseName: 'Vuelos laterales',
//     muscleGroup: 'Hombros',
//     avatar: '/images/avatars/hombros.png',
//     linkExercise: 'https://www.youtube.com/shorts/DCS8eFTiddM'
//   },
//   {
//     exerciseName: 'Vuelos frontales',
//     muscleGroup: 'Hombros',
//     avatar: '/images/avatars/hombros.png',
//     linkExercise: 'https://www.youtube.com/shorts/jk7YrK79ciA'
//   },
//   {
//     exerciseName: 'Press frontal con barra',
//     muscleGroup: 'Hombros',
//     avatar: '/images/avatars/hombros.png',
//     linkExercise: 'https://www.youtube.com/shorts/if97enQvM70'
//   },
//   {
//     exerciseName: 'Remo al cuello',
//     muscleGroup: 'Espalda',
//     avatar: '/images/avatars/espalda.png',
//     linkExercise: 'https://www.youtube.com/shorts/uEAclUy8sBE'
//   },
//   {
//     exerciseName: 'Remo con polea',
//     muscleGroup: 'Espalda',
//     avatar: '/images/avatars/espalda.png',
//     linkExercise: 'https://www.youtube.com/shorts/HJw0-W-cQog'
//   },
//   {
//     exerciseName: 'Dominadas pronas',
//     muscleGroup: 'Espalda',
//     avatar: '/images/avatars/espalda.png',
//     linkExercise: 'https://www.youtube.com/shorts/LerajxEGimU'

//   },
//   {
//     exerciseName: 'Remo con barra recta',
//     muscleGroup: 'Espalda',
//     avatar: '/images/avatars/espalda.png',
//     linkExercise: 'https://www.youtube.com/shorts/VNJxbFn_a6I'
//   },
//   {
//     exerciseName: 'Burpees',
//     muscleGroup: 'Abdominales',
//     avatar: '/images/avatars/abs.png',
//     linkExercise: 'https://www.youtube.com/shorts/k6CIe0jDHzQ'
//   },
//   {
//     exerciseName: 'Russian Twist',
//     muscleGroup: 'Abdominales',
//     avatar: '/images/avatars/abs.png',
//     linkExercise: 'https://www.youtube.com/shorts/BA-uP_-bVE8'
//   },
//   {
//     exerciseName: 'Cable crunch',
//     muscleGroup: 'Abdominales',
//     avatar: '/images/avatars/abs.png',
//     linkExercise: 'https://www.youtube.com/shorts/M1HeORCwv8A'
//   },
//   {
//     exerciseName: 'Rueda abdominal',
//     muscleGroup: 'Abdominales',
//     avatar: '/images/avatars/abs.png',
//     linkExercise: 'https://www.youtube.com/shorts/pTOsnzYMiXc'
//   }

// ];

const MyRequests = () => {
  const [plan, setPlan] = useState<Exercise[]>([]);
  const [filterOption, setFilterOption] = useState<string>('all');
  const [filterName, setFilterName] = useState<string>('');
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isAddExerciseModalOpen, setAddExerciseModalOpen] = useState(false);

  const [newExercise, setNewExercise] = useState<any>({
    _id: '',
    exerciseName: '',
    muscleGroup: '',
    avatar: '',
    linkExercise: '',
  });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/generalLibrary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setPlan(data.exercisesData?.exercises || []);
      } else {
        console.error('Error fetching data from the server');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Execute the request when the component mounts

  const totalPages = Math.ceil(plan.length / itemsPerPage);

  const handleAddExercise = () => {
    let defaultAvatar = 'URL de la imagen';

    if (newExercise.muscleGroup.toLowerCase() === 'pecho') {
      defaultAvatar = '/images/avatars/pecho.png';
    } else if (newExercise.muscleGroup.toLowerCase() === 'piernas') {
      defaultAvatar = '/images/avatars/legs.png';
    } else if (newExercise.muscleGroup.toLowerCase() === 'espalda') {
      defaultAvatar = '/images/avatars/espalda.png';
    } else if (newExercise.muscleGroup.toLowerCase() === 'hombros') {
      defaultAvatar = '/images/avatars/hombros.png';
    } else if (newExercise.muscleGroup.toLowerCase() === 'brazos') {
      defaultAvatar = '/images/avatars/biceps.png';
    } else if (newExercise.muscleGroup.toLowerCase() === 'abdominales') {
      defaultAvatar = '/images/avatars/abs.png';
    }

    const updatedExercise = {
      ...newExercise,
      avatar: defaultAvatar,
    };

    // Agrega el nuevo ejercicio al plan
    setPlan([...plan, updatedExercise]);

    // Limpia los valores del nuevo ejercicio después de agregarlo
    setNewExercise({
      _id: '',
      exerciseName: '',
      muscleGroup: '',
      avatar: '',
      linkExercise: '',
    });

    setAddExerciseModalOpen(false);
  };


  useEffect(() => {
    // Esto es para un bug de que se renderice la imagen al momento de agregar un ejercicio en la card.
    if (newExercise.avatar !== '') {
      setPlan(prevPlan => [...prevPlan, newExercise]);
    }
  }, [newExercise]);


  const renderExerciseCard = (exercise: Exercise) => (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={exercise._id} my={2}>
      <Card>
        <CardContent sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CardContent sx={{ flexWrap: 'wrap', pb: '0 !important', justifyContent: 'center' }}>
              <Img alt='Avatar' src={exercise.avatar} sx={{ width: '130px', height: '130px', justifySelf: 'center' }} />
            </CardContent>
            <Typography variant="h5">{exercise.exerciseName}</Typography>
            <Typography variant="h5">
              <CustomChip
                sx={{ mt: '10px' }}
                skin="light"
                color="warning"
                label={exercise.muscleGroup.toUpperCase()}
              />
            </Typography>
            <Box sx={{ position: 'absolute', top: 0, right: 0, mt: 1, mr: 1, px: '1px' }}>
              <Button
                variant='outlined'
                color='primary'
                title='Perfil'
                onClick={() => window.open(exercise.linkExercise, '_blank')}
              >
                <Icon icon='mdi:eye' />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const filteredPlan = plan.filter(exercise => {
    const matchesGroupMuscular = filterOption === 'all' || exercise.muscleGroup.toLowerCase() === filterOption.toLowerCase();
    const matchesName = filterName === '' || exercise.exerciseName.toLowerCase().includes(filterName.toLowerCase());

    return matchesGroupMuscular && matchesName;
  });

  return (
    <>
      <Grid>
        <Card>
          <CardHeader
            title="Filtros"
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="search-input">Grupo Muscular</InputLabel>
                  <Select
                    label="Grupo Muscular"
                    fullWidth
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <MenuItem value="">
                      Selecciona un grupo muscular
                    </MenuItem>
                    <MenuItem value="all">Todos los ejercicios</MenuItem>
                    <MenuItem value="pecho">Pecho</MenuItem>
                    <MenuItem value="piernas">Piernas</MenuItem>
                    <MenuItem value="brazos">Brazos</MenuItem>
                    <MenuItem value="espalda">Espalda</MenuItem>
                    <MenuItem value="hombros">Hombros</MenuItem>
                    <MenuItem value="abdominales">Abdominales</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="search-input">Nombre</InputLabel>
                  <Input
                    fullWidth
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Ingrese un nombre para buscar"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Divider sx={{ mt: 2 }} />
      </Grid>
      <Grid container spacing={3}>
        {filteredPlan.map((exercise) => renderExerciseCard(exercise))}
      </Grid>

      <Box className="demo-space-y" mt={7} alignItems={'center'} justifyContent="center" display="flex">
        <Pagination count={totalPages} color="primary" page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
      </Box>

      {/* Boton que abre un nuevo modal para agregar un ejercicio */}
      <Button variant="contained" color="primary" onClick={() => setAddExerciseModalOpen(true)}>
        Agregar Ejercicio
      </Button>

      {/* Modal para agregar un nuevo ejercicio*/}
      <Dialog open={isAddExerciseModalOpen} onClose={() => setAddExerciseModalOpen(false)}>
        <DialogTitle
          id='user-view-plans'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          AGREGUE SU PROPIO EJERCICIO
        </DialogTitle>
        <Divider sx={{ mt: 2 }} />

        <DialogContent sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: ['wrap', 'nowrap'],
          pt: theme => `${theme.spacing(2)} !important`,
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
        }}>
          <Card>
            <CardContent>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Nombre del Ejercicio</InputLabel>
                <Input
                  value={newExercise.exerciseName}
                  onChange={(e) => setNewExercise({ ...newExercise, exerciseName: e.target.value })}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Grupo Muscular</InputLabel>
                <Select
                  value={newExercise.muscleGroup}
                  onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value as string })}
                >
                  <MenuItem value="pecho">Pecho</MenuItem>
                  <MenuItem value="piernas">Piernas</MenuItem>
                  <MenuItem value="espalda">Espalda</MenuItem>
                  <MenuItem value="brazos">Brazos</MenuItem>
                  <MenuItem value="abdominales">Abdominales</MenuItem>
                  <MenuItem value="hombros">Hombros</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Link del Ejercicio</InputLabel>
                <Input
                  value={newExercise.linkExercise}
                  onChange={(e) => setNewExercise({ ...newExercise, linkExercise: e.target.value })}
                />
              </FormControl>

              <Box sx={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
                <Button color='primary' variant='contained' type='submit' onClick={handleAddExercise} >
                  Agregar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

MyRequests.acl = {
  action: 'manage',
  subject: 'myLibrary-page',
};

export default MyRequests;

