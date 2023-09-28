// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useSession } from 'next-auth/react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
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

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  borderRadius: 8,
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

interface Chat {
  planId: string
  messages: [Message]
}

interface Message {
  userId: string,
  message: string,
  date: string,
  fullName: string,
}


const Foro = (props: Props) => {

  //*props
  const { foroPopUp, setForoPopUp, planId } = props

  //*state
  // const [popUp, setPopUp] = useState<boolean>(false)
  // const closePopUp = () => setPopUp(false)
  const [mensaje, setMensaje] = useState('');
  const [foro, setForo] = useState<Chat>();
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
          setForo(data)
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
    currentDate.setHours(currentDate.getHours() - 3)
    const formattedDate = currentDate.toISOString();
    const userId = session.data?.user._id;
    const fullName = session.data?.user.name;
    const mensajeEnviado = mensaje;
    const newMessage = {
      message: mensajeEnviado,
      date: formattedDate,
      userId: userId,
      fullName: fullName
    }
    console.log('New Message:', newMessage);
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
      <Dialog fullWidth open={foroPopUp} onClose={handleCloseForoPopUp} sx={{
        '& .MuiPaper-root': {
          maxWidth: 650, width: 0,
          flexGrow: 1,
          height: '100%',
          backgroundColor: '142751'
        }
      }}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          {/* aca estaria la logica de mostrar los mensajes */}
          <ul>
            {foro?.messages.map((message: Message, index) => (
              <li
                key={index}
                style={{
                  textAlign: String(session.data?.user?._id) === message?.userId ? 'right' : 'left',
                  color: String(session.data?.user?._id) === message?.userId ? '#FFA500' : '#ADD8E6'
                }}
              >
                {message ? (
                  <div>
                    <p>Usuario: {message.fullName}</p>
                    <p>Fecha: {new Date(message.date).toLocaleString()}</p>
                    <p>Mensaje: {message.message}</p>
                  </div>
                ) : (
                  <p>Mensaje nulo</p>
                )}
              </li>
            ))}
          </ul>
        </DialogContent>
        <Form onSubmit={submitMessage}>
          <ChatFormWrapper>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Type your message here…'
                value={mensaje}
                autoComplete="off"
                onChange={handleChangeMensaje}
                sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button type='submit' variant='contained'>
                Send
              </Button>
            </Box>
          </ChatFormWrapper>
        </Form>

        {/* <DialogActions
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

        </DialogActions> */}
      </Dialog>
    </>
  )
}

export default Foro
