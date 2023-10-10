// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
// import NewSubsPopUp from './newSubsPopUp'
import CardWorkoutMensual from './cardWorkouts'
import CardTrackingMensual from './cardTracking'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

// import { CardHeader } from '@mui/material'

import Dialog from '@mui/material/Dialog'

// import FormHelperText from '@mui/material/FormHelperText'
// import DialogActions from '@mui/material/DialogActions'
// import CircularProgress from '@mui/material/CircularProgress'
// import Divider from '@mui/material/Divider'

// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// import CardContent from '@mui/material/CardContent'

import DialogTitle from '@mui/material/DialogTitle'

// import FormControl from '@mui/material/FormControl'
// import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
// import CustomChip from 'src/@core/components/mui/chip'
// import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Types
// import { ThemeColor } from 'src/@core/layouts/types'
// import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
// import { getInitials } from 'src/@core/utils/get-initials'

interface Tracking {
  _id: string,
  planId: string,
  data: {
    _id: string
    date: Date,
    number: number
  }
}

const Tracking = () => {

  const session = useSession();
  const isTrainer = session.data?.user.role == 'Entrenador';

  const labels: { [index: string]: string } = {
    1: 'Malo',
    2: 'Bueno',
    3: 'Muy Bueno',
    4: 'Excelente',
  }
  const [hover, setHover] = useState<number>(-1)
  const [value, setValue] = useState<number | null>(2)
  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>()
  const [popUp, setPopUp] = useState<boolean>(false)
  const [tracking, setTracking] = useState<Tracking>()
  const route = useRouter();
  console.log(tracking)
  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }

  useEffect(() => {
    const fetchMyTracking = async () => {
      const id = route.query.id;

      try {
        const res = await fetch(
          `/api/tracking/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setTracking(data)
        }
        if (res.status == 404) {
          route.replace('/404');
        }
        if (res.status == 500) {
          route.replace('/500');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyTracking();
  }, []);

  const newTrackingRecord = async () => {
    const id = route.query.id;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())

    const requestBody = {
      id: id,
      data: {
        date: currentDate,
        number: value
      }
    };
    try {
      const res = await fetch('/api/tracking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 200) {
        const data = await res.json();
        setTracking(data)
        setTitlePopUp('Seguimiento registrado con éxito!')
        setPopUp(true)
      } else {
        setTitlePopUp('Error al guardar el seguimiento')
        setPopUp(true)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };



  return (
    <Grid >
      <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <Box ml={5}>
          <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>Métricas</h2>
        </Box>
        {!isTrainer ? (
          <Button sx={{ mx: 4, my: 4 }} variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setNuevoRegistro(true)}>
            Registro
          </Button>
        ) : null}




      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
          <CardTrackingMensual></CardTrackingMensual>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>

          <CardWorkoutMensual></CardWorkoutMensual>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { md: '50%', xs: '100%' }, padding: 1, height: '300px' }}>
          <Card sx={{ height: '300px' }} >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ejercicio</TableCell>
                    <TableCell>Series</TableCell>
                    <TableCell>Repeticiones</TableCell>
                    <TableCell>Peso</TableCell>
                    <TableCell align='left'>Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {day.Ejercicios.map((exercise, exerciseIndex) => (
                    <TableRow key={exerciseIndex}>
                      <TableCell>

                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                          <TextField
                            type="text"
                            value={exercise.nombreEjercicio}
                            onChange={(e) =>
                              handleExerciseDataChange(dayIndex, exerciseIndex, 'nombreEjercicio', e.target.value)
                            }

                          />
                        ) : (
                          exercise.nombreEjercicio
                        )}
                      </TableCell>
                      <TableCell>

                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                          <TextField
                            type="number"
                            value={exercise.series}
                            onChange={(e) =>
                              handleExerciseDataChange(dayIndex, exerciseIndex, 'series', e.target.value)
                            }
                          />
                        ) : (
                          exercise.series
                        )}
                      </TableCell>
                      <TableCell>
                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                          <TextField
                            type="number"
                            value={exercise.repeticiones}
                            onChange={(e) =>
                              handleExerciseDataChange(dayIndex, exerciseIndex, 'repeticiones', e.target.value)

                            }
                          />
                        ) : (
                          exercise.repeticiones
                        )}
                      </TableCell>
                      <TableCell>
                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                          <TextField
                            type="number"
                            value={exercise.peso}
                            onChange={(e) =>
                              handleExerciseDataChange(dayIndex, exerciseIndex, 'peso', e.target.value)
                            }
                          />
                        ) : (
                          exercise.peso
                        )}
                      </TableCell>
                      <TableCell>
                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                          <TextField
                            type="text"
                            value={exercise.link}
                            onChange={(e) => handleExerciseDataChange(dayIndex, exerciseIndex, 'link', e.target.value)

                            }
                          />
                        ) : (
                          <>
                            {exercise.link && exercise.link.trim() !== '' ? (
                              <a style={{ color: 'red' }} href={exercise.link} target="_blank" rel="noopener noreferrer">
                                {exercise.link.includes('drive.google.com') ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                  </svg>
                                ) : exercise.link.includes('youtube.com') ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569-.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                    <path d="M8.293 8.293a.5.5 0 0 0 .707 0l3-3a.5.5 0 0 0-.707-.707l-3 3a.5.5 0 0 0 .707.707zM7.5 10a.5.5 0 0 0-.5-.5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a.5.5 0 0 0 0-1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3.5z" />
                                    <path d="M11.5 5a.5.5 0 0 0 .5-.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a.5.5 0 0 0 .5-.5z" />
                                  </svg>
                                )}
                              </a>
                            ) : (
                              <span style={{ color: 'skyblue' }}> No se adjuntó link.</span>
                            )}
                          </>
                        )}
                      </TableCell>

                      <TableCell>
                        {esEntrenador && (
                          <>
                            {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                              <Icon
                                icon='mdi:check'
                                onClick={() => handleExerciseUpdate(dayIndex)}
                                style={{ cursor: 'pointer', color: 'lightgreen' }}
                              />
                            ) : (
                              <Icon
                                icon='mdi:pencil'
                                onClick={() => setEditingExerciseIndexs(dayIndex, exerciseIndex)}
                                style={{ cursor: 'pointer', color: 'skyblue' }}
                              />
                            )}

                            <Icon
                              icon='mdi:trash'
                              onClick={() => handleDeleteRow(dayIndex, exerciseIndex)}
                              style={{ marginLeft: '20px', cursor: 'pointer', color: 'skyblue' }}
                            />
                          </>
                        )}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {esEntrenador && (
                <ButtonStyled variant='contained' onClick={() => handleAddRow(dayIndex)} sx={{ marginTop: '15px' }}>
                  Agregar Ejercicio
                </ButtonStyled>
              )}
            </TableContainer>

          </Card>
        </Box>
        <Box sx={{ width: { md: '50%', xs: '100%' }, padding: 1, height: '300px' }}>

        </Box>
      </Box>



      <Dialog
        open={nuevoRegistro}
        onClose={handlePopUpNuevoRegistro}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id='user-view-plans'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          Agregar un nuevo registro
        </DialogTitle>
        <Box display='column' justifyContent={'center'} >

          <Typography sx={{ textAlign: 'center', mt: '10px' }}>
            ¿Cómo estuvo el entrenamiento de hoy?
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: ['wrap', 'nowrap'],
              pt: theme => `${theme.spacing(2)} !important`,
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={value}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValue) => setValue(newValue)}
                onChangeActive={(event, newHover) => setHover(newHover)}
              />
              {value !== null && <Typography>{labels[hover !== -1 ? hover : value]}</Typography>}
            </Box>
          </Box>

        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 5, mb: 5 }}>
          <Button variant='contained' onClick={() => newTrackingRecord()}>
            Aceptar
          </Button>

        </Box>
      </Dialog>
    </Grid >
  )

};


Tracking.acl = {
  action: 'manage',
  subject: 'tracking-page'
}


export default Tracking
