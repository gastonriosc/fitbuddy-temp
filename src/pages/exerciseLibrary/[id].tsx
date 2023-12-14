import { useEffect, useState } from 'react';

//import { useSession } from 'next-auth/react';

// ** MUI Imports
import Pagination from '@mui/material/Pagination'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
import { SelectChangeEvent } from '@mui/material'

//import Chip from '@mui/material/Chip';
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip'

// import RequestPopUp from '../myRequests/requestPopUp';
import { CardHeader, Divider, FormControl, Input, InputLabel, Select, MenuItem, DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useRouter } from 'next/router';


// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}));


interface Exercise {
  _id: string;
  exerciseName: string;
  muscleGroup: string;
  avatar: string;
  exerciseLink: string;
}

interface FormData {
  _id: number | string
  exerciseName: string
  muscleGroup: string
  exerciseLink: string
  avatar: string;
}



const MyLibrary = () => {
  const [plan, setPlan] = useState<Exercise[]>([]);
  const [filterOption, setFilterOption] = useState<string>('all');
  const [filterName, setFilterName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const route = useRouter();
  const [titlePopUp, setTitlePopUp] = useState<string>()
  const [popUp, setPopUp] = useState<boolean>(false)
  const [titlePopUpDelete, setTitlePopUpDelete] = useState<string>()
  const [popUpDelete, setPopUpDelete] = useState<boolean>(false)
  const [exerciseToDelete, setExerciseToDelete] = useState<any>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('')

  const textPopUp = 'Pulse el botón OK para continuar'
  const textPopUpDelete = 'Presione el boton Eliminar para confirmar la eliminación del ejercicio.'

  const closePopUp = () => setPopUp(false)
  const closePopUpDelete = () => setPopUpDelete(false)

  const schema = yup.object().shape({
    exerciseName: yup.string().required("Nombre del ejercicio es un campo obligatorio"),
    muscleGroup: yup.string().required("Seleccione un grupo muscular"),
    exerciseLink: yup.string().required("El link del ejercicio es un campo obligatorio")
  })


  const addExerciseToPlan = (exercise: Exercise) => {
    const updatedPlan = [...plan, exercise];
    setPlan(updatedPlan);
  }

  // ** Events
  const handleMuscleGroupChange = (event: SelectChangeEvent<string>) => {
    setSelectedMuscleGroup(event.target.value)
  }

  // ** React-Hook-Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      exerciseName: '',
      muscleGroup: '',
      exerciseLink: '',
    },
    mode: 'onBlur', //onBlur hace que los errores se muestren cuando el campo pierde focus.
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchExercises = async () => {
      const trainerId = route.query.id;
      try {
        const res = await fetch(`/api/library/?id=${trainerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status == 200) {
          const data = await res.json();
          console.log(data.exercisesData);
          setPlan(data.exercisesData);
          setIsLoading(true);

          // return data.exercisesData || [];
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

    fetchExercises();
  }, []);

  //Funcion para agregar un ejercicio.
  const handleExercise: SubmitHandler<FormData> = async (data) => {

    let defaultAvatar = 'URL de la imagen';

    if (data.muscleGroup.toLowerCase() === 'pecho') {
      defaultAvatar = '/images/avatars/pecho.png';
    } else if (data.muscleGroup.toLowerCase() === 'piernas') {
      defaultAvatar = '/images/avatars/legs.png';
    } else if (data.muscleGroup.toLowerCase() === 'espalda') {
      defaultAvatar = '/images/avatars/espalda.png';
    } else if (data.muscleGroup.toLowerCase() === 'hombros') {
      defaultAvatar = '/images/avatars/hombros.png';
    } else if (data.muscleGroup.toLowerCase() === 'brazos') {
      defaultAvatar = '/images/avatars/biceps.png';
    } else if (data.muscleGroup.toLowerCase() === 'abdominales') {
      defaultAvatar = '/images/avatars/abs.png';
    }

    const exerciseExists = plan.some((exercise) => exercise.exerciseName === data.exerciseName && exercise.exerciseLink === data.exerciseLink);

    if (exerciseExists) {
      setError('Ya existe un ejercicio con esta misma información. Por favor, modifique el mismo.');

      return;
    }

    setError('');

    const updatedExercise = {
      ...data,
      avatar: defaultAvatar,
    };

    setAddExerciseModalOpen(false);

    addExerciseToMyPersonalLibrary(updatedExercise)
  };

  const addExerciseToMyPersonalLibrary: SubmitHandler<FieldValues> = async (data) => {
    const exercise = data;
    const trainerId = route.query.id;
    reset({
      exerciseName: '',
      muscleGroup: '',
      exerciseLink: '',
    });
    try {
      // Actualizar el estado local antes de realizar la petición PUT

      // Realizar la petición POST al servidor
      const res = await fetch(`/api/library/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercise, trainerId: trainerId }),
      });

      if (res.status == 200) {
        const data = await res.json()
        console.log(data)
        addExerciseToPlan(data)
        setTitlePopUp('Ejercicio agregado con éxito!');
        setPopUp(true);

      }
      if (res.status == 404) {
        route.replace('/404')
      }
      if (res.status == 500) {
        route.replace('/500')
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Como los que recien se agregan no pueden eliminarse por id, se hace por nombre y link, ya que un ejercicio no puede tener el mismo nombre y link, pero si puede tener el mismo nombre y distinto link o viceversa.
  const handleDeleteExercise = (exerciseId: any) => {
    setExerciseToDelete({ exerciseId });
    setTitlePopUpDelete('¿Está seguro que desea eliminar este ejercicio?');
    setPopUpDelete(true);
  };

  const handleConfirmDelete = async () => {
    const { exerciseId } = exerciseToDelete;

    const updatedPlan = plan.filter(
      (exercise) => exercise._id !== exerciseId
    );
    setPlan(updatedPlan);
    const trainerId = route.query.id;

    try {
      const res = await fetch(`/api/library/?id=${trainerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId, exerciseId }),
      });

      if (res.status == 200) {
        setTitlePopUp('Ejercicio eliminado con éxito!');
        setPopUp(true);

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

    setPopUpDelete(false);
  };


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
                title='Link'
                onClick={() => window.open(exercise.exerciseLink, '_blank')}
              >
                <Icon icon='mdi:eye' />
              </Button>
            </Box>
            <Box sx={{ position: 'absolute', top: 0, left: 0, mt: 1, ml: 1, px: '1px' }}>
              <Button
                variant='text'
                title='Eliminar'
                onClick={() => handleDeleteExercise(exercise._id)}

                sx={{ color: 'error.main' }}
              >
                <Icon icon='mdi:delete' />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid >
  );


  const filteredPlan = plan.filter((exercise) => {
    const matchesGroupMuscular =
      filterOption === 'all' || exercise.muscleGroup.toLowerCase() === filterOption.toLowerCase();
    const matchesName = filterName === '' || exercise.exerciseName.toLowerCase().includes(filterName.toLowerCase());

    return matchesGroupMuscular && matchesName;
  });

  // Paginador
  const totalPages = Math.ceil(filteredPlan.length / itemsPerPage);
  const indexOfLastExercise = currentPage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = filteredPlan.slice(indexOfFirstExercise, indexOfLastExercise);


  if (isLoading) {
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

        <Box display="flex" justifyContent="flex-end">
          <Button sx={{ mt: 6 }} variant="outlined" color="primary" onClick={() => setAddExerciseModalOpen(true)}>
            Agregar Ejercicio
          </Button>
          {/* <Button variant="text" color="success" onClick={() => addExerciseToMyPersonalLibrary(addedExercises)} >
          Guardar cambios
        </Button> */}
        </Box>

        <Box className="demo-space-y" mt={7} alignItems={'center'} justifyContent="center" display="flex">
          <Pagination count={totalPages} color="primary" page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
        </Box>

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
                <form noValidate autoComplete='off' onSubmit={handleSubmit(addExerciseToMyPersonalLibrary)}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='exerciseName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label='Nombre del ejercicio'
                          name='exerciseName'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.exerciseName)}
                        />
                      )}
                    />
                    {errors.exerciseName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.exerciseName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel>Grupo Muscular</InputLabel>
                    <Controller
                      name='muscleGroup'
                      control={control}
                      rules={{
                        required: 'Selecciona un grupo muscular',
                        validate: (value) => value !== ''
                      }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Select
                          value={value}
                          onBlur={onBlur}
                          label='Grupo Muscular'
                          onChange={(e) => {
                            onChange(e);
                            handleMuscleGroupChange(e);
                          }}
                          error={Boolean(errors.muscleGroup)}
                        >
                          <MenuItem value="pecho">Pecho</MenuItem>
                          <MenuItem value="piernas">Piernas</MenuItem>
                          <MenuItem value="espalda">Espalda</MenuItem>
                          <MenuItem value="brazos">Brazos</MenuItem>
                          <MenuItem value="abdominales">Abdominales</MenuItem>
                          <MenuItem value="hombros">Hombros</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.muscleGroup && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.muscleGroup.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='exerciseLink'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          label='Link del ejercicio'
                          name='exerciseLink'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.exerciseLink)}
                        />
                      )}
                    />
                    {errors.exerciseLink && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.exerciseLink.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <Box sx={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
                    <Button color='primary' variant='contained' type='submit' onClick={handleSubmit(handleExercise)} >
                      Agregar
                    </Button>

                  </Box>
                </form>
              </CardContent>
              {error && (
                <Box sx={{ color: 'skyblue', textAlign: 'center', mb: 2 }}>
                  {error}
                </Box>
              )}
            </Card>

          </DialogContent>
        </Dialog >
        <Dialog fullWidth open={popUp} onClose={closePopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(6)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                '& svg': { mb: 6, color: 'success.main' }
              }}
            >
              <Icon icon='line-md:confirm' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUp}</Typography>
              <Typography>{textPopUp}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUp}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog fullWidth open={popUpDelete} onClose={closePopUpDelete} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(6)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                '& svg': { mb: 6, color: 'error.main' }
              }}
            >
              <Icon icon='line-md:alert' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpDelete}</Typography>
              {/* <Typography>{textPopUpDelete}</Typography> */}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='contained' color='error' onClick={handleConfirmDelete}>
              Eliminar
            </Button>
            <Button variant='contained' color='primary' onClick={closePopUpDelete}>
              Volver
            </Button>
          </DialogActions>
        </Dialog>
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

MyLibrary.acl = {
  action: 'manage',
  subject: 'myLibrary-page',
};

export default MyLibrary;

