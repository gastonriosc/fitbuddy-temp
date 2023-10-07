// ** React Imports
// import { useEffect, useState } from 'react'
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

// import Dialog from '@mui/material/Dialog'
// import FormHelperText from '@mui/material/FormHelperText'
// import DialogActions from '@mui/material/DialogActions'
// import CircularProgress from '@mui/material/CircularProgress'
// import Divider from '@mui/material/Divider'

// import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'

// import CardContent from '@mui/material/CardContent'

// import DialogTitle from '@mui/material/DialogTitle'
// import FormControl from '@mui/material/FormControl'
// import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

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


  return (
    <Grid >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>

          <CardTrackingMensual></CardTrackingMensual>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>

          <CardWorkoutMensual></CardWorkoutMensual>
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button>Cargar registro</Button>
        <Card >
          Historial de registros?
        </Card>
      </Box>
    </Grid >
  )
};


Tracking.acl = {
  action: 'manage',
  subject: 'tracking-page'
}


export default Tracking
