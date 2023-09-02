
// ** MUI Imports
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ChangeEvent, ElementType, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useSession } from 'next-auth/react'
import { CircularProgress, IconButton } from '@mui/material'

interface Data {
  email: string
  country: string
  gender: string
  name: string
  password: string
  phone: number | string
}

const initialData: Data = {
  password: '',
  name: '',
  gender: '',
  country: '',
  email: '',
  phone: ''
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))


const AlumnoProfile = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData);
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSaveResult, setShowSaveResult] = useState(false);
  const [var1, setVar1] = useState("");

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  //field: Es el nombre del campo que se va a actualizar. Es de tipo keyof Data, lo que significa que solo se puede pasar el nombre de una propiedad válida del tipo Data.
  //value: Es el valor que se va a asignar al campo especificado por field. El tipo del valor depende del tipo de datos que tenga la propiedad en el objeto Data.
  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const onSubmit = () => setOpen(true)

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }

  useEffect(() => {
    if (session?.user) {                    //Si session?.user existe y tiene un valor, el useEffect ejecuta la función dentro de él.
      setFormData({                         //Dentro de la función, se utiliza setFormData para actualizar la variable de estado de formData con los datos del usuario que provienen de session?.user.
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        password: session.user?.password || '',
        phone: session?.user?.phone || '',
        country: session?.user?.country || '',
        gender: session?.user?.gender || '',
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
          <CardHeader title={`Alumno: ${session?.user?.name}`} />
          <form >
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div>
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
                </div>
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
      <Grid item xs={12}>
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
      </Grid>

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
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
            <Typography>Está seguro de eliminar su cuenta?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Sí
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
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
      </Dialog>

    </Grid>
  )
}

AlumnoProfile.acl = {
  action: 'manage',
  subject: 'perfilAlumno'
}


export default AlumnoProfile
