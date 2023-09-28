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

//import Input from '@mui/material/Input'
//import DialogActions from '@mui/material/DialogActions'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Divider from '@mui/material/Divider'

//import { margin } from '@mui/system'

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

const ImgStyled = styled('img')(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(10),
  borderRadius: theme.shape.borderRadius
}))

interface Chat {
  planId: string
  messages: [Message]
}

interface InfoPlan {
  studentName: string,
  trainerName: string,
  studentAvatar: string,
  trainerAvatar: string
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
  const [infoPlan, setInfoPlan] = useState<InfoPlan>()
  console.log(infoPlan)
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
          setForo(data.foro)
          setInfoPlan(data.infoPlan)
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
        setForo(prevForo => {
          if (prevForo) {
            const updatedMessages = [...prevForo.messages, newMessage];

            return { ...prevForo, messages: updatedMessages };
          }

          return prevForo;
        });
        setMensaje('');


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
          maxWidth: 800, width: 0,
          flexGrow: 1,
          height: '100%',
          backgroundColor: '142751'
        }
      }}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centra los elementos horizontalmente
          }}
        >
          {/* aca estaria la logica de mostrar los mensajes */}
          {infoPlan?.map((plan: InfoPlan, index: any) => (
            <h2 key={index}> Chat con {session.data?.user.name == plan.studentName ? plan.trainerName : plan.studentName} <Icon icon='line-md:telegram' /> </h2>
          ))}
          <Divider sx={{ my: '0 !important', width: '100%', backgroundColor: 'white' }} />

          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {foro?.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((message: Message, index) => (
              <li
                key={index}

                style={{
                  textAlign: 'center', // Fecha centrada
                  // color: 'white',      // Color de la fecha
                  // marginBottom: '5px',
                  // boxShadow: '0 8px 8px rgba(0, 0, 0, 0.2)', // Estilo de sombra para simular relieve
                  // borderRadius: '8px',                       // Bordes redondeados
                  // padding: '10px',                           // Espaciado interno
                }}
              >
                {(index === 0 || new Date(message.date).toLocaleDateString() !== new Date(foro?.messages[index - 1].date).toLocaleDateString()) && (

                  // Mostrar fecha solo si es diferente a la fecha del mensaje anterior
                  <p>{new Date(message.date).toLocaleDateString()}</p>
                )}

                <Box mb={5}>
                  <Box display={'flex'}>
                    {message.userId.toString() === String(session.data?.user._id) ? (
                      <>
                        <Typography
                          sx={{
                            boxShadow: 1,
                            borderRadius: 1,
                            maxWidth: '100%',
                            width: 'fit-content',
                            fontSize: '0.875rem',
                            wordWrap: 'break-word',
                            p: theme => theme.spacing(3, 4),
                            ml: 'auto',
                            textAlign: 'right',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: 'common.white',
                            backgroundColor: 'primary.main'
                          }}
                        >
                          {message.message}
                        </Typography>
                        <ImgStyled sx={{ margin: '0 auto', padding: 1 }} src={session.data?.user.avatar} alt='Profile Pic' />
                      </>
                    ) : (
                      <>
                        {infoPlan?.map((plan: InfoPlan, index: any) => (
                          <ImgStyled
                            key={index}
                            sx={{ margin: '0 auto', padding: 1 }}
                            alt='Profile Pic'
                            src={session.data?.user.role == 'Entrenador' ? plan.studentAvatar : plan.trainerAvatar} // Establece el src con plan.studentAvatar
                          />
                        ))}
                        <Typography
                          sx={{
                            boxShadow: 1,
                            borderRadius: 1,
                            maxWidth: '100%',
                            width: 'fit-content',
                            fontSize: '0.875rem',
                            wordWrap: 'break-word',
                            p: theme => theme.spacing(3, 4),
                            ml: undefined,
                            textAlign: 'left',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            color: 'text.primary',
                            backgroundColor: 'secondary.main'
                          }}
                        >
                          {message.message}
                        </Typography>
                      </>
                    )}
                  </Box>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {message ? (
                      <>
                        <Typography variant='caption' sx={{ color: 'text.disabled' }}>{new Date(message.date).toLocaleTimeString()}</Typography>

                      </>
                    ) : (
                      <p>Mensaje nulo</p>
                    )}
                  </div>
                </Box>
                {/* <div
                  style={{
                    textAlign: String(session.data?.user?._id) === message?.userId ? 'right' : 'left',
                    color: String(session.data?.user?._id) === message?.userId ? '#ADD8E6' : 'orange',
                    display: 'flex',
                    flexDirection: String(session.data?.user?._id) === message?.userId ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    marginBottom: '10px',
                  }}
                >

                  <div style={{ marginLeft: '5px', marginRight: '5px', marginTop: '8px' }}>•</div>
                  <div style={{ flex: 1 }}>
                    {message ? (
                      <>
                        <ImgStyled sx={{ margin: '0 auto' }} src={session.data?.user.avatar} alt='Profile Pic' />
                        <p>Usuario: {message.fullName}</p>
                        <p>{new Date(message.date).toLocaleTimeString()}</p>
                        <p>{message.message}</p>
                      </>
                    ) : (
                      <p>Mensaje nulo</p>
                    )}
                  </div>
                </div> */}
              </li>
            ))}
          </ul>
        </DialogContent>
        <Form>
          <ChatFormWrapper>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Mensaje'
                value={mensaje}
                autoComplete="off"
                onChange={handleChangeMensaje}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitMessage();
                  }
                }}
                sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button type='button' variant='contained' onClick={submitMessage}>
                Enviar
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
      </Dialog >
    </>
  )
}

export default Foro
