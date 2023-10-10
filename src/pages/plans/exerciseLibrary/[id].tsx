import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

//import { useSession } from 'next-auth/react';

// ** MUI Imports
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid, { GridProps } from '@mui/material/Grid';

//import Chip from '@mui/material/Chip';
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip'

// import RequestPopUp from '../myRequests/requestPopUp';
import { CardHeader, Divider, FormControl, Input, InputLabel, Select, MenuItem, TextField, Dialog, DialogContent, DialogTitle } from '@mui/material';


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
  exerciseName: string;
  muscleGroup: string;
  linkExercise: string;
}


const fixedCards = [
  {
    exerciseName: 'Press de Banca plano',
    muscleGroup: 'Pecho',
    avatar: '/images/avatars/pecho.png',
    linkExercise: 'https://www.youtube.com/shorts/i14IBMNQDQQ',
  },
  {
    exerciseName: 'Press de Banca inclinado',
    muscleGroup: 'Pecho',
    avatar: '/images/avatars/pecho.png',
    linkExercise: 'https://www.youtube.com/shorts/SqT0lZDPm-Y'

  },
  {
    exerciseName: 'Press de Banca declinado',
    muscleGroup: 'Pecho',
    avatar: '/images/avatars/pecho.png',
    linkExercise: 'https://www.youtube.com/shorts/i14IBMNQDQQ',
  },
  {
    exerciseName: 'Cruce de poleas',
    muscleGroup: 'Pecho',
    avatar: '/images/avatars/pecho.png',
    linkExercise: 'https://www.youtube.com/shorts/B_5amA7vPbA',
  },
  {
    exerciseName: 'Curl de biceps',
    muscleGroup: 'Brazos',
    avatar: '/images/avatars/biceps.png',
    linkExercise: 'https://www.youtube.com/shorts/YQgahl1e3oA',
  },
  {
    exerciseName: 'Triceps en polea',
    muscleGroup: 'Brazos',
    avatar: '/images/avatars/biceps.png',
    linkExercise: 'https://www.youtube.com/shorts/smLEQsRMnc8',
  },
  {
    exerciseName: 'Biceps alternados ',
    muscleGroup: 'Brazos',
    avatar: '/images/avatars/biceps.png',
    linkExercise: 'https://www.youtube.com/shorts/3AdTKHAbRns',
  },
  {
    exerciseName: 'Curl W 21',
    muscleGroup: 'Brazos',
    avatar: '/images/avatars/biceps.png',
    linkExercise: 'https://www.youtube.com/shorts/Npgq90WZ4ys',
  },
  {
    exerciseName: 'Sentadillas con barra',
    muscleGroup: 'Piernas',
    avatar: '/images/avatars/legs.png',
    linkExercise: 'https://www.youtube.com/shorts/NHD0vH7XXgw',
  },
  {
    exerciseName: 'Peso muerto con barra',
    muscleGroup: 'Piernas',
    avatar: '/images/avatars/legs.png',
    linkExercise: 'https://www.youtube.com/shorts/3EhkrUEEPOg',
  },
  {
    exerciseName: 'Hack squat',
    muscleGroup: 'Piernas',
    avatar: '/images/avatars/legs.png',
    linkExercise: 'https://www.youtube.com/shorts/itmlCUc0P3k',
  },
  {
    exerciseName: 'Camilla Isquiotibiales',
    muscleGroup: 'Piernas',
    avatar: '/images/avatars/legs.png',
    linkExercise: 'https://www.youtube.com/shorts/hYwksAJzRt8',
  },
  {
    exerciseName: 'Press Militar',
    muscleGroup: 'Hombros',
    avatar: '/images/avatars/hombros.png',
    linkExercise: 'https://www.youtube.com/shorts/PWtkHROaH3Y'
  },
  {
    exerciseName: 'Vuelos laterales',
    muscleGroup: 'Hombros',
    avatar: '/images/avatars/hombros.png',
    linkExercise: 'https://www.youtube.com/shorts/DCS8eFTiddM'
  },
  {
    exerciseName: 'Vuelos frontales',
    muscleGroup: 'Hombros',
    avatar: '/images/avatars/hombros.png',
    linkExercise: 'https://www.youtube.com/shorts/jk7YrK79ciA'
  },
  {
    exerciseName: 'Press frontal con barra',
    muscleGroup: 'Hombros',
    avatar: '/images/avatars/hombros.png',
    linkExercise: 'https://www.youtube.com/shorts/if97enQvM70'
  },
  {
    exerciseName: 'Remo al cuello',
    muscleGroup: 'Espalda',
    avatar: '/images/avatars/espalda.png',
    linkExercise: 'https://www.youtube.com/shorts/uEAclUy8sBE'
  },
  {
    exerciseName: 'Remo con polea',
    muscleGroup: 'Espalda',
    avatar: '/images/avatars/espalda.png',
    linkExercise: 'https://www.youtube.com/shorts/HJw0-W-cQog'
  },
  {
    exerciseName: 'Dominadas pronas',
    muscleGroup: 'Espalda',
    avatar: '/images/avatars/espalda.png',
    linkExercise: 'https://www.youtube.com/shorts/LerajxEGimU'

  },
  {
    exerciseName: 'Remo con barra recta',
    muscleGroup: 'Espalda',
    avatar: '/images/avatars/espalda.png',
    linkExercise: 'https://www.youtube.com/shorts/VNJxbFn_a6I'
  },

];

