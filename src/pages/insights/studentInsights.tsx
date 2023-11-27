// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Controller, useForm, SubmitHandler, FieldValues } from 'react-hook-form'

// ** MUI Imports
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { format, addDays, startOfWeek, isToday } from 'date-fns';
import TrackingPopUp from '../plans/tracking/trackingPopUp'

// import { CardHeader } from '@mui/material'

import Dialog from '@mui/material/Dialog'

// import FormHelperText from '@mui/material/FormHelperText'
// import DialogActions from '@mui/material/DialogActions'
// import CircularProgress from '@mui/material/CircularProgress'
// import Divider from '@mui/material/Divider'

// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// import CardContent from '@mui/material/CardContent'

import DialogTitle from '@mui/material/DialogTitle'

// import FormControl from '@mui/material/FormControl'
// import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ChartEntrenamientosSemanales from './chartEntrenamientosSem'
import CustomInput from '../../views/forms/form-elements/pickers/PickersCustomInput'

interface StudentInsight {
  _id: string,
  studentId: string,
  data: {
    _id: string
    date: Date,
    weight: number
    deleted: boolean
  }[]
}
interface FormData {
  date: Date
  weight: number
}

const schema = yup.object().shape({
  weight: yup.number().required("El peso es un campo obligatorio").max(400, "Maximo 400kg").min(1, "Minimo 1kg")
})

const StudentInsight = () => {
  const today = new Date();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: today,
      weight: 1,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [date, setDate] = useState<DateType>(new Date())
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isDuplicateDate, setIsDuplicateDate] = useState(false);
  const [insights, setInsights] = useState<string[]>([])
  const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>('')
  const [dataPeso, setDataPeso] = useState<StudentInsight | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(1);



  const itemsPerPage = 6;
  if (dataPeso) {
    console.log('dataPeso:', dataPeso);  // Verifica la estructura completa de dataPeso

    if (dataPeso.data) {
      console.log('dataPeso.data:', dataPeso.data);  // Debería imprimir el array data
      const totalPages = Math.ceil(dataPeso.data.length / itemsPerPage) || 0;
      console.log(totalPages);
    } else {
      console.error("dataPeso.data es undefined o null");
    }
  } else {
    console.error("dataPeso es undefined o null");
  }

  const route = useRouter()

  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }

  const handleOnChangeRangeForDialog = (date: any) => {
    setStartDateRange(date);
  };

  useEffect(() => {
    const fetchMyTracking = async () => {
      const id = route.query.id;
      try {
        const res = await fetch(
          `/api/studentInsights/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          console.log(data)
          setInsights(data.dataTracking)
          setDataPeso(data.dataPeso)
        }
        if (res.status == 404) {
          route.replace('/404');
        }
        if (res.status == 500) {
          route.replace('/500');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const createRegistro: SubmitHandler<FieldValues> = async (data) => {
    const studentId = route.query.id
    const { date, weight } = data;
    const requestBody = {
      id: studentId,
      data: {
        date: date,
        weight: weight,
        deleted: false
      },
    };
    console.log(requestBody)
    try {
      const res = await fetch('/api/studentInsights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      if (res.status == 200) {
        handlePopUpNuevoRegistro()
        setTrackingPopUp(true)
        setTitlePopUp('Peso registrado con éxito!')
        const data = await res.json();

      }
      if (res.status == 404) {
        route.replace('/404');
      }
      if (res.status == 500) {
        route.replace('/500');
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid >
      <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <Box ml={5}>
          <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>Métricas</h2>
        </Box>
        {/*
        <Button sx={{ mx: 4, my: 4 }} variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setNuevoRegistro(true)}>
          Registro
        </Button> */}

        <Box sx={{ mx: 4, my: 4 }} >

          <Icon icon='mdi:plus' onClick={() => setNuevoRegistro(true)} />
        </Box>

      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '80%' }, padding: 1, mt: 4, height: '485px' }}>
          <ChartEntrenamientosSemanales insights={insights}></ChartEntrenamientosSemanales>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '20%' }, padding: 1, mt: 4, height: '485px' }}>
          <Card sx={{ height: '485px' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'center' }}>Historial</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Peso</TableCell>
                    <Box sx={{ mx: 4, my: 4 }} >
                      <Icon icon='mdi:plus' onClick={() => setNuevoRegistro(true)} />
                    </Box>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataPeso?.data && dataPeso.data.length > 0 ? (
                    dataPeso.data
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((dataPesoItem: any) => (
                        <TableRow key={dataPesoItem._id}>
                          <TableCell style={{ textAlign: 'center' }}>
                            {dataPesoItem.date && new Date(dataPesoItem.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell style={{ justifyContent: 'center' }}>
                            {dataPesoItem.weight}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
            {/* <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
              <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
            </Box> */}

          </Card>
        </Box >
      </Box >
      <Box sx={{ mt: 5 }}>
        <ChartEntrenamientosSemanales insights={insights}></ChartEntrenamientosSemanales>
      </Box >


      <Dialog
        open={nuevoRegistro}
        onClose={handlePopUpNuevoRegistro}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 660, height: '500px' } }}

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
          Agregar un nuevo registro
        </DialogTitle>
        <Divider sx={{ my: '0 !important' }} />

        <Box sx={{ justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center' }}>



          {/* <Typography sx={{ textAlign: 'center', mb: 2 }}>
            Indique un día válido para el registro de entrenamiento.
            </Typography> */}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(createRegistro)}>

              <FormControl sx={{ mb: 4 }}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '255px' } }}>
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date) => field.onChange(date)}
                        onBlur={field.onBlur}
                        maxDate={addDays(new Date(), 0)}
                        placeholderText="Click to select a date"
                        customInput={
                          <CustomInput
                            label="Día de entrenamiento"
                          />
                        }
                        dateFormat="dd/MM/yyyy"
                        value={format(field.value, 'dd/MM/yyyy')}
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.date && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.date.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ mb: 4 }}>
                <Controller
                  name='weight'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label='Kg'
                      name='weight'
                      type='number'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.weight)}
                    />
                  )}
                />
                {errors.weight && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.weight.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'center', mr: 5, mb: 10, mt: 0 }}>
                <Button
                  variant='contained'
                  sx={{ '&:hover': { backgroundColor: 'success.main' } }}
                  type='submit'
                >
                  Aceptar
                </Button>

              </Box>
            </form>
          </Box>
          {isDuplicateDate && (
            <Typography sx={{ textAlign: 'center', mt: 3, color: 'error.main', fontSize: '12px' }}  >
              Esta fecha ya está registrada. Por favor, seleccione otra en la que no haya registros de entrenamiento.
            </Typography>
          )}
        </Box>
      </Dialog>
      <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>
    </Grid >
  )

};


StudentInsight.acl = {
  action: 'manage',
  subject: 'studentInsights-page'
}


export default StudentInsight
