// ** React Imports
import { forwardRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form'
// import NewSubsPopUp from './newSubsPopUp'
//import CardWorkoutMensual from './cardWorkouts'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { format, addDays, startOfWeek } from 'date-fns';

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

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

// import * as yup from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'

// ** Custom Components
// import CustomChip from 'src/@core/components/mui/chip'
// import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Types
// import { ThemeColor } from 'src/@core/layouts/types'
// import { UsersType } from 'src/types/apps/userTypes'


// ** Utils Import
// import { getInitials } from 'src/@core/utils/get-initials'

interface StudentInsight {
  _id: string,
  data: {
    _id: string
    date: Date,
    weight: number
  }
}


const StudentInsight = () => {

  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isDuplicateDate, setIsDuplicateDate] = useState(false);
  const [insights, setInsights] = useState<string[]>([])
  const [lunesSemanales, setLunesSemanales] = useState<string[]>([])
  const route = useRouter()
  const total = insights?.length

  //! grafico de entrenamientos semanales
  const obtenerDiasLunes = () => {
    const fechaActual = new Date();
    const diasLunes: string[] = [];

    const lunesSiguiente = new Date(fechaActual);
    lunesSiguiente.setDate(fechaActual.getDate() + (1 + 7 - fechaActual.getDay()) % 7);
    lunesSiguiente.setUTCHours(3, 0, 0, 0); // Fijar la hora a las 03:00:00.000Z
    diasLunes.push(lunesSiguiente.toISOString());

    for (let i = 1; i <= 25; i++) {
      const diaAnterior = new Date(lunesSiguiente);
      diaAnterior.setDate(lunesSiguiente.getDate() - 7 * i);
      diaAnterior.setUTCHours(3, 0, 0, 0); // Fijar la hora a las 03:00:00.000Z
      diasLunes.unshift(diaAnterior.toISOString());
    }

    setLunesSemanales(diasLunes);
  };

  const contarFechasPorSemana = (fechasBaseDatos: string[], fechasSemanas: string[]): number[] => {
    const contadorSemanas: number[] = Array(fechasSemanas.length).fill(0);

    fechasBaseDatos.forEach((fechaBaseDatos) => {
      const fechaBaseDatosObj = new Date(fechaBaseDatos);

      fechasSemanas.some((fechaSemana, index) => {
        const fechaSemanaObj = new Date(fechaSemana);
        const fechaSiguiente = new Date(fechasSemanas[index + 1] || Infinity);

        if (fechaBaseDatosObj >= fechaSemanaObj && fechaBaseDatosObj < fechaSiguiente) {
          contadorSemanas[index]++;

          return true; // Terminar el bucle si se encuentra la semana correspondiente
        }

        return false; // Continuar buscando en las semanas siguientes
      });
    });

    return contadorSemanas;
  };

  const series = contarFechasPorSemana(insights, lunesSemanales)
  const convertirFormatoFechas = (fechas: string[]): string[] => {
    return fechas.map((fecha) => {
      const fechaObj = new Date(fecha);
      const dia = fechaObj.getDate().toString().padStart(2, '0');
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');

      return `${dia}/${mes}`;
    });
  };

  const handlePopUpNuevoRegistro = () => {
    setNuevoRegistro(false)
  }

  const handleOnChangeRangeForDialog = (date: any) => {
    setStartDateRange(date);

    // setIsButtonDisabled(isDateAlreadyRecorded(date) || !date);
    // const isDuplicate = isDateAlreadyRecorded(date);
    // setIsDuplicateDate(isDuplicate);

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

  useEffect(() => {
    const fetchMyTracking = async () => {
      const id = route.query.id;
      obtenerDiasLunes();
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
          setInsights(data.dataTracking)
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
      <Box sx={{ mt: 5 }}>
        <ChartEntrenamientosSemanales contador={series} total={total} categorias={convertirFormatoFechas(lunesSemanales)}></ChartEntrenamientosSemanales>
      </Box>

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
                          label='Seleccione fecha de registro'
                          dates={[]}
                          end={0}
                        />
                      }

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

          {/* {isDuplicateDate && ( */}
          <Typography sx={{ textAlign: 'center', mt: 3, color: 'error.main', fontSize: '12px' }}  >
            Esta fecha ya está registrada. Por favor, seleccione otra en la que no haya registros de entrenamiento.
          </Typography>
          {/* // )} */}


        </Box>



        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 5, mb: 10, mt: 0 }}>
          <Button
            variant='contained'
            sx={{ '&:hover': { backgroundColor: 'success.main' } }}

          // onClick={() => newTrackingRecord()}
          // disabled={isButtonDisabled}
          >
            Aceptar
          </Button>

        </Box>
        {/* <Box display={'flex'}>
          <Icon icon={'mdi:alert-circle-outline'} style={{ marginLeft: 8, fontSize: '18px' }} > </Icon>
          <Typography sx={{ ml: 1, fontSize: '12px' }}> Nota: Recuerde que <strong>no</strong> puede registrar un dia  de entrenamiento mas de una vez. </Typography>
        </Box> */}
      </Dialog>

    </Grid >
  )

};


StudentInsight.acl = {
  action: 'manage',
  subject: 'studentInsights-page'
}


export default StudentInsight
