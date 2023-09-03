// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import Fab from '@mui/material/Typography'

// import useMediaQuery from '@mui/material/useMediaQuery'
// import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// import { Theme } from '@mui/material/styles'

//import Router, { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

import { userAgent } from 'next/server'
import { redirect } from 'next/dist/server/api-utils'

//import axios from 'axios'

interface ColorsType {
  [key: string]: ThemeColor
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
  avatar: '/images/avatars/4.png',
  name: '',
  phone: 0,
  gender: '',
  discipline: ''
}

// const roleColors: ColorsType | string = {
//   admin: 'error',
//   editor: 'info',
//   author: 'warning',
//   maintainer: 'success',
//   subscriber: 'primary'
// }

const statusColors: ColorsType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

// interface Props {
//   plan: string
//   handleChange: (e: ChangeEvent<{ checked: boolean }>) => void
// }

const MyProfile = () => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)

  // ** Props
  // const { plan, handleChange } = props

  // // ** Hook
  // const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  // const storedSelectedUser = localStorage.getItem('selectedUser');
  // const selectedUser = storedSelectedUser ? JSON.parse(storedSelectedUser) : {};
  const route = useRouter();
  const [users, setUsers] = useState<UsersType>([]);   //Users es un array del tipo UsersType[]. Podria tambien solamente ser del tipo []

  useEffect(() => {
    const fetchProfile = async () => {
      const id = route.query.id       //Funcion asincrona que hace la llamada a la API de students.
      try {
        // ** Login API Call to match the user credentials and receive user data in response along with his role
        const res = await fetch('/api/myProfile/?id=' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        if (res.status == 200) {
          const user = await res.json()
          setUsers(user)                              //Cargamos users con la data que viene de la solicitud a la API.
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

    fetchProfile();                                 //Se llama a la función fetchAlumnoUsers dentro de useEffect. Esto asegura que la llamada a la API se realice solo una vez
  }, []);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true)
  const handlePlansClose = () => setOpenPlans(false)


  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.fullName)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 2 }}>
                {users.name}
              </Typography>

              <CustomChip
                skin='light'
                size='small'

                label={users.discipline}

                color={statusColors[data.status]}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>

            {/* <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3 }}>
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      1.23k
                    </Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3 }}>
                    <Icon icon='mdi:briefcase-variant-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      568
                    </Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent> */}

            <CardContent>
              <Typography variant='h6'>Información del profesional</Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Nombre Completo:
                  </Typography>
                  <Typography variant='body2'>{users.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Email de contacto :
                  </Typography>
                  <Typography variant='body2'>{users.email}</Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Status:
                  </Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={data.status}
                    color={statusColors[data.status]}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      borderRadius: '5px',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box> */}
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Disciplina:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {users.discipline}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Teléfono:</Typography>
                  <Typography variant='body2'>{users.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Género:</Typography>
                  <Typography variant='body2'>{users.gender}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>País:</Typography>
                  <Typography variant='body2'>{users.country}</Typography>
                </Box>
              </Box>
            </CardContent>

            {/* <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button>
            </CardActions> */}

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Edit User Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Full Name' defaultValue={data.fullName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Username'
                        defaultValue={data.username}
                        InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* <TextField fullWidth type='email' label='Billing Email' defaultValue={selectedUser.email} /> */}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-status-label'>Status</InputLabel>
                        <Select
                          label='Status'
                          defaultValue={data.status}
                          id='user-view-status'
                          labelId='user-view-status-label'
                        >
                          <MenuItem value='pending'>Pending</MenuItem>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Contact' defaultValue={`+1 ${data.contact}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-language-label'>Language</InputLabel>
                        <Select
                          label='Language'
                          defaultValue='English'
                          id='user-view-language'
                          labelId='user-view-language-label'
                        >
                          <MenuItem value='English'>English</MenuItem>
                          <MenuItem value='Spanish'>Spanish</MenuItem>
                          <MenuItem value='Portuguese'>Portuguese</MenuItem>
                          <MenuItem value='Russian'>Russian</MenuItem>
                          <MenuItem value='French'>French</MenuItem>
                          <MenuItem value='German'>German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-country-label'>Country</InputLabel>
                        <Select
                          label='Country'
                          defaultValue='USA'
                          id='user-view-country'
                          labelId='user-view-country-label'
                        >
                          <MenuItem value='USA'>USA</MenuItem>
                          <MenuItem value='UK'>UK</MenuItem>
                          <MenuItem value='Spain'>Spain</MenuItem>
                          <MenuItem value='Russia'>Russia</MenuItem>
                          <MenuItem value='France'>France</MenuItem>
                          <MenuItem value='Germany'>Germany</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {/* <Box sx={{ mb: [10, 17.5], textAlign: 'center' }}>
            <Typography variant='h4'>Pricing Plans</Typography>
            <Box sx={{ mt: 2.5, mb: 10.75 }}>
              <Typography variant='body2'>
                All plans include 40+ advanced tools and features to boost your product.
              </Typography>
              <Typography variant='body2'>Choose the best plan to fit your needs.</Typography>
            </Box>
            <Box sx={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <InputLabel
                htmlFor='pricing-switch'
                sx={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                Monthly
              </InputLabel>
              <Switch color='secondary' id='pricing-switch' onChange={handleChange} checked={plan === 'annually'} />
              <InputLabel htmlFor='pricing-switch' sx={{ fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                Annually
              </InputLabel>

              <Box
                sx={{
                  top: -30,
                  left: '50%',
                  display: 'flex',
                  position: 'absolute',
                  transform: 'translateX(35%)',
                  '& svg': { mt: 2, mr: 1, color: 'text.disabled' }
                }}
              >
                <Icon icon='mdi:arrow-down-left' />
                <CustomChip size='small' skin='light' color='primary' label='Save up to 10%' />
                </Box>

                </Box>
              </Box> */}
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 'none', border: theme => `2px solid ${theme.palette.primary.main}` }}>
              <CardContent
                sx={{ flexWrap: 'wrap', pb: '0 !important', justifyContent: 'space-between' }}
              >
                {/* <CustomChip
                  skin='light'
                  size='small'
                  color='primary'
                  label='Standard'
                  sx={{ fontSize: '0.75rem', borderRadius: '4px' }}
                /> */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h5' sx={{ mb: 1.5 }}>
                    Estandar
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='body2' sx={{ mt: 1.6, fontWeight: 600, alignSelf: 'flex-start' }}>
                      $
                    </Typography>
                    <Typography variant='h3' sx={{ fontWeight: 600, color: 'primary.main', lineHeight: 1.17 }}>
                      99
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1.6, fontWeight: 600, alignSelf: 'flex-end' }}>
                      /month
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardContent>
                <Box sx={{ mt: 4, mb: 5 }}>
                  <Box
                    sx={{ display: 'flex', mb: 2.5, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                  >
                    <Icon icon='mdi:circle' fontSize='0.625rem' />
                    <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                      10 Users
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2.5,
                      display: 'flex',
                      mb: 2.5,
                      alignItems: 'center',
                      '& svg': { mr: 2, color: 'text.secondary' }
                    }}
                  >
                    <Icon icon='mdi:circle' fontSize='0.625rem' />
                    <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                      Up to 10GB storage
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2.5,
                      display: 'flex',
                      mb: 2.5,
                      alignItems: 'center',
                      '& svg': { mr: 2, color: 'text.secondary' }
                    }}
                  >
                    <Icon icon='mdi:circle' fontSize='0.625rem' />
                    <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                      Basic Support
                    </Typography>
                  </Box>
                </Box>
                {/* <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Days
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    26 of 30 Days
                  </Typography>
                </Box> */}
                {/* <LinearProgress value={86.66} variant='determinate' sx={{ height: 8, borderRadius: '5px' }} />
                <Typography variant='caption' sx={{ mt: 1.5, mb: 6 }}>
                  4 days remaining
                </Typography> */}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant='contained' sx={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, minWidth: 'auto' }} onClick={handlePlansClickOpen}>
                    {/* <Fab color='secondary' aria-label='edit'> */}
                    <Icon icon='mdi:pencil' />
                    {/* </Fab> */}
                  </Button>
                </Box>

              </CardContent>

              <Dialog
                open={openPlans}
                onClose={handlePlansClose}
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
                  Editar suscripción
                </DialogTitle>

                {/* <DialogContent
                  sx={{ px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`] }}
                >
                  <DialogContentText variant='body2' sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                    Choose the best plan for the user.
                  </DialogContentText>
                </DialogContent> */}

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


                  {/* <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}> */}

                  <form noValidate autoComplete='off' >
                    {/* Nombre */}
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      {/* <Controller */}

                      {/* rules={{ required: true }} */}
                      {/* render={({ field: { value, onChange, onBlur } }) => ( */}
                      <TextField
                        autoFocus
                        label='Nombre'
                        name='name'
                        inputProps={{ maxLength: 50 }}
                      />

                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      {/* <Controller */}

                      {/* rules={{ required: true }} */}
                      {/* render={({ field: { value, onChange, onBlur } }) => ( */}
                      <TextField
                        autoFocus
                        label='Precio'
                        name='amount'
                        inputProps={{ maxLength: 50 }}
                      />

                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      {/* <Controller */}

                      {/* rules={{ required: true }} */}
                      {/* render={({ field: { value, onChange, onBlur } }) => ( */}
                      <TextField rows={4} multiline label='Descripcion' id='textarea-outlined-static' />

                    </FormControl>


                    <Button
                      color='success'
                      sx={{
                        ml: '82%'
                      }}
                      variant='outlined'
                      onClick={() => setSubscriptionDialogOpen(true)}
                    >
                      Editar
                    </Button>

                    {/* </FormControl> */}

                    {/* <Button variant='contained' sx={{ minWidth: ['100%', 0] }}>
                    Upgrade
                  </Button> */}
                  </form>
                </DialogContent>
                {/*
                <Divider sx={{ m: '0 !important' }} /> */}

                {/* <DialogContent
                  sx={{
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: ['wrap', 'nowrap'],
                      justifyContent: 'space-between'
                    }}
                  >
                    <Button
                      color='error'
                      sx={{ mt: 2 }}
                      variant='outlined'
                      onClick={() => setSubscriptionDialogOpen(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </Box>
                </DialogContent> */}
              </Dialog>
            </Card>
          </Grid>
        </Grid>
      </Grid >
    )
  } else {
    return null
  }
}


MyProfile.acl = {
  action: 'manage',
  subject: 'myProfile-page'
}


export default MyProfile
