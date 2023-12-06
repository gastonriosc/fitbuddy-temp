// ** React Imports
import { useEffect, useState } from 'react'
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
import CircularProgress from '@mui/material/CircularProgress';

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputLabel, MenuItem, Select } from '@mui/material'
import CardTrackingDifficultReport from './cardTrackingDifficult'
import CardTrackingFatigueReport from './cardTrackingFatigue'
import CardTrackingReport from './cardTrackingReport'
import { display } from '@mui/system'


type Props = {
  planId: string
  reportPopUp: boolean
  handleReportPopUp: (val: boolean) => void
}

interface DataTracking {
  _id: string,
  number: number,
  difficult: number,
  fatigue: number
}

interface Tracking {
  _id: string,
  planId: string,
  data: DataTracking[]
}

const ReportPopUp = ({ planId, reportPopUp, handleReportPopUp }: Props) => {

  const [trackingInfo, setTrackingInfo] = useState<Tracking>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  console.log('tracking:', trackingInfo)
  interface FormData {
    _id: number | string
    name: string
    amount: number
    description: string
    daysPerWeek: number
    intensity: string
    following: string
  }

  let count;
  let averageNumber;
  let averageDifficult;
  let averageFatigue
  if (trackingInfo) {
    count = trackingInfo?.data.length;
    averageNumber = trackingInfo?.data.reduce((sum, item) => sum + item.number, 0) / count;
    averageDifficult = trackingInfo?.data.reduce((sum, item) => sum + item.difficult, 0) / count;
    averageFatigue = trackingInfo?.data.reduce((sum, item) => sum + item.fatigue, 0) / count;

  }


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

  const handleReport = () => handleReportPopUp(false)

  useEffect(() => {
    const fetchMyTrackings = async () => {

      if (!planId) {
        setIsLoading(false);
        console.log('hola')

        return;
      }
      try {
        const res = await fetch(
          `/api/report/?id=${planId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.status === 200) {
          const data = await res.json();
          setTrackingInfo(data)
          setIsLoading(false)

        } else if (res.status === 404) {
          route.replace('/404');
        } else if (res.status === 500) {
          route.replace('/500');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMyTrackings();
  }, [planId]);

  return (
    <>
      <Box
        sx={{
          minWidth: '70%',
          maxWidth: '70%'

        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8.5)} !important`],

          }}
        >
          REPORTE FINAL
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: '1', // Para que tome el espacio restante
          }}
        >
          {trackingInfo ? (
            <Box width={'100%'}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  width: '100%',

                }}
              >
                <CardTrackingReport tracking={trackingInfo}></CardTrackingReport>
                <CardTrackingDifficultReport tracking={trackingInfo}></CardTrackingDifficultReport>
                <CardTrackingFatigueReport tracking={trackingInfo}></CardTrackingFatigueReport>
              </Box>
            </Box>
          ) : (
            <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress size={50} thickness={6} color='primary' />
            </Box>
          )}
        </Box>

      </Box>



      {/* <Dialog fullWidth open={popUp} onClose={closePopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
      </Dialog> */}
    </>
  )
}

export default ReportPopUp
