// ** React Imports
import { useState } from 'react'


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
}

const RequestPopUp = (props: Props) => {

  //*props
  const { requestPopUp, setRequestPopUp, requestId, type, title } = props


  //*state
  const [popUp, setPopUp] = useState<boolean>(false)
  const closePopUp = () => setPopUp(false)
  const handleCloseRequestPopUp = () => setRequestPopUp(false)
  const handleOpenPopUp = () => {
    handleCloseRequestPopUp()
    setPopUp(true)
  }

  // const updateSubscription: SubmitHandler<FieldValues> = async (data) => {
  //   let name, amount, description;
  //   let deleted;

  //   if (openPlans) {
  //     name = data.name
  //     amount = data.amount
  //     description = data.description;
  //     deleted = false;
  //   }
  //   else {
  //     name = deletedSubs?.name
  //     amount = deletedSubs?.amount
  //     description = deletedSubs?.description;
  //     deleted = true;
  //   }

  //   try {
  //     const res = await fetch('/api/subscription', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ subsId, name, amount, description, deleted })
  //     })
  //     if (res.status == 200) {
  //       if (openPlans) {
  //         handlePlansClose()
  //         setTitlePopUp('Suscripción editada!')
  //         setPopUp(true)
  //       }
  //       else {
  //         hadleCloseDeleteSubscriptionPopUp()
  //         setTitlePopUp('Suscripción borrada!')
  //         setPopUp(true)
  //       }

  //     }
  //     else {
  //       if (res.status == 409) {
  //         console.log('error 409')
  //       }
  //       if (res.status == 400) {
  //         route.replace('/404')
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
            <Typography variant='h5' sx={{ mb: 5 }}>¿Seguro que deseas {type} la solicitud de suscripcion?</Typography>
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
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleOpenPopUp()}>
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
            <Typography variant='h4' sx={{ mb: 5 }}>Solicitud de suscripcion {title}</Typography>
            <Typography>Refresque la pagina para ver los cambios</Typography>
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
