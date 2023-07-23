// ** React Imports
// import { useState, ReactNode, MouseEvent } from 'react'
import React, { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

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
import { ListItem } from '@mui/material';
import Stack from '@mui/material/Stack';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
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
  email: yup.string().email("Debe ser un email válido").required("Email es un campo obligatorio"),
  password: yup.string().required("Contraseña es un campo obligatorio").min(5, "Debe contener 5 caracteres mínimo")
})

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
  const router = useRouter()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  // ** React-Hook-Form
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur', //onBlur hace que los errores se muestren cuando el campo pierde focus.
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // data = {email: 'juantargon@gmail.com', password: 'entrenador'}
    const { email, password } = data
    signIn('credentials', { email, password, redirect: false }).then(res => {
      if (res && res.ok) {
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      } else {
        setError('email', {
          type: 'manual',
          message: 'Email or Password is invalid hola lonig'
        })
      }
    })
  }

  const handleShowAlumnosFeatures = () => {
    setShowAlumnosFeatures(true);
    setShowEntrenadoresFeatures(false); // Ocultar el texto de características de entrenadores al mostrar el de alumnos
  };

  const handleShowEntrenadoresFeatures = () => {
    setShowEntrenadoresFeatures(true);
    setShowAlumnosFeatures(false); // Ocultar el texto de características de alumnos al mostrar el de entrenadores
  };


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
            backgroundSize: '18%',

            // filter: 'brightness(70%)',
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            height: '100vh',
          }}
        >
          <Box sx={{ textAlign: 'center', alignItems: 'center', marginTop: '15%' }}>
            <Typography variant='h2' >
              FitBuddy
            </Typography>
            <Box >
              <Typography variant='h5' sx={{ mb: '6px' }}>
                Entrene y sea entrenado cuando quiera, donde quiera.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', mt: 5 }}>
            <Button onClick={handleShowAlumnosFeatures} size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Características de Alumnos
            </Button>
            <Button onClick={handleShowEntrenadoresFeatures} size='large' type='submit' variant='contained' sx={{ mb: 7 }} >
              Características de Entrenadores
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px', mt: 5, fontSize: '1.2rem' }}>
            {showAlumnosFeatures && (
              <Stack>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                  Entrená con expertos en cualquier lugar.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.2s forwards' }}>
                  Planes personalizados a tu medida.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.4s forwards' }}>
                  Descubrí y elegí entre una amplia variedad de entrenadores.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.6s forwards' }}>
                  Realizá pagos seguros y confiables a través de la plataforma.
                </ListItem>
              </Stack>
            )}
            {showEntrenadoresFeatures && (
              <Stack>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out forwards' }}>
                  Entrená personas de y desde cualquier parte del mundo.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.2s forwards' }}>
                  Creá tus planes personalizados para cada alumno.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.4s forwards' }}>
                  Realiza el seguimiento de cada alumno.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.6s forwards' }}>
                  Publicá y cobra tus distintos tipos de planes.
                </ListItem>
                <ListItem sx={{ display: 'list-item', justifyContent: 'center', alignItems: 'center', color: 'white', opacity: 0, animation: 'fadeIn 0.2s ease-in-out 0.8s forwards' }}>
                  Crea tu perfil profesional y dale visibilidad a tus servicios.
                </ListItem>
              </Stack>
            )}
          </Box>

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
              <Typography variant='body2'>Iniciá sesión para comenzar</Typography>
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
                      placeholder='ejemplo@email.com'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='password' error={Boolean(errors.password)}>
                  Contraseña
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      label='Contraseña'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      id='password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <Box sx={{ pr: 2 }}>
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={e => e.preventDefault()}
                              edge='end'
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
                <Typography
                  component={Link}
                  href='/register'
                  sx={{ color: 'primary.main', textDecoration: 'none' }}>
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
