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
import { DataGrid, GridColDef } from '@mui/x-data-grid'

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

interface CellType {
  row: Tracking
}

// const columns: GridColDef[] = [
//   {
//     flex: 0.2,
//     minWidth: 230,
//     field: 'fecha',
//     headerName: 'Fecha',
//     renderCell: ({ row }: CellType) => {
//       const { data } = row

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {renderClient(row)}
//           <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
//             <LinkStyled >{row.data.date}</LinkStyled>
//             <Typography noWrap variant='caption'>
//               {`@${username}`}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     flex: 0.1,
//     minWidth: 90,
//     sortable: false,
//     field: 'actions',
//     headerName: 'Actions',
//     renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
//   }
// ]


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
