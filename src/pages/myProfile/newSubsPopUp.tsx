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

type Props = {
  addSubscription: boolean
  setAddSubscription: (val: boolean) => void
}

const NewSubsPopUp = (props: Props) => {

  interface FormData {
    _id: number | string
    name: string
    amount: string
    description: string
  }

  const { subs, setSubs } = props;
  const schema = yup.object().shape({
    name: yup.string().required("Nombre es un campo obligatorio").max(20, "Debe tener 20 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
    amount: yup.string().required("Precio es un campo numérico y obligatorio"),
    description: yup.string().required("Descripción es un campo obligatorio").max(350, "Debe tener 350 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      amount: '',
      description: '',
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

  const createSubscription: SubmitHandler<FieldValues> = async (data) => {
    const trainerId = route.query.id
    const deleted = false;
    const { name, amount, description } = data;
    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, amount, description, trainerId, deleted })
      })
      if (res.status == 200) {
        handleAddSubscriptionClose();
        setTitlePopUp('Suscripción creada!')
        setPopUp(true)
        const newSubs = { name: name, amount: amount, description: description, trainerId: trainerId, deleted: deleted }
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
                    onChange={onChange}
                    error={Boolean(errors.amount)}
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
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    rows={6}
                    multiline
                    id='textarea-outlined-static'
                    label='Descripcion'
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
