// ** React Imports
import { ReactNode, useState } from 'react'



// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { MenuItem, Select } from '@mui/material'

// ** Demo Imports
// import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
// const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
//   padding: theme.spacing(20),
//   paddingRight: '0 !important',
//   [theme.breakpoints.down('lg')]: {
//     padding: theme.spacing(10)
//   }
// }))

// const RegisterIllustration = styled('img')(({ theme }) => ({
//   maxWidth: '48rem',
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
    maxWidth: 400
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
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showAdditionalSelect, setShowAdditionalSelect] = useState(false);
  const paises = ["País", "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido"];
  const [selectedCountry, setSelectedCountry] = useState('');



  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedOption('');
    setShowAdditionalSelect(event.target.value === 'Entrenador');
  };

  const handleOptionChanges = (event) => {
    setSelectedOption(event.target.value);
  };

  // ** Vars
  const { skin } = settings

  const imageSource = 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80';

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
            overflowY: 'auto',
            scrollbarWidth: 'none', // Oculta la barra de desplazamiento en navegadores compatibles
            backgroundImage: `url(${imageSource})`,
            backgroundSize: 'cover',
            filter: 'brightness(70%)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            height: '100vh',
          }}>


          <Box sx={{ textAlign: 'center', alignItems: 'center', marginTop: '32%' }}>
            <Typography variant='h2' sx={{ fontFamily: 'Bebas Neue', font: 'Bold', color: 'white', mb: '10px' }}>
              FitBuddy
            </Typography>
            <Box sx={{ left: '50%', top: '30%', mx: 'auto', mb: '30px' }}>
              <Typography variant='h4' sx={{ color: 'white', fontFamily: 'Bebas Neue' }} >
                Empieza tu aventura de Fitness con tan solo unos clics.
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint0_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint1_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                />
                <defs>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint0_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint1_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                </defs>
              </svg>
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h6'>Tu aventura de Fitness empieza aquí. 🚀</TypographyStyled>
              <Typography variant='body2'>Complete los siguientes campos y empiece su aventura. </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <TextField autoFocus fullWidth sx={{ mb: 4 }} label='Nombre Completo' placeholder='Joaquin Manero' />
              <TextField autoFocus fullWidth sx={{ mb: 4 }} label='Telefono' />

              <Select autoFocus fullWidth sx={{ mb: 4 }}
                value={selectedOption}
                onChange={handleOptionChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Género
                </MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              <Select autoFocus fullWidth sx={{ mb: 4 }}
                labelId="role-select-label"
                id="role-select"
                value={selectedRole}
                onChange={handleRoleChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Rol
                </MenuItem>
                <MenuItem value="Alumno">Alumno</MenuItem>
                <MenuItem value="Entrenador">Entrenador</MenuItem>
              </Select>
              {showAdditionalSelect && (
                <Select autoFocus fullWidth sx={{ mb: 4 }}
                  labelId="discipline-select-label"
                  id="discipline-select"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Tipo Disciplina
                  </MenuItem>
                  <MenuItem value="Musculacion">Musculación</MenuItem>
                  <MenuItem value="Aerobico">Aeróbico</MenuItem>
                </Select>)}
              <Select autoFocus fullWidth sx={{ mb: 4 }}
                labelId="country-select-label"
                id="country-select"
                value={selectedCountry}
                onChange={handleCountryChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  País
                </MenuItem>
                {paises.map((pais, index) => (
                  <MenuItem key={index} value={pais}>
                    {pais}
                  </MenuItem>
                ))}
              </Select>

              <TextField fullWidth label='Email' sx={{ mb: 4 }} placeholder='correoelectronico@email.com' />
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password'>Contraseña</InputLabel>
                <OutlinedInput
                  label='Password'
                  id='auth-login-v2-password'
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {/* <FormControlLabel
                control={<Checkbox />}
                sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                label={ 
                  <>
                    <Typography variant='body2' component='span'>
                      Estoy de acuerdo con las{' '}
                    </Typography>
                    <LinkStyled href='/' onClick={e => e.preventDefault()}>
                      politicas y términos de privacidad y condiciones
                    </LinkStyled>
                  </>
                }
              /> */}
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mt: 5, mb: 7 }}>
                Registrar
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>Ya tienes una cuenta?</Typography>
                <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Inicia sesión
                </Typography>
              </Box>
              {/* <Divider
                sx={{
                  '& .MuiDivider-wrapper': { px: 4 },
                  mt: theme => `${theme.spacing(5)} !important`,
                  mb: theme => `${theme.spacing(7.5)} !important`
                }}
              >
                or
              </Divider> */}
              {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box> */}
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
