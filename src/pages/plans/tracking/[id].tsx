/* eslint-disable react-hooks/exhaustive-deps */
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
import { DialogActions, DialogContent, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
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
  const [endDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(new Date())
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isDuplicateDate, setIsDuplicateDate] = useState(false);
  const [invalidDateError, setInvalidDateError] = useState(false);

  const closePopUpDelete = () => setPopUpDelete(false)
  const [popUpDelete, setPopUpDelete] = useState<boolean>(false)
  const [titlePopUpDelete, setTitlePopUpDelete] = useState<string>()

  const [confirmDeleteRecord, setConfirmDeleteRecord] = useState(null);


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



  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }
  const itemsPerPage = 6;

  const totalPages = Math.ceil(tracking?.data.length / itemsPerPage);


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

        // window.location.reload();



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


  const handleOnChangeRangeForDialog = (date: Date | any) => {
    setStartDateRange(date);
    setIsButtonDisabled(isDateAlreadyRecorded(date) || !date);
    const isDuplicate = isDateAlreadyRecorded(date);
    setIsDuplicateDate(isDuplicate);

    const currentDate = new Date();

    if (date > currentDate) {
      setInvalidDateError(true);
    } else {
      setInvalidDateError(false);
    }
  };


  const filterByDateRange = (item: any) => {
    const itemDate = new Date(item.date);

    let adjustedEndDate = endDateRange;

    if (adjustedEndDate !== null) {
      adjustedEndDate = new Date(endDateRange as Date);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    }

    const isWithinRange =
      startDateRange === null ||
      adjustedEndDate === null ||
      (itemDate >= (startDateRange as Date) && itemDate < adjustedEndDate);

    return { isWithinRange, itemDate };
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

  const isDateAlreadyRecorded = (date: DateType) => {
    if (tracking) {
      const isDuplicate = tracking.data.some((item: any) => {
        const itemDate = new Date(item.date);

        return itemDate.toDateString() === date?.toDateString();
      });

      return isDuplicate;
    }

    return false;
  }


  const handleDeleteRecord = (record: any) => {
    setConfirmDeleteRecord(record);
    setTitlePopUpDelete('¿Está seguro que desea eliminar este registro?');
    setPopUpDelete(true);
  };


  useEffect(() => {
    if (tracking) {
      const currentDate = new Date();
      handleOnChangeRangeForDialog(currentDate);
    }
  }, [tracking]);

  const handleConfirmedDelete = async () => {
    try {
      const res = await fetch('/api/tracking', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: route.query.id,
          data: confirmDeleteRecord,
        }),
      });

      if (res.status === 200) {
        const updatedData = tracking?.data.filter((item: any) => item !== confirmDeleteRecord);
        setTracking({ ...tracking, data: updatedData });
      } else {
        console.error('Error deleting record');
      }
    } catch (error) {
      console.error('Error in the request:', error);
    }

    setPopUpDelete(false);
    setConfirmDeleteRecord(null);
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

      {tracking?.data.length > 0 ? (
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
                        {!isTrainer && <TableCell style={{ textAlign: 'center' }}>Acciones</TableCell>}
                      </TableRow>

                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString('es')}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.number} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labels[trackingItem.number]}</Typography>
                              </Box>
                            </TableCell>
                            {!isTrainer && <TableCell style={{ justifyContent: 'center', textAlign: 'center' }}>
                              <Icon
                                icon='mdi:delete'
                                style={{ color: new Date() > new Date(tracking.expirationDate) ? 'grey' : 'red' }}
                                onClick={() => {
                                  if (new Date() <= new Date(tracking.expirationDate)) {
                                    handleDeleteRecord(trackingItem);
                                  }
                                }}
                              />
                            </TableCell>}
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
                        {!isTrainer && <TableCell style={{ textAlign: 'center' }}>Acciones</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString('es')}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.difficult} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labelsDifficult[trackingItem.difficult]}</Typography>
                              </Box>
                            </TableCell>
                            {!isTrainer && <TableCell style={{ justifyContent: 'center', textAlign: 'center' }}>
                              <Icon
                                icon='mdi:delete'
                                style={{ color: new Date() > new Date(tracking.expirationDate) ? 'grey' : 'red' }}
                                onClick={() => {
                                  if (new Date() <= new Date(tracking.expirationDate)) {
                                    handleDeleteRecord(trackingItem);
                                  }
                                }}
                              />
                            </TableCell>}
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
                        {!isTrainer && <TableCell style={{ textAlign: 'center' }}>Acciones</TableCell>}

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tracking?.data
                        .filter(filterByDateRange)
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((trackingItem: any) => (
                          <TableRow key={trackingItem}>
                            <TableCell style={{ textAlign: 'center' }}>
                              {new Date(trackingItem.date).toLocaleDateString('es')}
                            </TableCell>
                            <TableCell style={{ justifyContent: 'center' }}>
                              <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Rating readOnly value={trackingItem.fatigue} max={4} name='read-only' />
                                <Typography sx={{ ml: 1 }}>{labelsFatigue[trackingItem.fatigue]}</Typography>
                              </Box>
                            </TableCell>
                            {!isTrainer && <TableCell style={{ justifyContent: 'center', textAlign: 'center' }}>
                              <Icon
                                icon='mdi:delete'
                                style={{ color: new Date() > new Date(tracking.expirationDate) ? 'grey' : 'red' }}
                                onClick={() => {
                                  if (new Date() <= new Date(tracking.expirationDate)) {
                                    handleDeleteRecord(trackingItem);
                                  }
                                }}
                              />
                            </TableCell>}
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
      ) : (isTrainer ? (
        <Box sx={{ mt: '50px', mb: '20px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>Su alumno no ha hecho registros aún.</Typography>
        </Box>
      ) :
        <Box sx={{ mt: '50px', mb: '20px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center' }}>No has hecho registros de seguimiento aún.</Typography>
        </Box>
      )}

      <Dialog
        open={nuevoRegistro}
        onClose={handlePopUpNuevoRegistro}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 660 } }}

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
          ¡Registra tu avance!
        </DialogTitle>
        <Divider sx={{ my: '0 !important' }} />

        <Box display='column' justifyContent={'center'} >

          <Box display={'flex'} justifyContent={'center'} paddingTop={5}>

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
                      maxDate={new Date()}
                      includeDates={getIncludedDates(tracking)}
                    />
                  </DatePickerWrapper>
                </Box>

              </div>
            </Box>
          </Box>


          {isDuplicateDate && (
            <Typography sx={{ textAlign: 'center', mt: 3, color: 'error.main', fontSize: '12px' }}  >
              Esta fecha ya está registrada. Por favor, seleccione otra en la que no haya registros de entrenamiento.
            </Typography>
          )}
          {invalidDateError && (
            <Typography sx={{ textAlign: 'center', mt: 3, color: 'error.main', fontSize: '12px' }}>
              La fecha seleccionada no puede ser mayor a la fecha actual.
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
            <Box sx={{ alignItems: 'center', mb: -6 }}>

              <Rating
                value={value}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValue) => setValue(newValue)}
                onChangeActive={(event, newHover) => setHover(newHover)}
              />
              <Box>

                {value !== null && <Typography>{labels[hover !== -1 ? hover : value]}</Typography>}
              </Box>

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
          <Box sx={{ mb: -6, alignItems: 'center' }}>

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
          <Box sx={{ mb: -3, alignItems: 'center' }}>

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
            disabled={isButtonDisabled || invalidDateError}
          >
            Aceptar
          </Button>
        </Box>

      </Dialog>
      <Dialog fullWidth open={popUpDelete} onClose={closePopUpDelete} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              '& svg': { mb: 6, color: 'error.main' }
            }}
          >
            <Icon icon='line-md:alert' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpDelete}</Typography>
            {/* <Typography>{textPopUpDelete}</Typography> */}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >

          <Button variant='contained' color='error' onClick={handleConfirmedDelete}>
            Eliminar
          </Button>
          <Button variant='contained' color='primary' onClick={() => setPopUpDelete(false)}>
            Volver
          </Button>
        </DialogActions>
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
