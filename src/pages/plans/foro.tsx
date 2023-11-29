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



// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Divider from '@mui/material/Divider'
import React from 'react'


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
  trainerAvatar: string,
  expirationDate: string,
  some: any,
  map: any,
}
interface Message {
  userId: string,
  message: string,
  date: string,
  fullName: string,
}


const Foro = (props: Props) => {

  //*props
  const { foroPopUp, setForoPopUp } = props

  //*state
  // const [popUp, setPopUp] = useState<boolean>(false)
  // const closePopUp = () => setPopUp(false)
  const [mensaje, setMensaje] = useState('');
  const [foro, setForo] = useState<Chat>();
  const [infoPlan, setInfoPlan] = useState<InfoPlan>()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitMessage = async () => {
    const planId = route.query.id;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())
    const formattedDate = currentDate.toISOString();
    const userId = session.data?.user._id;
    const mensajeEnviado = mensaje;
    const newMessage = {
      message: mensajeEnviado,
      date: formattedDate,
      userId: userId,
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
        setForo(prevForo => {
          if (prevForo) {
            const updatedMessages = [...prevForo.messages, newMessage];

            return { ...prevForo, messages: updatedMessages };
          }

          return prevForo;
        });
        setMensaje('');
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

          <ul style={{ listStyleType: 'none', padding: 0, width: '100%', }}>
            {foro?.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((message: Message, index) => (
              <li
                key={index}

                style={{
                  textAlign: 'center',

                  boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '6px',
                  marginTop: '8px'
                }}
              >
                {(index === 0 || new Date(message.date).toLocaleDateString() !== new Date(foro?.messages[index - 1].date).toLocaleDateString()) && (

                  <p>{new Date(message.date).toLocaleDateString()}</p>
                )}

                <Box mb={5}>
                  <Box >
                    {message.userId.toString() === String(session.data?.user._id) ? (
                      <>
                        <Box display={'flex'} mr={-10} justifyContent={'right'}>

                          <Typography
                            sx={{
                              boxShadow: 1,
                              borderRadius: 1,
                              maxWidth: '100%',
                              width: 'fit-content',
                              fontSize: '0.875rem',
                              wordWrap: 'break-word',
                              p: theme => theme.spacing(3, 4),
                              mr: 0,
                              textAlign: 'left',
                              borderTopRightRadius: 0,
                              color: 'common.white',
                              backgroundColor: 'primary.main',

                            }}
                          >
                            {message.message}
                          </Typography>
                          <ImgStyled sx={{ padding: 1 }} src={session.data?.user.avatar} alt='Profile Pic' />
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box display={'flex'}>
                          {infoPlan?.map((plan: InfoPlan, index: any) => (
                            <ImgStyled
                              key={index}
                              sx={{ padding: 1 }}
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
                              ml: -10,
                              textAlign: 'left',
                              borderTopLeftRadius: 0,
                              color: 'text.primary',
                              backgroundColor: 'secondary.main',
                            }}
                          >
                            {message.message}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  <div style={{ flex: 1, textAlign: 'right' }}>
                    {message ? (
                      <>
                        <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                          {new Date(message.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>

                      </>
                    ) : (
                      <p>Mensaje nulo</p>
                    )}
                  </div>
                </Box>

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
              <Button
                type='button'
                variant='contained'
                onClick={submitMessage}
                disabled={!infoPlan?.some((plan: InfoPlan) => plan.expirationDate && new Date(plan.expirationDate) > new Date())}
              >
                Enviar
              </Button>
            </Box>
          </ChatFormWrapper>
        </Form>

      </Dialog >
    </>
  )
}

export default Foro
