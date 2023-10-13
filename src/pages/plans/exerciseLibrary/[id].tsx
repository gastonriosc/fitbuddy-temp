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


// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}));


interface Exercise {
  _id: string;
  exerciseName: string;
  muscleGroup: string;
  avatar: string;
  linkExercise: string;
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
    isValid: false,
  });

  //Hacemos un GET al endpoint de la libreria general de ejercicios, despues de haber hecho el POST en BD que ya lo saque de aca.
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
        console.log(data);
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
  }, []);


  //Funcion para eliminar un ejercicio.
  const handleDeleteExercise = (index: number) => {
    // Crear una copia del estado plan
    const updatedPlan = [...plan];

    // Eliminar el ejercicio correspondiente del estado plan
    updatedPlan.splice(index, 1);

    // Actualizar el estado plan
    setPlan(updatedPlan);
  };


  //Funcion para agregar un ejercicio.
  const handleAddExercise = () => {
    if (!newExercise.isValid) {
      console.error('Por favor complete todos los campos.');

      return;
    }

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

    // Agregar el nuevo ejercicio al plan
    setPlan([...plan, updatedExercise]);

    // Limpiar los valores del nuevo ejercicio después de agregarlo
    setNewExercise({
      _id: '',
      exerciseName: '',
      muscleGroup: '',
      avatar: '',
      linkExercise: '',
      isValid: false,
    });
    setAddExerciseModalOpen(false);
  };

  //Hook para deshabilitar/habilitar el boton segun si los campos estan completos o no.
  useEffect(() => {
    const isValid =
      newExercise.exerciseName.trim() !== '' &&
      newExercise.muscleGroup.trim() !== '' &&
      newExercise.linkExercise.trim() !== '';

    setNewExercise((prev: any) => ({ ...prev, isValid }));
  }, [newExercise.exerciseName, newExercise.muscleGroup, newExercise.linkExercise]);


  //Hook para validar el avatar del ejercicio y agregarlo al plan.
  useEffect(() => {
    if (newExercise.avatar !== '') {
      setPlan(prevPlan => [...prevPlan, newExercise]);
    }
  }, [newExercise]);


  //Funcion para que cuando agrega un ejercicio, se agregue con el formato de la card.
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
                variant='text'
                color='primary'
                title='Perfil'
                onClick={() => window.open(exercise.linkExercise, '_blank')}
              >
                <Icon icon='mdi:eye' />
              </Button>
            </Box>
            <Box sx={{ position: 'absolute', top: 0, left: 0, mt: 1, ml: 1, px: '1px' }}>
              <Button
                variant='text'
                title='Eliminar'
                onClick={() => handleDeleteExercise(plan.findIndex(item => item._id === exercise._id))}
                sx={{ color: 'error.main' }}
              >
                <Icon icon='mdi:close' />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid >
  );


  //Filtros de los ejercicios por grupo muscular y por nombre.
  const filteredPlan = plan.filter((exercise) => {
    const matchesGroupMuscular =
      filterOption === 'all' || exercise.muscleGroup.toLowerCase() === filterOption.toLowerCase();
    const matchesName = filterName === '' || exercise.exerciseName.toLowerCase().includes(filterName.toLowerCase());

    return matchesGroupMuscular && matchesName;
  });

  //Paginador
  const totalPages = Math.ceil(plan.length / itemsPerPage);
  const indexOfLastExercise = currentPage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = filteredPlan.slice(indexOfFirstExercise, indexOfLastExercise);

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
        {currentExercises.map((exercise) => renderExerciseCard(exercise))}
      </Grid>

      <Box className="demo-space-y" mt={7} alignItems={'center'} justifyContent="center" display="flex">
        <Pagination count={totalPages} color="primary" page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
      </Box>

      <Button variant="contained" color="primary" onClick={() => setAddExerciseModalOpen(true)}>
        Agregar Ejercicio
      </Button>

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
                <Button color='primary' variant='contained' type='submit' onClick={handleAddExercise} disabled={!newExercise.isValid}>
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

