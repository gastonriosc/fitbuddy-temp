// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
// import NewSubsPopUp from './newSubsPopUp'
//import CardWorkoutMensual from './cardWorkouts'
import CardTrackingMensual from './cardTracking'
import TrackingPopUp from './trackingPopUp'


// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Pagination from '@mui/material/Pagination'


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
  const [titlePopUp, setTitlePopUp] = useState<string>('')
  const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
  const [tracking, setTracking] = useState<Tracking>()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const route = useRouter();

  console.log(tracking)
  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }
  const itemsPerPage = 6;
  const totalPages = Math.ceil(tracking?.data.length / itemsPerPage);
  console.log(totalPages)

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
        setNuevoRegistro(false)
        setTracking(data)
        setTitlePopUp('Seguimiento registrado con éxito!')
        setTrackingPopUp(true)
      } else {
        setNuevoRegistro(false)
        setTitlePopUp('Error al guardar el seguimiento')
        setTrackingPopUp(true)
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

      {tracking ? (
        <Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
              <CardTrackingMensual tracking={tracking}></CardTrackingMensual>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1, height: '485px' }}>

              {/* <CardWorkoutMensual tracking={tracking}></CardWorkoutMensual> */}
              <Card sx={{ height: '485px' }} >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Historial</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Puntuación</TableCell>
                        {/* <TableCell style={{ textAlign: 'center' }} >Acciones</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>{new Date(trackingItem.date).toLocaleDateString()}</TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.number} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labels[trackingItem.number]}</Typography>
                              </Box>
                            </TableCell>
                            {/* <TableCell style={{ textAlign: 'center' }}>
          <Icon
            icon='mdi:pencil'
          />
        </TableCell> */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
                  <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
                </Box>
              </Card>
            </Box>
          </Box>

          {/* <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ width: { md: '50%', xs: '100%' }, padding: 1, height: '300px' }}>

            </Box>
          </Box> */}
        </Box>
      ) : (
        <Box sx={{ mt: '50px', mb: '20px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>No tenés solicitudes de suscripciones por el momento.</Typography>
        </Box>
      )}


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
      <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>
    </Grid >
  )

};


Tracking.acl = {
  action: 'manage',
  subject: 'tracking-page'
}


export default Tracking
