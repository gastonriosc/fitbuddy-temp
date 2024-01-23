// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'

import DialogContent from '@mui/material/DialogContent'

import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { TextareaAutosize } from '@mui/material'

type Props = {
  requestPopUp: boolean
  setRequestPopUp: (val: boolean) => void
  type: string
  title: string
  requestId: string
  setSubsRequest: any
}

const RequestPopUp = (props: Props) => {

  //*props
  const { requestPopUp, setRequestPopUp, requestId, type, title, setSubsRequest } = props

  //*state
  const [popUp, setPopUp] = useState<boolean>(false)

  const closePopUp = () => setPopUp(false)
  const handleCloseRequestPopUp = () => setRequestPopUp(false)

  const route = useRouter();
  const session = useSession();

  const [rejectionReasons, setRejectionReason] = useState('');


  const handleRejectionReasonChange = (event: any) => {
    setRejectionReason(event.target.value);
  };

  const updateSubscriptionRequest = async () => {
    let status;
    let rejectionReason;


    if (type === 'aceptar') {
      status = 'aceptada';
    }
    else if (type === 'rechazar') {
      status = 'rechazada';
      rejectionReason = rejectionReasons;

    }
    else if (type === 'cancelar') {
      status = 'cancelada';
    }
    else if (type === 'borrar') {
      status = 'borrada';
    }

    try {
      const res = await fetch('/api/subsRequests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, status, rejectionReason })
      })
      if (res.status == 200) {
        if (type === 'aceptar') {
          route.replace('/myStudents/' + session.data?.user._id)
        }
        else {
          setRequestPopUp(false)
          setPopUp(true)
          setSubsRequest((prevSubs: any) => prevSubs.filter((subsRequest: any) => subsRequest._id !== requestId));
          setRejectionReason('');
        }
      }
      else {
        if (res.status == 404) {
          route.replace('/404')
        }
        if (res.status == 500) {
          route.replace('/500')
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
            <Icon icon='line-md:alert' fontSize='5.5rem' />
            <Typography variant='h5' sx={{ mb: 5 }}>¿Seguro que deseas {type} la solicitud de suscripción?</Typography>
            {type === 'rechazar' && (
              <div>
                <TextareaAutosize
                  aria-label="Razón de rechazo"
                  minRows={2}
                  cols={50}
                  placeholder='Por favor, proporcione una razón para el rechazo:'
                  style={{
                    width: '100%',
                    marginBottom: 2,
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: 'none',
                    outline: 'none',
                  }}
                  value={rejectionReasons}
                  onChange={handleRejectionReasonChange}
                />
              </div>
            )}

          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button
            variant='contained'
            sx={{ mr: 2 }}
            onClick={() => updateSubscriptionRequest()}
            disabled={type === 'rechazar' && rejectionReasons.trim() === ''}
          >
            Confirmar
          </Button>
          <Button variant='outlined' color='error' onClick={handleCloseRequestPopUp} >
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
            <Icon icon='line-md:confirm' fontSize='5.5rem' />
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
