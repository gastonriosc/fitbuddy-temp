// ** React Imports
import { useEffect, useState } from 'react'

// import { useRouter } from 'next/router'
// import { useSession } from 'next-auth/react'
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
import DialogContent from '@mui/material/DialogContent'

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



const Tracking = () => {

  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)

  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }

  const labels: { [index: string]: string } = {
    1: 'Malo',
    2: 'Bueno',
    3: 'Muy Bueno',
    4: 'Excelente',
  }
  const [hover, setHover] = useState<number>(-1)
  const [value, setValue] = useState<number | null>(2)

  return (
    <Grid >
      <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <CardHeader
          title='SEGUIMIENTO'

        /> */}
        <Typography sx={{ marginLeft: '20px' }}>SEGUIMIENTO</Typography>
        <Button sx={{ mx: 4, my: 4 }} variant='contained' onClick={() => setNuevoRegistro(true)}>
          <Icon icon='mdi:plus' />
          Registro
        </Button>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
          <CardTrackingMensual></CardTrackingMensual>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>

          <CardWorkoutMensual></CardWorkoutMensual>
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Card >
          Historial de registros?
        </Card>
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
        <Box display='flex' justifyContent={'center'} >

          <Typography sx={{ textAlign: 'center', mt: '10px' }}>
            Como estuvo el entrenamiento de hoy?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
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
          <Button variant='contained' onClick={() => handlePopUpNuevoRegistro()}>
            <Icon icon='mdi:plus' />
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
