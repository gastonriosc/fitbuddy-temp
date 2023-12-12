/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Controller, useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import ChartRegistroPesos from './charts/chartRegistroPesos'

// ** MUI Imports
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

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
import { format, addDays, addYears } from 'date-fns';
import TrackingPopUp from '../plans/tracking/trackingPopUp'
import CircularProgress from '@mui/material/CircularProgress';

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
import ChartEntrenamientosSemanales from './charts/chartEntrenamientosSem'
import CustomInput from '../../views/forms/form-elements/pickers/PickersCustomInput'

interface StudentInsightItem {
  _id: string;
  date: Date;
  weight: number;
  deleted: boolean;
}

interface StudentInsight {
  _id: string;
  studentId: string;
  data: StudentInsightItem[];
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
      weight: undefined,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [isDuplicateDate, setIsDuplicateDate] = useState(false);
  const [insights, setInsights] = useState<string[]>([])
  const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>('')
  const [dataPeso, setDataPeso] = useState<StudentInsight | any>()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userPeso, setUserPeso] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openDeleteRegistro, setOpenDeleteRegistro] = useState<boolean>(false)
  const [registroABorrar, setRegistroABorrar] = useState<StudentInsightItem>()
  const itemsPerPage = 5;
  const totalPages = Math.ceil(dataPeso?.data.length / itemsPerPage);
  const currentEndDate = new Date();
  currentEndDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 0);
  const [startDate, setStartDate] = useState<DateType>(addDays(currentEndDate, -30))
  const [endDate, setEndDate] = useState<DateType>(currentDate)


  const handleOnChangeDates = (dates: any) => {
    const [start, end] = dates
    setStartDate(start);
    setEndDate(end);
    console.log('modificado:', startDate, endDate)

  };



  console.log('fechas: ', startDate, endDate)
  const transformarDatosAFormatoSeries = (datos: StudentInsight, startDate: DateType, endDate: DateType) => {
    const seriesTransformadas = {
      data: datos?.data
        .map(item => ({
          weight: item.weight,
          date: new Date(item.date), // Mantener la fecha como objeto
        }))
        .filter(item => item.date >= startDate && item.date <= endDate?.setHours(23, 59, 59, 0))
        .sort((a, b) => a.date.getTime() - b.date.getTime()) // Ordenar directamente por fecha
        .map(item => ({
          weight: item.weight,
          date: formatDate(item.date),
        })),
    };

    return seriesTransformadas;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  const series = transformarDatosAFormatoSeries(dataPeso, startDate, endDate);

  const route = useRouter()

  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }

  const borrarRegistroPeso = (registroId: StudentInsightItem) => {
    setRegistroABorrar(registroId)
    setOpenDeleteRegistro(true)
  }

  const hadleCloseDeleteRegistroPopUp = () => {
    setOpenDeleteRegistro(false)
  }

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
          setDataPeso(data.dataPeso)
          setInsights(data.dataTracking)
          setUserPeso(data.userPeso.weight)
          setIsLoading(true)
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
  }, []);


  const createRegistro: SubmitHandler<FieldValues> = async (data) => {
    const studentId = route.query.id
    const { date, weight } = data;
    let requestBody;


    if (openDeleteRegistro) {
      requestBody = {
        id: studentId,
        data: {
          id: registroABorrar?._id,
          date: registroABorrar?.date,
          weight: registroABorrar?.weight,
          deleted: true
        },
      };
    } else {
      const isDuplicate = dataPeso?.data.some((item: any) => {
        return formatDate(new Date(item.date)) === formatDate(date);
      });

      if (isDuplicate) {
        setIsDuplicateDate(true);

        return;
      } else {
        setIsDuplicateDate(false);
      }
      requestBody = {
        id: studentId,
        data: {
          date: date,
          weight: weight,
          deleted: false
        },
      };
    }
    try {
      const res = await fetch('/api/studentInsights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      if (res.status == 200) {
        const data = await res.json();
        const registroR = data;
        console.log('registro', registroR);


        if (openDeleteRegistro) {
          setTitlePopUp('Peso borrado con éxito!');
          setDataPeso(registroR)
          hadleCloseDeleteRegistroPopUp();

        } else {
          handlePopUpNuevoRegistro()
          setTitlePopUp('Peso registrado con éxito!');
          setDataPeso(registroR)

        }
        setTrackingPopUp(true)


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



  if (isLoading) {
    return (
      <Grid >
        <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
          <Box ml={5} >
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>Métricas </h2>
            {/* <p>Su peso al registrarse en FitBuddy fue de {userPeso}</p> */}
          </Box>
          {/* <Box sx={{ mx: 4, my: 4, justifyContent: 'right' }} >
          <Icon icon='mdi:plus' onClick={() => setNuevoRegistro(true)} />
        </Box> */}

          <Button sx={{ mx: 4, my: 4 }} variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setNuevoRegistro(true)}>
            Registro
          </Button>


        </Card>
        <Box sx={{}}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column', lg: 'row' } }}>
            <Box sx={{ width: { xs: '100%', md: '100%', lg: '75%' }, padding: 1, mt: 4 }}>
              <ChartRegistroPesos direction='ltr' data={series.data} dataPeso={userPeso} startDate={startDate} endDate={endDate} handleOnChangeDates={handleOnChangeDates}></ChartRegistroPesos>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '100%', lg: '25%' }, padding: 1, mt: 4, height: '463px' }}>
              <Card sx={{ height: '463px' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>

                        <TableCell style={{ textAlign: 'center' }}>Fecha</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Peso</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataPeso?.data ? (
                        dataPeso.data
                          .sort((a: any, b: any) => new Date(b.date) - new Date(a.date))
                          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                          .map((dataPesoItem: StudentInsightItem) => (
                            <TableRow key={dataPesoItem._id}>
                              <TableCell style={{ textAlign: 'center' }}>
                                {dataPesoItem.date && new Date(dataPesoItem.date).toLocaleDateString('es')}
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {dataPesoItem.weight} kg
                              </TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <Icon icon='mdi:delete' onClick={() => borrarRegistroPeso(dataPesoItem)} />
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
                <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
                  <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
                </Box>

              </Card>
            </Box >
          </Box>
          <Box sx={{ mt: 5 }}>
            <ChartEntrenamientosSemanales insights={insights}></ChartEntrenamientosSemanales>
          </Box >
          {/* <Box>
            <ChartNuevo primary={primaryColor}
              labelColor={labelColor}
              green={scatterChartGreen}
              borderColor={borderColor}
              legendColor={legendColor}
              warning={scatterChartWarning}></ChartNuevo>
          </Box> */}
        </Box >


        <Dialog
          open={nuevoRegistro}
          onClose={handlePopUpNuevoRegistro}
          aria-labelledby='user-view-plans'
          aria-describedby='user-view-plans-description'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 660, height: '560px' } }}

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

          <Box sx={{ justifyContent: 'center', justifyItems: 'center', alignContent: 'center', marginTop: '30px', alignItems: 'center' }}>



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
                        error={Boolean(errors.weight)}
                        onChange={(e) => {
                          onChange(e.target.value === '' ? undefined : e.target.value);
                        }}
                      />
                    )}
                  />
                  {errors.weight && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.weight.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mr: 5, mb: 10, mt: 5 }}>
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
              <Typography sx={{ textAlign: 'center', color: 'error.main', fontSize: '12px' }}  >
                Esta fecha ya está registrada. Por favor, seleccione otra en la que no haya registros de entrenamiento.
              </Typography>
            )}

          </Box>
        </Dialog>
        <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>


        <Dialog fullWidth open={openDeleteRegistro} onClose={hadleCloseDeleteRegistroPopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
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
              <Icon icon='line-md:alert' fontSize='5.5rem' />
              <Typography variant='h5' sx={{ mb: 5 }}>¿Seguro que deseas borrar el registro?</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' sx={{ mr: 2 }} onClick={createRegistro}>
              Confirmar
            </Button>
            <Button variant='outlined' color='secondary' onClick={hadleCloseDeleteRegistroPopUp} >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid >
    )
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
};


StudentInsight.acl = {
  action: 'manage',
  subject: 'studentInsights-page'
}


export default StudentInsight
