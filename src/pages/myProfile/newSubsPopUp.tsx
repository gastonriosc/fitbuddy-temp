// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputLabel, MenuItem, Select } from '@mui/material'

type Props = {
  addSubscription: boolean
  setAddSubscription: (val: boolean) => void
  subs: any
  setSubs: (val: any) => void

}

const NewSubsPopUp = (props: Props) => {

  interface FormData {
    _id: number | string
    name: string
    amount: number
    description: string
    daysPerWeek: number
    intensity: string
    following: string
  }

  const { setSubs } = props;
  const schema = yup.object().shape({
    name: yup.string().required("Nombre es un campo obligatorio").max(20, "Debe tener 20 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
    amount: yup.number().integer("El precio no puede contener números decimales").required("Precio es un campo obligatorio").min(0, "El precio no puede ser negativo"),
    description: yup.string().required("Descripción es un campo obligatorio").max(300, "Debe tener 300 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
    daysPerWeek: yup.number().integer("La cantidad de días no puede contener decimales").required("Es obligatorio completar la cantidad de días a entrenar por semana").min(1, "La cantidad de días debe ser mayor o igual a 1").max(7, "La cantidad de días debe ser menor o igual a 7"),
    intensity: yup.string().required("Intensidad es un campo obligatorio"),
    following: yup.string().required("Seguimiento es un campo obligatorio")
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      amount: undefined,
      description: '',
      daysPerWeek: undefined,
      intensity: '',
      following: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const route = useRouter();

  //*props
  const { addSubscription, setAddSubscription } = props

  //*state
  const [titlePopUp, setTitlePopUp] = useState<string>()

  // const [textPopUp, setTextPopUp] = useState<string>('Refresque la pagina para ver los cambios')
  const [popUp, setPopUp] = useState<boolean>(false)

  const handleAddSubscriptionClose = () => setAddSubscription(false)
  const closePopUp = () => setPopUp(false)

  const [followingMessage, setFollowingMessage] = useState<string>('');

  const handleFollowingChange = (selectedValue: string) => {
    if (selectedValue === 'alto') {
      setFollowingMessage('Seguimiento alto equivale entre 6-8 hs por semana.');
    } else if (selectedValue === 'intermedio') {
      setFollowingMessage('Seguimiento intermedio equivale entre 4-6 horas por semana.');
    } else if (selectedValue === 'bajo') {
      setFollowingMessage('Seguimiento bajo equivale entre 2-4 horas por semana.');
    }
    else {
      setFollowingMessage('');
    }
  };

  const createSubscription: SubmitHandler<FieldValues> = async (data) => {
    const trainerId = route.query.id
    const deleted = false;
    const { name, amount, description, daysPerWeek, intensity, following } = data;
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, amount, description, trainerId, daysPerWeek, intensity, following, deleted })
      })
      if (res.status == 200) {
        handleAddSubscriptionClose();
        setTitlePopUp('Suscripción creada!')
        setPopUp(true)
        const data = await res.json();
        const newSubs = data
        setSubs((prevSubs: any) => [...prevSubs, newSubs]);
      }
      else {
        if (res.status == 409) {
          console.log('error 409')
        }
        if (res.status == 400) {
          console.log('error 400')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog
        open={addSubscription}
        onClose={handleAddSubscriptionClose}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id='user-view-plans'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          Agregar suscripción
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: ['wrap', 'nowrap'],
            pt: theme => `${theme.spacing(2)} !important`,
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <form noValidate autoComplete='off' onSubmit={handleSubmit(createSubscription)}>

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
              <Controller
                name='amount'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Precio'
                    name='amount'
                    type='number'
                    value={value}
                    onBlur={onBlur}
                    error={Boolean(errors.amount)}
                    onChange={(e) => {
                      onChange(e.target.value === '' ? undefined : e.target.value);
                    }}
                  />
                )}
              />
              {errors.amount && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.amount.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='daysPerWeek'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label='Dias por semana'
                    name='daysPerWeek'
                    type='number'
                    value={value}
                    onBlur={onBlur}
                    error={Boolean(errors.daysPerWeek)}
                    onChange={(e) => {
                      onChange(e.target.value === '' ? undefined : e.target.value);
                    }}
                  />
                )}
              />
              {errors.daysPerWeek && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.daysPerWeek.message}
                </FormHelperText>
              )}
            </FormControl>

            {/* Intensidad */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='intensity'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <InputLabel>Intensidad </InputLabel>
                    <Select
                      label='Intensidad'
                      name='intensity'
                      type='string'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.intensity)}
                    >
                      {/* Opciones de MenuItem */}
                      <MenuItem value='baja'>Baja</MenuItem>
                      <MenuItem value='media'>Media</MenuItem>
                      <MenuItem value='alta'>Alta</MenuItem>

                    </Select>
                  </>
                )}
              />
              {errors.intensity && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.intensity.message}
                </FormHelperText>
              )}
            </FormControl>

            {/* Seguimiento */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='following'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <InputLabel>Seguimiento</InputLabel>
                    <Select
                      label='Seguimiento'
                      name='following'
                      type='string'
                      value={value}
                      onBlur={onBlur}
                      onChange={(e) => {
                        onChange(e);
                        handleFollowingChange(e.target.value);
                      }}
                      error={Boolean(errors.following)}
                    >
                      {/* Opciones de MenuItem */}
                      <MenuItem value='bajo'>Bajo</MenuItem>
                      <MenuItem value='intermedio'>Intermedio</MenuItem>
                      <MenuItem value='alto'>Alto</MenuItem>
                    </Select>
                  </>
                )}
              />
              {errors.following && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.following.message}
                </FormHelperText>
              )}
            </FormControl>

            <div style={{ fontSize: 'small', marginTop: '-5px', marginBottom: '15px' }}>
              {followingMessage && (
                <>
                  <Icon icon='mdi:info' style={{ fontSize: '16px', marginRight: '4px' }}></Icon>
                  {followingMessage}
                </>
              )}
            </div>



            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    rows={6}
                    multiline
                    id='textarea-outlined-static'
                    label='Descripción'
                    name='description'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.description)}
                  />
                )}
              />
              {errors.description && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.description.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color='success' variant='outlined' type='submit'>
                Agregar
              </Button>
            </Box>
          </form>
        </DialogContent>

      </Dialog>
      <Dialog fullWidth open={popUp} onClose={closePopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              '& svg': { mb: 6, color: 'success.main' }
            }}
          >
            <Icon icon='mdi:check-circle-outline' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUp}</Typography>
            {/* <Typography>{textPopUp}</Typography> */}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >

          <Button variant='outlined' color='success' onClick={closePopUp}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewSubsPopUp
