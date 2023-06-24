// ** React Imports
// import { useState, ReactNode, MouseEvent } from 'react'
import React, { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import { List, ListItem } from '@mui/material';

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import 'react-perfect-scrollbar/dist/css/styles.css';


// import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
// import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
// import { positions, textAlign } from '@mui/system'

//** Styled Components
// const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
//   [theme.breakpoints.down('lg')]: {
//     padding: theme.spacing(10)
//   }
// }))


//* imgg in login function
// const LoginIllustration = styled('img')(({ theme }) => ({
//   width: '100%',
//   [theme.breakpoints.down('xl')]: {
//     maxWidth: '38rem'
//   },
//   [theme.breakpoints.down('lg')]: {
//     maxWidth: '30rem'
//   }
// }))


const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: '50%'
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))



// const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'entrenador',
  email: 'juantargon@gmail.com'
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showAlumnosFeatures, setShowAlumnosFeatures] = useState(false);
  const [showEntrenadoresFeatures, setShowEntrenadoresFeatures] = useState(false);

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }
  const handleShowAlumnosFeatures = () => {
    setShowAlumnosFeatures(true);
    setShowEntrenadoresFeatures(false); // Ocultar el texto de características de entrenadores al mostrar el de alumnos
  };

  const handleShowEntrenadoresFeatures = () => {
    setShowEntrenadoresFeatures(true);
    setShowAlumnosFeatures(false);

    // Ocultar el texto de características de alumnos al mostrar el de entrenadores
  };

  const imageSource = '';
  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex flex-col',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${imageSource})`,
            backgroundSize: '18%',
            // filter: 'brightness(70%)',
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            height: '100vh',
          }}
        >


          {/* <Box sx={{ textAlign: 'center', alignItems: 'center', marginTop: '25%' }}>
            <Typography variant='h2' sx={{ fontFamily: 'Bebas Neue', font: 'Bold', color: 'white', mb: '10px' }}>
              FitBuddy
            </Typography>
            <Box sx={{ left: '50%', top: '20%', mx: 'auto', mb: '30px' }}>
              <Typography variant='h4' sx={{ color: 'white', fontFamily: 'Bebas Neue' }} >
                Entrene y sea entrenado cuando quiera, donde quiera.
              </Typography>
            </Box>
          </Box> */}
          <Box sx={{ textAlign: 'center', alignItems: 'center', marginTop: '15%' }}>
            <Typography variant='h2' >
              FitBuddy
            </Typography>
            <Box >
              <Typography variant='h4' sx={{ mb: '6px' }}>
                Entrene y sea entrenado cuando quiera, donde quiera.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', mt: 5 }}>
            <Button onClick={handleShowAlumnosFeatures} size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Características de Alumnos
            </Button>
            {/* <Button onClick={handleShowEntrenadoresFeatures} size='large' type='submit' variant='contained' sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(60px)', border: '3px solid black', borderRadius: '50px', mb: 7, width: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'white' }}>
              Características de Entrenadores
            </Button> */}
            <Button onClick={handleShowEntrenadoresFeatures} size='large' type='submit' variant='contained' sx={{ mb: 7 }} >
              Características de Entrenadores
            </Button>
          </Box>

          {showAlumnosFeatures && (
            <List sx={{ listStyleType: 'disc', listStylePosition: 'inside', fontSize: '1.6rem', justifyContent: 'center', color: 'white', textAlign: 'center', alignItems: 'center' }} >

              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                Entrená con expertos en cualquier lugar.
              </ListItem>

              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.2s forwards' }}>
                Planes personalizados a tu medida.
              </ListItem>

              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.4s forwards' }}>
                Descubrí y elegí entre una amplia variedad de entrenadores.
              </ListItem>

              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.6s forwards' }}>
                Realizá pagos seguros y confiables a través de la plataforma.
              </ListItem>

              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.8s forwards' }}>
                Comentarios y valoraciones de otros alumnos para ayudarte en tu elección.
              </ListItem>
            </List>
          )}

          {showEntrenadoresFeatures && (
            <List
              sx={{
                listStyleType: 'disc',
                listStylePosition: 'inside',
                fontSize: '1.6rem',
                justifyContent: 'center'
              }}
            >
              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                Entrená personas de y desde cualquier parte del mundo.
              </ListItem>
              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.2s forwards' }}>
                Creá tus planes personalizados para cada alumno.
              </ListItem>
              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.4s forwards' }}>
                Realizá el seguimiento de cada alumno.
              </ListItem>
              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.6s forwards' }}>
                Publicá y cobrá tus distintos tipos de planes.
              </ListItem>
              <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', marginLeft: '20%', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.8s forwards' }}>
                Crea tu perfil profesional y dale visibilidad a tus servicios.
              </ListItem>
            </List>
          )}
        </Box>
      ) : null}

      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 8,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >

          <BoxWrapper>

            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>{`Bienvenido a ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
              <Typography variant='body2'>Inicia sesión para comenzar</Typography>
            </Box>
            <Alert icon={false} sx={{ py: 3, mb: 6, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
              <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'primary.main' }}>
                Entrenador: <strong>juantargon@gmail.com</strong> / Pass: <strong>entrenador</strong>
              </Typography>
              <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
                Alumno: <strong>facutissera@gmail.com</strong> / Pass: <strong>alumno</strong>
              </Typography>
            </Alert>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='email@ejemplo.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Contraseña
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <Box sx={{ pr: 2 }}>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                            </IconButton>
                          </Box>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  label='Recordarme'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography
                  variant='body2'
                  component={Link}
                  href='/forgot-password'
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  Olvidé mi contraseña
                </Typography>
              </Box>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Ingresar
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Eres nuevo?</Typography>
                <Typography href='/register' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Creá una cuenta
                </Typography>
              </Box>

            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>

    </Box >
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

LoginPage.guestGuard = true;

export default LoginPage;
