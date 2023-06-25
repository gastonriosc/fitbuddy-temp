// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
// import Divider from '@mui/material/Divider'
// import Checkbox from '@mui/material/Checkbox'
// import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import Typography, { TypographyProps } from '@mui/material/Typography'
// import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
// import { useSettings } from 'src/@core/hooks/useSettings'
// import { display } from '@mui/system'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

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

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
  [theme.breakpoints.up('lg')]: {
    width: '35rem'
  }
}))

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
    maxWidth: 800
  }
}))

// const CardContent1 = styled(Box)<BoxProps>(({ theme }) => ({
//   width: '100%',
//   [theme.breakpoints.up('md')]: {
//     maxWidth: 400
//   },
//   [theme.breakpoints.up('lg')]: {
//     maxWidth: 800
//   }
// }))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 800
  }
}))

// const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
//   fontWeight: 600,
//   letterSpacing: '0.18px',
//   marginBottom: theme.spacing(1.5),
//   [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
// }))

// const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
//   marginBottom: theme.spacing(4),
//   '& .MuiFormControlLabel-label': {
//     fontSize: '0.875rem',
//     color: theme.palette.text.secondary
//   }
// }))

// const LinkStyled = styled(Link)(({ theme }) => ({
//   textDecoration: 'none',
//   color: theme.palette.primary.main
// }))

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordC, setShowPasswordC] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [showAdditionalSelect, setShowAdditionalSelect] = useState(false)
  const paises = ['Argentina']
  const [selectedCountry, setSelectedCountry] = useState('')

  // ** Hooks
  // const theme = useTheme()
  // const { settings } = useSettings()
  // const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value)
  }

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCountry(event.target.value)
  }

  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    setSelectedGender(event.target.value)
  }


  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value)
    setSelectedOption('')
    setShowAdditionalSelect(event.target.value === 'Entrenador')
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 6.5)} !important` }}>
          {/* {!hidden ? (
            // <Box
            //   sx={{
            //     flex: 1,
            //     display: 'flex flex-col',
            //     position: 'relative',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     overflowY: 'auto',
            //     scrollbarWidth: 'none', // Oculta la barra de desplazamiento en navegadores compatibles
            //     backgroundImage: `url(${imageSource})`,
            //     backgroundSize: 'cover',
            //     filter: 'brightness(70%)',
            //     backgroundPosition: 'center',
            //     backgroundRepeat: 'no-repeat',
            //     backgroundAttachment: 'fixed',
            //     height: '100vh',
            //   }}>


            // </Box>
          ) : null} */}
          <RightWrapper sx={{ width: '100%' }}>
            <BoxWrapper sx={{}}>
              <Box
                sx={{
                  mb: 8,
                  mt: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <Box sx={{ mb: 5, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant='body1'>
                  Completá los campos para empezá a ser parte de nuestra comunidad! 😊
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                <TextField autoFocus fullWidth sx={{ mb: 4 }} label='Nombre' />
                <TextField autoFocus fullWidth sx={{ mb: 4 }} label='Telefono' />
                <Box sx={{ display: 'flex', gap: '5px', width: '100%' }}>
                  <Select
                    autoFocus
                    fullWidth
                    sx={{ mb: 4 }}
                    labelId='country-select-label'
                    id='country-select'
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    displayEmpty
                  >
                    <MenuItem value='' disabled>
                      País
                    </MenuItem>
                    {paises.map((pais, index) => (
                      <MenuItem key={index} value={pais}>
                        {pais}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    autoFocus
                    fullWidth
                    sx={{ mb: 4 }}
                    value={selectedGender}
                    onChange={handleGenderChange}
                    displayEmpty
                  >
                    <MenuItem value='' disabled>
                      Género
                    </MenuItem>
                    <MenuItem value='Femenino'>Femenino</MenuItem>
                    <MenuItem value='Masculino'>Masculino</MenuItem>
                    <MenuItem value='Otro'>Otro</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  <Select
                    autoFocus
                    fullWidth
                    sx={{ mb: 4 }}
                    labelId='role-select-label'
                    id='role-select'
                    value={selectedRole}
                    onChange={handleRoleChange}
                    displayEmpty
                  >
                    <MenuItem value='' disabled>
                      Rol
                    </MenuItem>
                    <MenuItem value='Alumno'>Alumno</MenuItem>
                    <MenuItem value='Entrenador'>Entrenador</MenuItem>
                  </Select>

                  {showAdditionalSelect && (
                    <Select
                      autoFocus
                      fullWidth
                      sx={{ mb: 4 }}
                      labelId='discipline-select-label'
                      id='discipline-select'
                      value={selectedOption}
                      onChange={handleOptionChange}
                      displayEmpty
                    >
                      <MenuItem value='' disabled>
                        Disciplina
                      </MenuItem>
                      <MenuItem value='Musculacion'>Musculación</MenuItem>
                    </Select>
                  )}
                </Box>

                <TextField fullWidth label='Email' sx={{ mb: 4 }} />
                <Box sx={{ display: 'flex', gap: '5px' }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-login-v2-password'>Contraseña</InputLabel>
                    <OutlinedInput
                      label='Contraseña'
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
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-login-v2-passwordC'>Confirme Contraseña</InputLabel>
                    <OutlinedInput
                      label='Confirme Contraseña'
                      id='auth-login-v2-passwordC'
                      type={showPasswordC ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPasswordC(!showPasswordC)}
                          >
                            <Icon icon={showPasswordC ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>

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
                  Registrarme
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography sx={{ mr: 2, color: 'text.secondary' }}>Ya tienes una cuenta?</Typography>
                  <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Iniciá sesión
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
          </RightWrapper>
        </CardContent>
      </Card>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
