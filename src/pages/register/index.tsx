// ** React Imports
import { ReactNode, forwardRef, useState } from 'react'


// ** Next Import
import Link from 'next/link'


// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import DatePicker from 'react-datepicker'


// ** Icon Imports
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { format } from 'date-fns'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
  [theme.breakpoints.up('lg')]: {
    width: '35rem'
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',

  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 800
  }
}))



type CountryTypes = 'Argentina'
type GenderTypes = 'Masculino' | 'Femenino' | 'Otro'
type RoleTypes = 'Alumno' | 'Entrenador'
type DisciplineTypes = 'Musculación'

interface FormData {
  name: string
  phone: string
  country: CountryTypes | ''
  gender: GenderTypes | ''
  role: RoleTypes | ''
  discipline: DisciplineTypes | ''
  email: string
  password: string
  passwordC: string
  height: string
  weight: string
  age: string
  birthdate: string
}

const defaultValues = {
  name: '',
  phone: '',
  country: undefined,
  gender: undefined,
  role: undefined,
  discipline: undefined,
  email: '',
  password: '',
  passwordC: '',
  height: '',
  weight: '',
  age: ''
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

const phoneRegExp = /^(\+?549?|0)(11|[2368]\d)(\d{4})(\d{4})$/;

const schema = yup.object().shape({
  name: yup.string().required("Nombre es un campo obligatorio"),
  phone: yup.string().required("Teléfono es un campo obligatorio").matches(phoneRegExp, 'No es un teléfono válido'),
  email: yup.string().email("Debe ser un email válido").required("Email es un campo obligatorio"),
  password: yup.string().required("Contraseña es un campo obligatorio").min(5, "Debe contener 5 caracteres mínimo"),
  passwordC: yup.string().required("Por favor repita la contraseña").oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  height: yup.number().required("Altura es un campo obligatorio").positive("La altura debe ser un valor positivo"),
  weight: yup.number().required("Peso es un campo obligatorio").positive("El peso debe ser un valor positivo"),
  age: yup.mixed().required('Edad es un campo obligatorio'),
  country: yup.string().required("Seleccione un pais"),
  gender: yup.string().required("Seleccione un genero"),
  role: yup.string().required("Seleccione un rol"),
})

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordC, setShowPasswordC] = useState<boolean>(false)
  const [showDiscipline, setShowDiscipline] = useState<boolean>(false)
  const [selectedDiscipline, setSelectedDiscipline] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [startDateRange, setStartDateRange] = useState<Date | null>(null);
  const [age, setAge] = useState<string>('');


  // ** Default Values
  const countries: CountryTypes[] = ['Argentina']
  const genders: GenderTypes[] = ['Masculino', 'Femenino', 'Otro']
  const roles: RoleTypes[] = ['Alumno', 'Entrenador']
  const disciplines: DisciplineTypes[] = ['Musculación']

  // ** Hooks
  const router = useRouter()


  // ** Events
  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCountry(event.target.value)
  }
  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    setSelectedGender(event.target.value)
  }
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value)
    setSelectedDiscipline('')
    setShowDiscipline(event.target.value === 'Entrenador')
  }
  const handleDisciplineChange = (event: SelectChangeEvent<string>) => {
    setSelectedDiscipline(event.target.value)
  }

  // ** React-Hook-Form
  const {
    control,
    setError,
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues,
    mode: 'onBlur', //onBlur hace que los errores se muestren cuando el campo pierde focus.
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // data = {email: 'juantargon@gmail.com', password: 'entrenador'}
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())
    const registrationDate = currentDate.toISOString();
    const { email, password, phone, country, gender, role, name, discipline, height, weight, age } = data
    let avatar = '';
    if (gender === 'Masculino') {
      avatar = '/images/animals/4.png'
    }
    else {
      avatar = '/images/animals/12.png'
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, phone, country, gender, role, name, discipline, avatar, height, weight, registrationDate, age })
      })
      if (res.status == 200) {
        await signIn('credentials', { email, password, redirect: false }).then(res => {
          if (res && res.ok) {
            router.replace('/myProfile/alumnoProfile')
          }
        })
      }
      else {
        if (res.status == 409) {
          setError('email', {
            type: 'manual',
            message: 'El email ya se encuentra registrado'
          })
        }
        if (res.status == 400) {
          setError('email', {
            type: 'manual',
            message: 'No se puedo registrar el usuario'
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const CustomInputForDialog = forwardRef((props: CustomInputProps, ref) => {
    const selectedDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : '';

    return (
      <TextField
        fullWidth
        inputRef={ref}
        {...props}
        label={props.label || ''}
        value={selectedDate}
      />
    );
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      const ageInMilliseconds = today.getTime() - birthDate.getTime();
      const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));

      setValue('age', ageInYears.toString()); // Utiliza setValue para actualizar el valor del campo 'age'
      setStartDateRange(date);
    }
  };


  return (
    <Box className='content-center'>
      <Card>
        <CardContent sx={{ pt: 15, pb: 6, px: 7 }}>
          <BoxWrapper>
            <Box
              sx={{
                mb: 8, alignItems: 'center', justifyContent: 'center', textAlign: 'center'
              }}>
              <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box
              sx={{
                mb: 5, alignItems: 'center', justifyContent: 'center', textAlign: 'center'
              }}>
              <Typography variant='body1'>
                Completá los campos y empezá a ser parte de nuestra comunidad! 😊
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>

              {/* Nombre */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Nombre'
                      name='name'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.name.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>


                <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '100%' } }}>
                  <DatePicker
                    name='age'
                    selected={startDateRange}
                    onChange={(date) => handleDateChange(date)}
                    customInput={
                      <CustomInputForDialog
                        start={startDateRange as Date}
                        label='Fecha de Nacimiento'
                        dates={[]}
                        end={0}
                      />
                    }
                    showYearDropdown
                    dateFormatCalendar="MMMM"

                    maxDate={new Date()}
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    showMonthDropdown
                  />
                </DatePickerWrapper>
              </FormControl>



              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='age'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      label='Edad'
                      value={value}
                      type='number'
                      name='edad'
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.age)}
                    />
                  )}
                />
                {errors.age && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.age.message}
                  </FormHelperText>
                )}
              </FormControl> */}


              {/* Teléfono */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Teléfono'
                      value={value}
                      name='phone'
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      placeholder='+54'
                    />
                  )}
                />
                {errors.phone && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.phone.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Box sx={{
                display: 'flex',
                gap: { xs: '1px', md: '1px', lg: '10px' },
                width: '100%',
                flexDirection: { xs: 'column', md: 'column', lg: 'row' }
              }}>
                {/* País */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel id="country-select-label">País</InputLabel>
                  <Controller
                    name='country'
                    control={control}
                    rules={{
                      validate: (value) => value !== ''
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Select {...register("country", { required: true })}
                        label="País"
                        name='country'
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => {
                          onChange(e);
                          handleCountryChange(e);
                        }}
                        error={Boolean(errors.country)}
                      >
                        {countries.map((country, index) => (
                          <MenuItem key={index} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.country.message}
                    </FormHelperText>
                  )}

                </FormControl>

                {/* Género */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel id="gender-select-label">Género</InputLabel>
                  <Controller
                    name='gender'
                    control={control}
                    rules={{
                      validate: (value) => value !== ''
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Select {...register("gender", { required: true })}
                        label="Genero"
                        name='gender'
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => {
                          onChange(e);
                          handleGenderChange(e);
                        }}
                        error={Boolean(errors.gender)}
                      >
                        {genders.map((gender, index) => (
                          <MenuItem key={index} value={gender}>
                            {gender}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.gender.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{
                display: 'flex',
                gap: { xs: '1px', md: '1px', lg: '10px' },
                width: '100%',
                flexDirection: { xs: 'column', md: 'column', lg: 'row' }
              }}>
                {/* Altura */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='height'
                    control={control}
                    rules={{
                      validate: (value) => value !== ''
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Altura'
                        value={value}
                        name='height'
                        type='number'

                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.height)}
                        placeholder='1.80'
                      />
                    )}
                  />
                  {errors.height && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.height.message}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Peso */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='weight'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Peso'
                        value={value}
                        type='number'
                        name='weight'
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.weight)}
                        placeholder='Kg'
                      />
                    )}
                  />
                  {errors.weight && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.weight.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: '5px' }}>

                {/* Role */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel id="role-select-label">Rol</InputLabel>
                  <Controller
                    name='role'
                    control={control}
                    rules={{
                      validate: (value) => value !== ''
                    }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <Select {...register("role", { required: true })}
                        label="Rol"
                        name='role'
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => {
                          onChange(e);
                          handleRoleChange(e);
                        }}
                        error={Boolean(errors.role)}
                      >
                        {roles.map((role, index) => (
                          <MenuItem key={index} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.role.message}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Disciplina */}
                {showDiscipline && (

                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="discipline-select-label">Disciplina</InputLabel>
                    <Select {...register("discipline")}
                      labelId='discipline-select-label'
                      id='discipline-select'
                      name='discipline'
                      value={selectedDiscipline}
                      label="Disciplina"
                      onChange={handleDisciplineChange}
                    >
                      {disciplines.map((discipline, index) => (
                        <MenuItem key={index} value={discipline}>
                          {discipline}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* Email */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      name='email'
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

              <Box sx={{
                display: 'flex',
                gap: { xs: '15px', md: '15px', lg: '10px' },
                width: '100%',
                flexDirection: { xs: 'column', md: 'column', lg: 'row' }
              }}>

                {/* Contraseña */}
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
                        name='password'
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

                {/* Repetir Contraseña */}
                <FormControl fullWidth>
                  <InputLabel htmlFor='passwordC' error={Boolean(errors.passwordC)}>
                    Confirme Contraseña
                  </InputLabel>
                  <Controller
                    name='passwordC'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        label='Confirme Contraseña'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id='passwordC'
                        error={Boolean(errors.passwordC)}
                        type={showPasswordC ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <Box sx={{ pr: 2 }}>
                              <IconButton
                                onClick={() => setShowPasswordC(!showPasswordC)}
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
                  {errors.passwordC && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.passwordC.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>

              {/* <FormControlLabel
                    control={<Checkbox />}
                    sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    label={
                      <>
                        <Typography variant='body2' component='span'>
                          Estoy de acuerdo con los{' '}
                        </Typography>
                        <LinkStyled href='/' onClick={e => e.preventDefault()}>
                          términos y condiciones
                        </LinkStyled>
                      </>
                    }
                  /> */}
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mt: 7, mb: 7 }}>
                Registrarme
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>¿Ya tienes una cuenta?</Typography>
                <Typography href='/login' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Iniciá sesión
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </CardContent>
      </Card>
    </Box >
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
