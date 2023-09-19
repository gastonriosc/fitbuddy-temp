// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'

import DialogContent from '@mui/material/DialogContent'

import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type Props = {
  requestPopUp: boolean
  setRequestPopUp: (val: boolean) => void
  type: string
  title: string
  requestId: string
  subsRequest: subsRequest
  studentId: string
  setSubsRequest: any
}
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
}



const RequestPopUp = (props: Props) => {

  //*props
  const { requestPopUp, setRequestPopUp, requestId, type, title, setSubsRequest } = props

  //*state
  const [popUp, setPopUp] = useState<boolean>(false)
  const closePopUp = () => setPopUp(false)
  const handleCloseRequestPopUp = () => setRequestPopUp(false)

  const route = useRouter();



  const updateSubscriptionRequest = async () => {
    let status;

    if (type === 'aceptar') {
      status = 'aceptada';
    }
    else {
      status = 'rechazada';
    }
    debugger
    try {
      const res = await fetch('/api/subsRequests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, status })
      })
      if (res.status == 200) {
        if (type === 'aceptar') {
          route.replace('/myStudents')
        }
        else {
          setRequestPopUp(false)
          setPopUp(true)
          setSubsRequest((prevSubs: any) => prevSubs.filter((subsRequest: any) => subsRequest._id !== requestId));
        }
      }
      else {
        if (res.status == 409) {
          route.replace('/404')
        }
        if (res.status == 400) {
          route.replace('/404')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog fullWidth open={requestPopUp} onClose={handleCloseRequestPopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
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
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
            <Typography variant='h5' sx={{ mb: 5 }}>¿Seguro que deseas {type} la solicitud de suscripción?</Typography>
            {/* <Typography>Una vez borrada, no podrás recuperar la suscripción.</Typography> */}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => updateSubscriptionRequest()}>
            Confirmar
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleCloseRequestPopUp} >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={popUp} onClose={closePopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 670 } }}>
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
            <Icon icon='mdi:check-circle-outline' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5 }}>Solicitud de suscripción {title}</Typography>
            {/* <Typography>Refresque la pagina para ver los cambios</Typography> */}
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
    </>
  )
}

export default RequestPopUp
