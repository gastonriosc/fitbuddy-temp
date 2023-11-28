// ** React Imports
import { forwardRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
// import NewSubsPopUp from './newSubsPopUp'
//import CardWorkoutMensual from './cardWorkouts'
import CardTrackingMensual from './cardTracking'
import TrackingPopUp from './trackingPopUp'
import CardTrackingDifficult from './cardTrackingDifficult'
import CardTrackingFatigue from './cardTrackingFatigue'

import format from 'date-fns/format'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'


// import { CardHeader } from '@mui/material'

import Dialog from '@mui/material/Dialog'


import Typography from '@mui/material/Typography'

import DialogTitle from '@mui/material/DialogTitle'



// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}


interface Tracking {
  _id: string,
  planId: string,
  data: {
    _id: string
    date: Date,
    number: number
    difficult: number,
    fatigue: number,
  }
  date: Date,
  expirationDate: any,
  some: any
}


const Tracking = () => {

  const session = useSession();
  const isTrainer = session.data?.user.role == 'Entrenador';

  const labels: { [index: string]: string } = {
    1: 'Malo',
    2: 'Bueno',
    3: 'Muy Bueno',
    4: 'Excelente',
  }
  const [hover, setHover] = useState<number>(-1)
  const [hoverDifficult, setHoverDifficult] = useState<number>(-1)
  const [hoverFatigue, setHoverFatigue] = useState<number>(-1)

  const [value, setValue] = useState<number | null | any>(2)
  const [valueDifficult, setValueDifficult] = useState<number | null | any>(2)
  const [valueFatigue, setValueFatigue] = useState<number | null | any>(2)

  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>('')
  const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
  const [tracking, setTracking] = useState<Tracking | any>()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const route = useRouter();
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isDuplicateDate, setIsDuplicateDate] = useState(false);

  const labelsDifficult: { [index: string]: string } = {
    1: 'Fácil',
    2: 'Moderado',
    3: 'Intenso',
    4: 'Muy intenso',
  }
  const labelsFatigue: { [index: string]: string } = {
    1: 'Poco',
    2: 'Moderado',
    3: 'Considerable',
    4: 'Extremo',
  }


  console.log('trackingInfo:', tracking)
  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }
  const itemsPerPage = 6;

  const totalPages = Math.ceil(tracking?.data.length / itemsPerPage);
  console.log(totalPages)

  useEffect(() => {
    const fetchMyTracking = async () => {
      const id = route.query.id;

      try {
        const res = await fetch(
          `/api/tracking/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          console.log('data:', data.expirationDate)
          setTracking(data)
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

  const newTrackingRecord = async () => {
    const id = route.query.id;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())

    const requestBody = {
      id: id,
      data: {
        date: startDateRange,
        number: value,
        difficult: valueDifficult,
        fatigue: valueFatigue,
      }
    };
    try {
      const res = await fetch('/api/tracking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 200) {
        const data = await res.json();
        setNuevoRegistro(false)
        setTracking(data)
        setTitlePopUp('Seguimiento registrado con éxito!')
        setTrackingPopUp(true)
      } else {
        setNuevoRegistro(false)
        setTitlePopUp('Error al guardar el seguimiento')
        setTrackingPopUp(true)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


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


  const handleOnChangeRangeForDialog = (date: any) => {
    setStartDateRange(date);
    setIsButtonDisabled(isDateAlreadyRecorded(date) || !date);
    const isDuplicate = isDateAlreadyRecorded(date);
    setIsDuplicateDate(isDuplicate);

  };

  const filterByDateRange = (item: any) => {
    const itemDate = new Date(item.date);

    let adjustedEndDate = endDateRange;

    if (adjustedEndDate !== null) {
      adjustedEndDate = new Date(endDateRange as Date);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    }

    return (
      startDateRange === null ||
      adjustedEndDate === null ||
      (itemDate >= (startDateRange as Date) && itemDate < adjustedEndDate)
    );
  };

  function getIncludedDates(tracking: Tracking) {
    if (tracking) {
      const trackingDate = new Date(tracking.date);
      const expirationDate = new Date(tracking.expirationDate);
      const includedDates = [];

      const currentDate = new Date(trackingDate);
      while (currentDate <= expirationDate) {
        includedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return includedDates;
    }

    return [];
  }

  const isDateAlreadyRecorded = (selectedDate: any) => {
    if (!tracking) {
      return false;
    }

    const selectedDateString = selectedDate.toISOString();

    return tracking.data.some((record: any) => record.date === selectedDateString);
  };



  return (
    <Grid >
      <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <Box ml={5}>
          <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>Métricas</h2>
        </Box>

        {!isTrainer ? (
          <Button
            sx={{ mx: 4, my: 4 }}
            variant='contained'
            startIcon={<Icon icon='mdi:plus' />}
            onClick={() => {
              if (tracking && new Date(tracking.expirationDate) > new Date()) {
                setNuevoRegistro(true);
              }
            }}

            disabled={!tracking || new Date(tracking.expirationDate) <= new Date()}
          >
            Registro
          </Button>


        ) : null}


      </Card>


      {tracking ? (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Que le parecio el entrenamiento? */}
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
              <CardTrackingMensual tracking={tracking}></CardTrackingMensual>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1, height: '485px' }}>
              <Card sx={{ height: '485px' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Historial</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Puntuación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.number} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labels[trackingItem.number]}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
                  <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
                </Box>

              </Card>
            </Box>

          </Box>
          {/* Dificultad del entrenamiento */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, marginTop: { xs: '8px' } }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
              <CardTrackingDifficult tracking={tracking}></CardTrackingDifficult>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1, height: '485px' }}>
              <Card sx={{ height: '485px' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Historial</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Puntuación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.difficult} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labelsDifficult[trackingItem.difficult]}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
                  <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
                </Box>

              </Card>
            </Box>

          </Box>
          {/* Cansancio del entrenamiento */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, marginTop: { xs: '8px' } }}>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1 }}>
              <CardTrackingFatigue tracking={tracking}></CardTrackingFatigue>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' }, padding: 1, height: '485px' }}>
              <Card sx={{ height: '485px' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>Historial</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>Puntuación</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.fatigue} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labelsFatigue[trackingItem.fatigue]}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
                  <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
                </Box>

              </Card>
            </Box>

          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: '50px', mb: '20px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>No tenés solicitudes de suscripciones por el momento.</Typography>
        </Box>
      )
      }



      <Dialog
        open={nuevoRegistro}
        onClose={handlePopUpNuevoRegistro}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 660, height: '620px' } }}

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

        <Box display='column' justifyContent={'center'} >

          <Box display={'flex'} justifyContent={'center'} paddingTop={5}>

            {/* <Typography sx={{ textAlign: 'center', mb: 2 }}>
            Indique un día válido para el registro de entrenamiento.
            </Typography> */}

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: '255px' } }}>
                    <DatePicker
                      selected={startDateRange}
                      onChange={handleOnChangeRangeForDialog}
                      customInput={
                        <CustomInputForDialog
                          start={startDateRange as Date}
                          label='Día de entrenamiento'
                          dates={[]}
                          end={0}
                        />
                      }
                      minDate={tracking?.date}
                      maxDate={tracking?.expirationDate}
                      includeDates={getIncludedDates(tracking)}
                    />
                  </DatePickerWrapper>
                </Box>

              </div>
            </Box>
          </Box>
          {/* <Typography sx={{ textAlign: 'center', mb: 5, fontSize: '11px' }}>
            {tracking?.date && tracking?.expirationDate
              ? (
                <>
                  Las fechas correspondientes al plan van del{' '}
                  <strong>{format(new Date(tracking.date), 'dd/MM/yyyy')}</strong>{' '}
                  al{' '}
                  <strong>{format(new Date(tracking.expirationDate), 'dd/MM/yyyy')}</strong>
                </>
              )
              : 'Fechas no disponibles'}
          </Typography> */}

          {isDuplicateDate && (
            <Typography sx={{ textAlign: 'center', mt: 3, color: 'error.main', fontSize: '12px' }}  >
              Esta fecha ya está registrada. Por favor, seleccione otra en la que no haya registros de entrenamiento.
            </Typography>
          )}
          <Typography sx={{ textAlign: 'center', mt: '25px' }}>
            ¿Cómo estuvo el entrenamiento?
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: ['wrap', 'nowrap'],
              pt: theme => `${theme.spacing(2)} !important`,
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={value}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValue) => setValue(newValue)}
                onChangeActive={(event, newHover) => setHover(newHover)}
              />
              {value !== null && <Typography>{labels[hover !== -1 ? hover : value]}</Typography>}
            </Box>
          </Box>
        </Box>
        <Typography sx={{ textAlign: 'center', mt: '15px' }}>
          ¿Qué tan difícil le pareció el entrenamiento?
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: ['wrap', 'nowrap'],
            pt: theme => `${theme.spacing(2)} !important`,
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Rating
              value={valueDifficult}
              precision={1}
              name='hover-feedback'
              max={4}
              sx={{ mr: 4 }}
              onChange={(event, newValues) => setValueDifficult(newValues)}
              onChangeActive={(event, newHovers) => setHoverDifficult(newHovers)}
            />
            {valueDifficult !== null && <Typography>{labelsDifficult[hoverDifficult !== -1 ? hoverDifficult : valueDifficult]}</Typography>}
          </Box>
        </Box>
        <Typography sx={{ textAlign: 'center', mt: '15px' }}>
          ¿Qué tan cansador le pareció el entrenamiento?
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: ['wrap', 'nowrap'],
            pt: theme => `${theme.spacing(2)} !important`,
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Rating
              value={valueFatigue}
              precision={1}
              name='hover-feedback'
              max={4}
              sx={{ mr: 4 }}
              onChange={(event, newValues) => setValueFatigue(newValues)}
              onChangeActive={(event, newHovers) => setHoverFatigue(newHovers)}
            />
            {valueFatigue !== null && <Typography>{labelsFatigue[hoverFatigue !== -1 ? hoverFatigue : valueFatigue]}</Typography>}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mr: 5, mb: 10, mt: 0 }}>
          <Button
            variant='contained'
            sx={{ '&:hover': { backgroundColor: 'success.main' } }}
            onClick={() => newTrackingRecord()}
            disabled={isButtonDisabled}
          >
            Aceptar
          </Button>

        </Box>
        {/* <Box display={'flex'}>
          <Icon icon={'mdi:alert-circle-outline'} style={{ marginLeft: 8, fontSize: '18px' }} > </Icon>
          <Typography sx={{ ml: 1, fontSize: '12px' }}> Nota: Recuerde que <strong>no</strong> puede registrar un dia  de entrenamiento mas de una vez. </Typography>
        </Box> */}
      </Dialog>
      <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>
    </Grid >
  )

};


Tracking.acl = {
  action: 'manage',
  subject: 'tracking-page'
}


export default Tracking
