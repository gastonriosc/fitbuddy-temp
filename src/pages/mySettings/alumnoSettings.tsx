
// ** MUI Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useSession } from 'next-auth/react'
import { CircularProgress, IconButton } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { UsersType } from 'src/types/apps/userTypes'
import Checkbox from '@mui/material/Checkbox'


interface Data {
  email: string
  country: string
  gender: string
  name: string
  password: string
  phone: number | string
  avatar: string
}

const data: UsersType = {
  _id: 1,
  role: 'admin',
  status: 'pending',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '',
  name: '',
  phone: 0,
  gender: '',
  discipline: '',
}

const initialData: Data = {
  password: '',
  name: '',
  gender: '',
  country: '',
  email: '',
  phone: '',
  avatar: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

// const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     textAlign: 'center'
//   }
// }))

// const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
//   marginLeft: theme.spacing(4),
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     marginLeft: 0,
//     textAlign: 'center',
//     marginTop: theme.spacing(4)
//   }
// }))

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}


const AlumnoProfile = () => {
  const [open, setOpen] = useState<boolean>(false)

  //const [inputValue, setInputValue] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);

  // const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData);

  // const [imgSrc, setImgSrc] = useState<string>('/images/animals/1.png')

  // const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  // const [avatar, setAvatar] = useState<string>();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSaveResult, setShowSaveResult] = useState(false);
  const [var1, setVar1] = useState("");
  const avatars = ['/images/animals/1.png', '/images/animals/2.png', '/images/animals/3.png',
    '/images/animals/4.png', '/images/animals/5.png', '/images/animals/6.png',
    '/images/animals/7.png', '/images/animals/8.png', '/images/animals/9.png', '/images/animals/10.png',
    '/images/animals/11.png', '/images/animals/12.png']
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  const handleCheckboxChange = (index: any, avatar: string) => {
    setSelectedCheckbox(index);
    handleFormChange('avatar', avatar)
  }

  // ** Hooks
  const {
    //control,
    //handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })

  const handleClose = () => setOpen(false)

  // const handleSecondDialogClose = () => setSecondDialogOpen(false)

  //field: Es el nombre del campo que se va a actualizar. Es de tipo keyof Data, lo que significa que solo se puede pasar el nombre de una propiedad válida del tipo Data.
  //value: Es el valor que se va a asignar al campo especificado por field. El tipo del valor depende del tipo de datos que tenga la propiedad en el objeto Data.
  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  //const onSubmit = () => setOpen(true)

  // const handleConfirmation = (value: string) => {
  //   handleClose()
  //   setUserInput(value)
  //   setSecondDialogOpen(true)
  // }

  // const handleInputImageChange = (file: ChangeEvent) => {
  //   const reader = new FileReader()
  //   const { files } = file.target as HTMLInputElement
  //   if (files && files.length !== 0) {
  //     reader.onload = () => setImgSrc(reader.result as string)
  //     reader.readAsDataURL(files[0])

  //     if (reader.result !== null) {
  //       setInputValue(reader.result as string)
  //     }
  //   }
  // }
  // const handleInputImageReset = () => {
  //   setInputValue('')
  //   setImgSrc('/images/animals/1.png')
  // }

  useEffect(() => {
    if (session?.user) {                    //Si session?.user existe y tiene un valor, el useEffect ejecuta la función dentro de él.
      setFormData({                         //Dentro de la función, se utiliza setFormData para actualizar la variable de estado de formData con los datos del usuario que provienen de session?.user.
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        password: session.user?.password || '',
        phone: session?.user?.phone || '',
        country: session?.user?.country || '',
        gender: session?.user?.gender || '',
        avatar: session?.user?.avatar || '',
      });
    }
  }, [session?.user]);

  const handleSaveChanges = async () => {
    setIsLoading(true)
    setShowSaveResult(false);
    try {
      // Hacemos la solicitud a la API para guardar los cambios en la base de datos con PUT, ya que POST es para "pegar", es decir cuando queremos insertar un nuevo registro.
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Verifica si la solicitud fue exitosa
      if (response.ok) {
        const updatedUserData = await response.json();  // Obtén los datos actualizados del usuario del backend
        setFormData(updatedUserData);                   // Actualiza la variable de estado de formData con los datos actualizados que vienen de la consulta a la API, almacenandose en updatedUserData.
        setVar1("Los cambios han sido guardados de manera correcta! Por favor, para que los cambios actualizados puedan observarse en su perfil, le recomendamos que inicie sesión nuevamente.");                // Mostramos el mensaje una vez que los datos se hayan guardado correctamente
        setShowSaveResult(true);
      } else {
        if (response.status == 404) {
          setVar1("Usuario no encontrado");
          setShowSaveResult(true);
        }
      }
    } catch (error) {
      // ... res.status etc...
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader sx={{ textAlign: 'center', marginBottom: '-1%' }} title={` ${session?.user?.name}`} />
          <form >
            <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled sx={{ margin: '0 auto' }} src={formData.avatar} alt='Profile Pic' />
                  {/* <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Subir foto
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/png, image/jpeg'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                      />
                      </ButtonStyled>
                      <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                      Volver al estado inicial
                      </ResetButtonStyled>
                      <Typography sx={{ mt: 5, color: 'text.disabled' }}>Formato PNG o JPEG. Tamaño máximo de 800K.</Typography>
                    </div> */}
                </Box>
                <CustomChip
                  skin='light'
                  size='small'

                  label={session?.user.role}

                  color={statusColors[data.status]}
                  sx={{
                    alignItems: 'center',
                    marginTop: '8px',
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { mt: -0.25 }
                  }}
                />
              </Box>
              <Box >
                <Button variant='contained' onClick={() => setOpen(true)}>
                  CAMBIAR FOTO
                </Button>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Nombre'
                    placeholder='Facundo Tissera'
                    value={formData.name}
                    onChange={e => handleFormChange('name', e.target.value)}
                  />


                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='email'
                    label='Email'
                    value={formData.email}
                    disabled={true}
                    placeholder='facutissera@example.com'
                    onChange={e => handleFormChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'} // Usa el estado showPassword para mostrar u ocultar la contraseña
                    label='Contraseña'
                    value={formData.password}
                    onChange={e => handleFormChange('password', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)} // Actualiza el estado showPassword al hacer clic en el botón
                            onMouseDown={e => e.preventDefault()}
                            edge='end'
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Teléfono'
                    value={formData.phone}
                    placeholder='3513452255'
                    onChange={e => handleFormChange('phone', e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'>ARG (+54)</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>País</InputLabel>
                    <Select
                      label='País'
                      value={formData.country}
                      onChange={e => handleFormChange('country', e.target.value)}
                    >
                      <MenuItem value='Argentina'>Argentina</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Género</InputLabel>
                    <Select
                      label='Genero'
                      value={formData.gender}
                      onChange={e => handleFormChange('gender', e.target.value)}
                    >
                      <MenuItem value='Femenino'>Femenino</MenuItem>
                      <MenuItem value='Masculino'>Masculino</MenuItem>
                      <MenuItem value='Otro'>Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12}>
                  <Button variant='contained' sx={{ mr: 3, mb: 5 }} onClick={handleSaveChanges}>
                    {isLoading ? (
                      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CircularProgress size={18} thickness={3} color="secondary" />
                      </Box>
                    ) : (<Typography>Guardar Cambios</Typography>)}
                  </Button>
                  <Button sx={{ mb: 5 }} type='reset' variant='outlined' color='secondary' onClick={() => setFormData(initialData)}>
                    Reestablecer
                  </Button>
                  {showSaveResult && (
                    <Typography >
                      {var1}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </form>

        </Card>
      </Grid >

      {/* Delete Account Card */}
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title='Eliminar cuenta' />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name='checkbox'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label='Soy consciente de que quiero borrar la cuenta'
                        sx={errors.checkbox ? { '& .MuiTypography-root': { color: 'error.main' } } : null}
                        control={
                          <Checkbox
                            {...field}
                            size='small'
                            name='validation-basic-checkbox'
                            sx={errors.checkbox ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-checkbox'>
                      Por favor, confirme de que quiere eliminar la cuenta.
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button variant='contained' color='error' type='submit' disabled={errors.checkbox !== undefined}>
                Eliminar
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid> */}

      {/* Deactivate Account Dialogs */}
      <Dialog sx={{ alignItems: 'center', '& .MuiPaper-root': { width: '100%', maxWidth: 715 } }} open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box sx={{ display: { md: 'flex' }, flexWrap: 'wrap' }} alignItems={'center'}>
            {avatars.map((avatar, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', flexDirection: 'column', padding: 1, alignItems: 'center' }}
              >
                <ImgStyled src={avatar} alt='Profile Pic' />
                <Checkbox
                  checked={selectedCheckbox === index}
                  onChange={() => handleCheckboxChange(index, avatar)}
                />
              </Box>
            ))}
          </Box>
          {/* <Box sx={{ display: { md: 'flex' } }} alignItems={'center'}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {avatars.slice(0, 4).map((avatar, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexDirection: 'column', padding: 1, alignItems: 'center' }}
                >
                  <ImgStyled src={avatar} alt='Profile Pic' />
                  <Checkbox
                    checked={selectedCheckbox === index}
                    onChange={() => handleCheckboxChange(index, avatar)}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {avatars.slice(4, 8).map((avatar, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', flexDirection: 'column', padding: 1, alignItems: 'center' }}
                >
                  <ImgStyled src={avatar} alt='Profile Pic' />
                  <Checkbox
                    checked={selectedCheckbox === index + 4} // Ajusta el índice para la segunda fila
                    onChange={() => handleCheckboxChange(index + 4, avatar)} // Ajusta el índice para la segunda fila
                  />
                </Box>
              ))}
            </Box>
          </Box> */}
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
          <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
          <Typography>Está seguro de eliminar su cuenta?</Typography>
        </Box> */}
          <Box display={'flex'}>
            <Icon icon={'mdi:alert-circle-outline'}> </Icon>
            <Typography sx={{ ml: 1 }}> Guarde los cambios para cambiar su foto de perfil</Typography>
          </Box>

        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleClose()}>
            Confirmar
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
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
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Cuenta Eliminada' : 'Cancelada'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Tu cuenta se ha eliminado correctamente.' : 'Eliminación de cuenta cancelada.'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog> */}

    </Grid>
  )
}

AlumnoProfile.acl = {
  action: 'manage',
  subject: 'perfilAlumno'
}


export default AlumnoProfile