const MyRequests = () => {
  const route = useRouter();
  const [plan, setPlan] = useState<[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOption, setFilterOption] = useState('asc');
  const itemsPerPage = 4;
  const [showEmptyCard, setShowEmptyCard] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    exerciseName: '',
    muscleGroup: '',
    avatar: '',
    linkExercise: '',
  });

  const handleAgregarEjercicio = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGuardarEjercicio = () => {
    let defaultAvatar = 'URL de la imagen';
    switch (newExercise.muscleGroup.toLowerCase()) {
      case 'piernas':
        defaultAvatar = '/images/avatars/legs.png';
        break;
      case 'brazos':
        defaultAvatar = '/images/avatars/biceps.png';
        break;
      case 'hombros':
        defaultAvatar = '/images/avatars/hombros.png';
        break;
      case 'pecho':
        defaultAvatar = '/images/avatars/pecho.png';
        break;
      case 'espalda':
        defaultAvatar = '/images/avatars/espalda.png';
        break;
      default:
        break;
    }

    setNewExercise({
      exerciseName: newExercise.exerciseName || 'Nuevo Ejercicio',
      muscleGroup: newExercise.muscleGroup || 'Pecho',
      avatar: defaultAvatar,
      linkExercise: newExercise.linkExercise || 'URL del ejercicio',
    });

    setShowEmptyCard(true);
    setOpenDialog(false);
  };



  const handleInputChange = (field, value) => {
    setNewExercise((prevExercise) => ({
      ...prevExercise,
      [field]: value,
    }));
  };

  const renderExerciseCard = (exercise) => (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={exercise.id} my={2}>
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

  const totalPages = Math.ceil(plan.length / itemsPerPage);

  return (
    <>
      <Grid>
        <Card>
          <CardHeader
            title='Filtros'
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='search-input'>Grupo Muscular</InputLabel>
                  <Select
                    label='Grupo Muscular'
                    fullWidth
                    value={filterOption}
                    id='search-input'
                    placeholder='Grupo muscular'
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <MenuItem value='0' disabled >Seleccione un grupo muscular</MenuItem>
                    <MenuItem value='pecho'>Pecho</MenuItem>
                    <MenuItem value='piernas'>Piernas</MenuItem>
                    <MenuItem value='brazos'>Brazos</MenuItem>
                    <MenuItem value='espalda'>Espalda</MenuItem>
                    <MenuItem value='hombros'>Hombros</MenuItem>
                    <MenuItem value='abdominales'>Abdominales</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
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

        <Grid item container spacing={2}>
          {/* Tarjetas fijas */}
          {fixedCards
            .filter(fixedCard =>
              filterOption === '0' || fixedCard.muscleGroup.toLowerCase() === filterOption.toLowerCase() &&
              (filterName === '' || fixedCard.exerciseName.toLowerCase().includes(filterName.toLowerCase()))
            )
            .map((fixedCard, index) => renderExerciseCard(fixedCard))
          }

          {/* Tarjeta vacía */}
          {showEmptyCard && renderExerciseCard(newExercise)}

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Ingrese los detalles del ejercicio</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre del Ejercicio"
                    fullWidth
                    value={newExercise.exerciseName}
                    onChange={(e) => handleInputChange('exerciseName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="muscle-group-label">Grupo Muscular</InputLabel>
                    <Select
                      labelId="muscle-group-label"
                      id="muscle-group"
                      value={newExercise.muscleGroup}
                      onChange={(e) => handleInputChange('muscleGroup', e.target.value)}
                    >
                      <MenuItem value='0' disabled >Seleccione un grupo muscular</MenuItem>
                      <MenuItem value='pecho'>Pecho</MenuItem>
                      <MenuItem value='piernas'>Piernas</MenuItem>
                      <MenuItem value='brazos'>Brazos</MenuItem>
                      <MenuItem value='espalda'>Espalda</MenuItem>
                      <MenuItem value='hombros'>Hombros</MenuItem>
                      <MenuItem value='abdominales'>Abdominales</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="URL video"
                    fullWidth
                    value={newExercise.linkExercise}
                    onChange={(e) => handleInputChange('linkExercise', e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button onClick={handleGuardarEjercicio} color="primary">
                Guardar
              </Button>
            </Box>
          </Dialog>
        </Grid>
        <Box className='demo-space-y' mt={7} alignItems={'center'} justifyContent='center' display={'flex'} >
          <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
        </Box>
        <Button onClick={handleAgregarEjercicio}>
          Agregar Ejercicio
        </Button>
      </Grid>
    </>
  );
}

MyRequests.acl = {
  action: 'manage',
  subject: 'myLibrary-page',
};

export default MyRequests;

