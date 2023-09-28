// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useSession } from 'next-auth/react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import Input from '@mui/material/Input'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type Props = {
  foroPopUp: boolean
  setForoPopUp: (val: boolean) => void
  planId: string | undefined
}

const Foro = (props: Props) => {

  //*props
  const { foroPopUp, setForoPopUp, planId } = props

  //*state
  // const [popUp, setPopUp] = useState<boolean>(false)
  // const closePopUp = () => setPopUp(false)
  const [mensaje, setMensaje] = useState('');

  const handleChangeMensaje = (event: any) => {
    setMensaje(event.target.value);
  };

  const handleCloseForoPopUp = () => setForoPopUp(false)
  const route = useRouter();

  const session = useSession();

  useEffect(() => {
    const fetchForo = async () => {
      const id = route.query.id;
      try {
        // ** Llamada a la API para obtener datos paginados
        const res = await fetch(
          `/api/foro/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          console.log(data)
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

    fetchForo();
  }, []);

  const submitMessage = async () => {
    const planId = route.query.id;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())
    const formattedDate = currentDate.toISOString();
    const userId = session.data?.user._id
    const mensajeEnviado = mensaje;
    const newMessage = {
      message: mensajeEnviado,
      date: formattedDate,
      userId: userId
    }
    const messages = [newMessage]
    try {
      const res = await fetch('/api/foro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId, messages })
      })
      if (res.status == 200) {
        // hanldeSubscriptionRequest()
        // setTitlePopUp('Solicitud enviada!')
        // setTextPopUp('')
        // setPopUp(true)
      }
      if (res.status == 400) {
        route.replace('/404')
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog fullWidth open={foroPopUp} onClose={handleCloseForoPopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {/* <Box
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

          </Box> */}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >

          <Input
            fullWidth
            placeholder='Mensaje'
            inputProps={{ 'aria-label': 'description' }}
            value={mensaje}
            onChange={handleChangeMensaje}
          />

          <Button variant='contained' sx={{ mr: 2 }} onClick={() => submitMessage()}>
            Enviar
          </Button>

        </DialogActions>
      </Dialog>
    </>
  )
}

export default Foro
