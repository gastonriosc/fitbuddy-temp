// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

// import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DialogActions, Divider, Rating } from '@mui/material'
import { useSession } from 'next-auth/react'




type Props = {
  planId: string
  reportPopUp: boolean
  handleReportPopUp: (val: boolean) => void
}

// interface DataTracking {
//   _id: string,
//   number: number,
//   difficult: number,
//   fatigue: number
// }

// interface FinalReport {
//   observations: string,
//   progress: number,
//   trainerSupport: number,
//   recommend: number

// }

// interface Tracking {
//   _id: string,
//   planId: string,
//   data: DataTracking[]
//   finalReport: FinalReport[]
// }

interface FormData {
  _id: number | string
  name: string
  amount: number
  description: string
  daysPerWeek: number
  intensity: string
  following: string
}

const ReportPopUp = ({ planId, reportPopUp, handleReportPopUp }: Props) => {
  // const [trackingInfo, setTrackingInfo] = useState<Tracking | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [observations, setObservations] = useState<string>('')
  const session = useSession()
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [hoverProgress, sethoverProgress] = useState<number>(-1)
  const [hoverTrainerSupport, sethoverTrainerSupport] = useState<number>(-1)
  const [hoverRecommend, sethoverRecommend] = useState<number>(-1)

  const [valueProgress, setvalueProgress] = useState<number | null | any>(2)
  const [valueTrainerSupport, setvalueTrainerSupport] = useState<number | null | any>(2)
  const [valueRecommend, setvalueRecommend] = useState<number | null | any>(2)
  const labelsProgress: { [index: string]: string } = {
    1: '',
    2: '',
    3: '',
    4: '',
  }
  const labelsTrainerSupport: { [index: string]: string } = {
    1: '',
    2: '',
    3: '',
    4: '',
  }
  const labelsRecommend: { [index: string]: string } = {
    1: '',
    2: '',
    3: '',
    4: '',
  }


  const esAlumno = session?.data?.user?.role === 'Alumno'

  // let count;
  // let averageNumber;
  // let averageDifficult;
  // let averageFatigue
  // if (trackingInfo) {
  //   count = trackingInfo?.data.length;

  //   averageNumber = trackingInfo?.data.reduce((sum, item) => sum + item.number, 0) / count;

  //   averageDifficult = trackingInfo?.data.reduce((sum, item) => sum + item.difficult, 0) / count;
  //   averageFatigue = trackingInfo?.data.reduce((sum, item) => sum + item.fatigue, 0) / count;
  // }


  const schema = yup.object().shape({
    name: yup.string().required("Nombre es un campo obligatorio").max(20, "Debe tener 20 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
    amount: yup.number().integer("El precio no puede contener números decimales").required("Precio es un campo obligatorio").min(0, "El precio no puede ser negativo"),
    description: yup.string().required("Descripción es un campo obligatorio").max(300, "Debe tener 300 caracteres máximo").min(4, "Debe tener 4 caracteres minimo"),
    daysPerWeek: yup.number().integer("La cantidad de días no puede contener decimales").required("Es obligatorio completar la cantidad de días a entrenar por semana").min(1, "La cantidad de días debe ser mayor o igual a 1").max(7, "La cantidad de días debe ser menor o igual a 7"),
    intensity: yup.string().required("Intensidad es un campo obligatorio"),
    following: yup.string().required("Seguimiento es un campo obligatorio")
  })

  const {
    // control,
    // handleSubmit,
    formState: { },
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
    let isMounted = true;

    const fetchMyTrackings = async () => {
      if (!planId) {
        setIsLoading(false);

        return;
      }
      try {
        const res = await fetch(`/api/report/?id=${planId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 200) {
          const trackingData = await res.json();
          const { finalReport } = trackingData;

          if (isMounted) {

            if (finalReport && finalReport.length > 0) {
              const firstReport = finalReport[0];

              setObservations(firstReport.observations);
              setvalueProgress(firstReport.progress);
              setvalueTrainerSupport(firstReport.trainerSupport);
              setvalueRecommend(firstReport.recommendations);

              setIsLoading(false);
              setMessageSent(!!firstReport.observations);
            } else {

              setObservations('');
              setvalueProgress('');
              setvalueTrainerSupport('');
              setvalueRecommend('');
              setIsLoading(false);
              setMessageSent(false);

            }
          }
        } else if (res.status === 404) {
          route.replace('/404');
        } else if (res.status === 500) {
          route.replace('/500');
        }
      } catch (error) {
        console.error('Error para extraer usuarios:', error);
      }
    };

    fetchMyTrackings();

    return () => {
      isMounted = false;
    };
  }, [planId, route]);



  const handleObservationsSubmit = async () => {
    if (!planId || !observations || valueProgress === null || valueTrainerSupport === null || valueRecommend === null) {
      setErrorMessage('Por favor, complete todos los campos.');

      return;
    }

    try {
      const res = await fetch(`/api/report`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          observations: observations,
          progress: valueProgress,
          trainerSupport: valueTrainerSupport,
          recommendations: valueRecommend,
        }),
      });

      if (res.status === 200) {
        setMessageSent(true);
        handleReportPopUp(false);
        setShowSuccessMessage(true);
      } else {
        setErrorMessage('Error al actualizar las observaciones.');
      }
    } catch (error) {
      setErrorMessage('Un error ha ocurrido. Por favor, intente nuevamente.');
    }
  };


  return (
    <>
      <Dialog
        open={reportPopUp}
        onClose={handleReport}
        aria-labelledby='user-view-plans'
        aria-describedby='user-view-plans-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 740, height: '700px' } }}
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
          Reporte final
        </DialogTitle>
        <Divider sx={{ my: '0 !important' }} />

        <DialogContent
          sx={{

            pt: theme => `${theme.spacing(2)} !important`,
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <TextField
            rows={4}
            fullWidth
            multiline
            id='textarea-outlined-static'
            label='Observaciones'
            placeholder='Por favor, indique sus observaciones sobre el plan de entrenamiento realizado por el entrenador. Recuerde que una vez enviado este informe, no podrá ser modificado.'
            name='disease'
            value={observations || ''}
            onChange={(e) => setObservations(e.target.value)}
            disabled={messageSent || !esAlumno}

          />

          <Typography sx={{ textAlign: 'center', mt: '15px' }}>
            ¿En qué medida lograste alcanzar tus objetivos con este plan de entrenamiento?
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
                value={valueProgress}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValues) => setvalueProgress(newValues)}
                onChangeActive={(event, newHovers) => sethoverProgress(newHovers)}
                disabled={messageSent || !esAlumno}

              />
              {valueProgress !== null && <Typography>{labelsProgress[hoverProgress !== -1 ? hoverProgress : valueProgress]}</Typography>}
            </Box>
          </Box>
          <Typography sx={{ textAlign: 'center', mt: '1px', }}>
            ¿Cómo calificarías el nivel de apoyo proporcionado por el entrenador durante el plan?
          </Typography>
          <Box
            sx={{
              mt: 1,
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
                value={valueTrainerSupport}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValues) => setvalueTrainerSupport(newValues)}
                onChangeActive={(event, newHovers) => sethoverTrainerSupport(newHovers)}
                disabled={messageSent || !esAlumno}
              />
              {valueTrainerSupport !== null && <Typography>{labelsTrainerSupport[hoverTrainerSupport !== -1 ? hoverTrainerSupport : valueTrainerSupport]}</Typography>}
            </Box>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: '1px', }}>
            ¿Que tanto recomendarías este plan de entrenamiento a otras personas?
          </Typography>
          <Box
            sx={{
              mt: 1,
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
                value={valueRecommend}
                precision={1}
                name='hover-feedback'
                max={4}
                sx={{ mr: 4 }}
                onChange={(event, newValues) => setvalueRecommend(newValues)}
                onChangeActive={(event, newHovers) => sethoverRecommend(newHovers)}
                disabled={messageSent || !esAlumno}
              />
              {valueRecommend !== null && <Typography>{labelsRecommend[hoverRecommend !== -1 ? hoverRecommend : valueRecommend]}</Typography>}
            </Box>
          </Box>

          {errorMessage && (
            <Typography sx={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
              {errorMessage}
            </Typography>
          )}

          {esAlumno ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button
                variant='contained'
                color='primary'
                endIcon={<Icon icon='mdi:send' />}
                type='submit'
                onClick={handleObservationsSubmit}
                disabled={messageSent}
              >
                Enviar
              </Button>
            </Box>
          ) : null}


        </DialogContent>


      </Dialog>
      <Dialog
        open={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        aria-labelledby='success-dialog'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
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
            <Icon icon='line-md:confirm' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5 }}>Registro de reporte final exitoso</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='outlined' color='success' onClick={() => setShowSuccessMessage(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReportPopUp
