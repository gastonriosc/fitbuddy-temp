import { useState, useEffect } from 'react';
import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, ButtonProps, TextField, Dialog, DialogContent, Typography, DialogActions, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Icon from 'src/@core/components/icon';
import Button from '@mui/material/Button';
import Foro from './foro';
import { useSession } from 'next-auth/react';
import React from 'react';

interface Plan {
  _id: string;
  nombrePlan: string;
  trainerId: string;
  plan: Day[];
  trainerName: string;
}

interface Day {
  nombreDia: string;
  Ejercicios: Exercise[];
}

interface Exercise {
  nombreEjercicio: string;
  series: number;
  repeticiones: number;
  peso: number;
  link: string;
}

interface TrackingId {
  _id: string;
}

const ButtonStyled = styled(Button)<ButtonProps & { component?: React.ElementType; htmlFor?: string }>(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center',
    },
  })
);

const createData = (nombre: string, series: number, repeticiones: number, peso: number, link: string) => {
  return { nombre, series, repeticiones, peso, link };
};

const MyPlans = () => {
  const [plan, setPlan] = useState<Plan | any>();

  //const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [editingExerciseIndices, setEditingExerciseIndices] = useState<{ [key: string]: number | null }>({});

  const session = useSession();

  // Validar si el usuario está logueado y tiene el rol de 'Entrenador'
  const esEntrenador = session && session.data && session.data.user && plan && session.data.user._id.toString() === plan.trainerId;

  const [foroPopUp, setForoPopUp] = useState<boolean>();
  const [planId, setPlanId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRouter();
  const [titlePopUp, setTitlePopUp] = useState<string>()
  const [popUp, setPopUp] = useState<boolean>(false)
  const [popUpError, setPopUpError] = useState<boolean>(false)
  const [titlePopUpErrorDay, setTitlePopUpErrorDay] = useState<string>()
  const [popUpErrorDay, setPopUpErrorDay] = useState<boolean>(false)
  const [titlePopUpError, setTitlePopUpError] = useState<string>()
  const [popUpErrorDelete, setPopUpErrorDelete] = useState<boolean>(false)
  const [titlePopUpErrorDelete, setTitlePopUpErrorDelete] = useState<string>()
  const [trackingId, setTrackingId] = useState<TrackingId>()

  //const [plan, setPlan] = useState([]);
  const [manualInput, setManualInput] = React.useState(false);
  const [planes, setPlanes] = useState<[]>([]);


  const textPopUp = 'Pulse el botón OK para continuar'
  const textPopUpErrorDay = 'Por favor, intente nuevamente. El plan de entrenamiento que desea modificar debe tener al menos un día.'
  const textPopUpError = 'Por favor, intente nuevamente o elimine el día de entrenamiento en caso de no tener ejercicios.'
  const textPopUpErrorDelete = 'Por favor, intente nuevamente. El plan de entrenamiento que desea actualizar, no puede tener una cantidad menor de ejercicios que el plan original.'


  const closePopUp = () => setPopUp(false)
  const closePopUpErrorDay = () => setPopUpErrorDay(false)
  const closePopUpError = () => setPopUpError(false)
  const closePopUpErrorDelete = () => setPopUpErrorDelete(false)


  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);

    const header = new Image();
    header.src = '/images/avatars/Header.png';

    const footer = new Image();
    footer.src = '/images/avatars/Header.png';

    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();

    const headerProperties = doc.getImageProperties(header);
    const headerAspectRatio = headerProperties.height / headerProperties.width;
    const headerHeightDownScaled = headerAspectRatio * PAGE_WIDTH;

    const footerProperties = doc.getImageProperties(footer);
    const footerAspectRatio = footerProperties.height / footerProperties.width;
    const footerHeightDownScaled = footerAspectRatio * PAGE_WIDTH;


    doc.addImage(header, 'png', 0, 0, PAGE_WIDTH, headerHeightDownScaled);
    doc.addImage(footer, 'png', 0, PAGE_HEIGHT - footerHeightDownScaled, PAGE_WIDTH, footerHeightDownScaled);

    const fechaCreacion = new Date(plan.date);
    const fechaVencimiento = new Date(plan.expirationDate);

    const diaCreacion = fechaCreacion.getDate();
    const mesCreacion = fechaCreacion.getMonth() + 1;
    const añoCreacion = fechaCreacion.getFullYear();

    const diaVencimiento = fechaVencimiento.getDate();
    const mesVencimiento = fechaVencimiento.getMonth() + 1;
    const añoVencimiento = fechaVencimiento.getFullYear();

    const fechaFormateadaCreacion = `${diaCreacion}/${mesCreacion}/${añoCreacion}`;
    const fechaFormateadaVencimiento = `${diaVencimiento}/${mesVencimiento}/${añoVencimiento}`;

    doc.setFont('helvetica', 'bold');
    doc.text('PLAN DE ENTRENAMIENTO PARA', 70, 40);
    doc.text(`${session.data?.user.name.toUpperCase()}`, 85, 50);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    doc.text(`Datos Generales:`, 10, 57);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Género: ${session.data?.user.gender}`, 10, 65);
    doc.text(`País: ${session.data?.user.country}`, 10, 72);
    doc.text(`Teléfono: ${session.data?.user.phone}`, 10, 79);
    doc.text(`Email: ${session.data?.user.email}`, 10, 86);
    doc.text(`Nombre del plan: ${plan.nombrePlan}`, 10, 93);
    doc.text(`Fecha de creación del plan de entrenamiento: ${fechaFormateadaCreacion}`, 10, 100);
    doc.text(`Fecha de vencimiento del plan de entrenamiento: ${fechaFormateadaVencimiento}`, 10, 107);
    doc.text(`Profesor: ${plan.trainerName}`, 10, 114);

    doc.setFontSize(14);

    if (plan && plan.plan) {
      plan.plan.forEach((day: Day, index: any) => {
        if (index > 0) {
          doc.addPage();
          doc.addImage(header, 'png', 0, 0, PAGE_WIDTH, headerHeightDownScaled);
          doc.addImage(footer, 'png', 0, PAGE_HEIGHT - footerHeightDownScaled, PAGE_WIDTH, footerHeightDownScaled);

          doc.text(`Día ${index + 1}`, 10, 40);

          const tableData = day.Ejercicios.map((exercise: Exercise) => {
            return [exercise.nombreEjercicio, exercise.series, exercise.repeticiones, exercise.peso, exercise.link];
          });

          //@ts-ignore
          doc.autoTable({
            head: [['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Link']],
            body: tableData,

            startY: 47,
            columnStyles: {
              0: { cellWidth: 60 },
              1: { cellWidth: 20 },
              2: { cellWidth: 26 },
              3: { cellWidth: 20 },
              4: { cellWidth: 65 },
            },
          });
        } else {
          // Para el primer día
          doc.text(`Día ${index + 1}`, 10, 121);

          const tableData = day.Ejercicios.map((exercise: Exercise) => {
            return [exercise.nombreEjercicio, exercise.series, exercise.repeticiones, exercise.peso, exercise.link];
          });

          //@ts-ignore
          doc.autoTable({
            head: [['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Link']],
            body: tableData,

            startY: 128,
            columnStyles: {
              0: { cellWidth: 60 },
              1: { cellWidth: 20 },
              2: { cellWidth: 26 },
              3: { cellWidth: 20 },
              4: { cellWidth: 65 },
            },
          });
        }
      });
    }

    doc.save('PlanDeEntrenamiento.pdf');
  };


  const setEditingExerciseIndexs = (dayIndex: number, exerciseIndex: number | null) => {
    setEditingExerciseIndices((prevIndices) => ({
      ...prevIndices,
      [dayIndex]: exerciseIndex,
    }));
  };


  const handleExerciseDataChange = (dayIndex: number, exerciseIndex: number, property: string, value: string | number) => {
    setPlan((prevPlan: any) => {
      const updatedPlan = { ...prevPlan };
      updatedPlan.plan = prevPlan?.plan.map((day: any, dIndex: number) => {
        if (dIndex === dayIndex) {
          return {
            ...day,
            Ejercicios: day.Ejercicios.map((ex: any, exIndex: number) => {
              if (exIndex === exerciseIndex) {
                return {
                  ...ex,
                  [property]: value,
                };
              }

              return ex;
            }),
          };
        }

        return day;
      });

      return updatedPlan;
    });
  };


  const handleExerciseUpdate = (dayIndex: number) => {
    setEditingExerciseIndexs(dayIndex, null);
  };


  const foro = () => {
    setForoPopUp(true);
    setPlanId(route.query.id?.toString());
  };

  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id;

      try {
        const res = await fetch(
          `/api/trainingPlans/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setPlan(data.combinedInfo);
          setTrackingId(data.trackingId)
          setIsLoading(true);
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

    fetchMyRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExerciseChange = async () => {
    const planId = route.query.id;
    try {
      const res = await fetch(`/api/trainingPlans/?id=${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: plan?.plan }),
      });

      if (res.status === 200) {

        const updatedPlan = await res.json();
        console.log('plan actualizado:', updatedPlan);
        setTitlePopUp('Plan actualizado con éxito!')
        setPopUp(true)
      } else {
        console.error('Error al actualizar el plan');
      }
    } catch (error) {
      console.error('Error al actualizar el plan', error);
    }
  };

  const handleAddRow = (dayIndex: number) => {
    setPlan((prevPlan: any) => {
      const newPlanLists = [...prevPlan?.plan];
      newPlanLists[dayIndex].Ejercicios.push(createData('', 0, 0, 0, ''));

      return { ...prevPlan, plan: newPlanLists };
    });
  };

  const handleDeleteRow = (dayIndex: number, rowIndex: number) => {
    setPlan((prevPlan: any) => {
      const updatedPlanLists = prevPlan?.plan.map((day: any, dIndex: number) => {
        if (dIndex === dayIndex) {
          // Verificar si es el último ejercicio
          if (day.Ejercicios.length === 1) {
            setTitlePopUpError('El plan debe tener al menos un día con un ejercicio.');
            setPopUpError(true);

            return day; // No permitir eliminar el último ejercicio
          }

          const exerciseToDelete = day.Ejercicios[rowIndex];

          // Verificar si el ejercicio ya está guardado
          if (exerciseToDelete._id) {
            setTitlePopUpErrorDelete('No se puede eliminar un ejercicio ya guardado.');
            setPopUpErrorDelete(true);

            return day;
          }

          const updatedEjercicios = day.Ejercicios.filter((_: any, exIndex: number) => exIndex !== rowIndex);

          return { ...day, Ejercicios: updatedEjercicios };
        }

        return day;
      });

      return { ...prevPlan, plan: updatedPlanLists };
    });
  };



  const handleAddDay = () => {
    const lastDayIndex = plan.plan.length - 1;
    const newDayIndex = lastDayIndex + 1;

    const newDay = {
      nombreDia: `Día ${newDayIndex + 1}`, // Así, el nuevo día será "Día 2" si el último era "Día 1"
      Ejercicios: [createData('Agregue aquí un ejercicio', 0, 0, 0, '')],
    };

    const newPlanLists = [...plan.plan, newDay];
    setPlan((prevPlan: any) => ({ ...prevPlan, plan: newPlanLists }));
  };

  const handleDeleteLastDay = () => {
    setPlan((prevPlan: any) => {
      const updatedPlanLists = [...prevPlan.plan];
      if (updatedPlanLists.length > 1) {
        updatedPlanLists.pop(); // Elimina el último día

        return { ...prevPlan, plan: updatedPlanLists };
      } else {
        // Asegúrate de que siempre haya al menos un día en el plan
        setTitlePopUpErrorDay('El plan debe tener al menos un día!')
        setPopUpErrorDay(true)
      }

      return prevPlan;
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/generalLibrary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPlanes(data.exercisesData?.exercises || []);
        console.log(data.exercisesData?.exercises || []);
      } else {
        console.error('Error fetching data from the server');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card >
            <Box display={'flex'} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box ml={5}>
                <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>{plan?.nombrePlan}</h2>
              </Box>
              <Box display={'flex'} sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant='contained'
                  startIcon={<Icon icon='wpf:faq' />}
                  sx={{ mx: 2, my: 4, height: 'auto' }}
                  onClick={() => foro()}
                >
                  CHAT
                </Button>
                <Button
                  variant='contained'
                  startIcon={<Icon icon='wpf:statistics' />}
                  sx={{ mr: 4, my: 4, height: 'auto' }}

                  href={'/plans/tracking/' + trackingId?._id}
                >
                  SEGUIMIENTO
                </Button>
              </Box>
            </Box>
            <CardContent>
              <Box>
                <Card>
                  <CardContent>
                    {plan?.plan.map((day: Day, dayIndex: any) => (
                      <Box key={dayIndex}>
                        <h3 style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>
                          {day.nombreDia}
                        </h3>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Ejercicio</TableCell>
                                <TableCell>Series</TableCell>
                                <TableCell>Repeticiones</TableCell>
                                <TableCell>Peso</TableCell>
                                <TableCell align='left'>Link</TableCell>
                                {esEntrenador && (

                                  <TableCell>Acciones</TableCell>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {day.Ejercicios.map((exercise, exerciseIndex) => (
                                <TableRow key={exerciseIndex}>
                                  <TableCell>
                                    {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                      manualInput ? (
                                        <FormControl fullWidth>
                                          <InputLabel id='exercise-select-label'>Ejercicio</InputLabel>
                                          <Select
                                            labelId='exercise-select-label'
                                            id='exercise-select'
                                            value={exercise.nombreEjercicio}
                                            onChange={(e) =>
                                              handleExerciseDataChange(dayIndex, exerciseIndex, 'nombreEjercicio', e.target.value)
                                            }
                                          >
                                            {planes.map((exercise: any) => (
                                              <MenuItem key={exercise.exerciseName} value={exercise.exerciseName}>
                                                {exercise.exerciseName}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        </FormControl>
                                      ) : (
                                        <TextField
                                          type="text"
                                          value={exercise.nombreEjercicio}
                                          onChange={(e) =>
                                            handleExerciseDataChange(dayIndex, exerciseIndex, 'nombreEjercicio', e.target.value)
                                          }
                                        />
                                      )
                                    ) : (
                                      exercise.nombreEjercicio
                                    )}
                                  </TableCell>

                                  <TableCell>

                                    {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                      <TextField
                                        type="number"
                                        value={exercise.series}
                                        onChange={(e) =>
                                          handleExerciseDataChange(dayIndex, exerciseIndex, 'series', e.target.value)
                                        }
                                      />
                                    ) : (
                                      exercise.series
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                      <TextField
                                        type="number"
                                        value={exercise.repeticiones}
                                        onChange={(e) =>
                                          handleExerciseDataChange(dayIndex, exerciseIndex, 'repeticiones', e.target.value)

                                        }
                                      />
                                    ) : (
                                      exercise.repeticiones
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                      <TextField
                                        type="number"
                                        value={exercise.peso}
                                        onChange={(e) =>
                                          handleExerciseDataChange(dayIndex, exerciseIndex, 'peso', e.target.value)
                                        }
                                      />
                                    ) : (
                                      exercise.peso
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                      <TextField
                                        type="text"
                                        value={exercise.link}
                                        onChange={(e) => handleExerciseDataChange(dayIndex, exerciseIndex, 'link', e.target.value)

                                        }
                                      />
                                    ) : (
                                      <>
                                        {exercise.link && exercise.link.trim() !== '' ? (
                                          <a style={{ color: 'red' }} href={exercise.link} target="_blank" rel="noopener noreferrer">
                                            {exercise.link.includes('drive.google.com') ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                              </svg>
                                            ) : exercise.link.includes('youtube.com') ? (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                                                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569-.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                              </svg>
                                            ) : (
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                                <path d="M8.293 8.293a.5.5 0 0 0 .707 0l3-3a.5.5 0 0 0-.707-.707l-3 3a.5.5 0 0 0 .707.707zM7.5 10a.5.5 0 0 0-.5-.5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a.5.5 0 0 0 0-1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3.5z" />
                                                <path d="M11.5 5a.5.5 0 0 0 .5-.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a.5.5 0 0 0 .5-.5z" />
                                              </svg>
                                            )}
                                          </a>
                                        ) : (
                                          <span style={{ color: 'skyblue' }}> No se adjuntó link.</span>
                                        )}
                                      </>
                                    )}
                                  </TableCell>

                                  <TableCell>
                                    {esEntrenador && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {editingExerciseIndices[dayIndex] === exerciseIndex ? (
                                          <>
                                            <Icon
                                              icon='mdi:check'
                                              onClick={() => handleExerciseUpdate(dayIndex)}
                                              style={{ cursor: 'pointer', color: 'lightgreen' }}
                                            />
                                            <ButtonStyled
                                              sx={{ color: 'skyblue' }}
                                              onClick={() => setManualInput(!manualInput)}
                                            >
                                              {manualInput ? <Icon icon='bi:keyboard' /> : <Icon icon='bi:list' />}
                                            </ButtonStyled>
                                            <Icon
                                              icon='mdi:trash'
                                              onClick={() => handleDeleteRow(dayIndex, exerciseIndex)}
                                              style={{ cursor: 'pointer', color: 'red' }}
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <Icon
                                              icon='mdi:pencil'
                                              onClick={() => setEditingExerciseIndexs(dayIndex, exerciseIndex)}
                                              style={{ cursor: 'pointer', color: 'skyblue' }}
                                            />
                                            <Icon
                                              icon='mdi:trash'
                                              onClick={() => handleDeleteRow(dayIndex, exerciseIndex)}
                                              style={{ marginLeft: '10px', cursor: 'pointer', color: 'skyblue' }}
                                            />
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {esEntrenador && (
                            <ButtonStyled variant='contained' onClick={() => handleAddRow(dayIndex)} sx={{ marginTop: '15px' }}>
                              Agregar Ejercicio
                            </ButtonStyled>
                          )}
                        </TableContainer>
                      </Box>

                    ))}

                  </CardContent>
                </Card>
              </Box>

            </CardContent>
          </Card>

          <Foro foroPopUp={foroPopUp} setForoPopUp={setForoPopUp} planId={planId} />
        </Grid>
        <Grid container justifyContent='space-between' mt={2}>
          <Grid item md={6} xs={12} >
            {esEntrenador && (
              <Button sx={{ marginLeft: '2%' }} variant='outlined' onClick={handleAddDay}>
                Agregar Día
              </Button>
            )}
            {esEntrenador && (

              <Button sx={{ marginLeft: '2%' }} variant='outlined' onClick={handleDeleteLastDay}>
                Eliminar Día
              </Button>
            )}
            <Button sx={{ marginLeft: '2%' }} variant='outlined' onClick={exportToPDF} >
              Exportar a PDF
            </Button>
          </Grid>

          <Grid item md={1.4} xs={12} >
            {esEntrenador && (

              <Button sx={{ marginLeft: '2%' }} variant='outlined' onClick={handleExerciseChange}>
                Actualizar plan
              </Button>
            )}
          </Grid>
        </Grid>

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
              <Icon icon='line-md:confirm' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUp}</Typography>
              <Typography>{textPopUp}</Typography>
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
        {/* PopUp Error de eliminar todos los dias del plan sin dejar ni uno*/}
        <Dialog fullWidth open={popUpErrorDay} onClose={closePopUpErrorDay} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              <Icon icon='line-md:cancel' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpErrorDay}</Typography>
              <Typography>{textPopUpErrorDay}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUpErrorDay}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* PopUp Error de eliminar ejercicios y dejar el dia sin ejercicios*/}
        <Dialog fullWidth open={popUpError} onClose={closePopUpError} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              <Icon icon='line-md:cancel' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpError}</Typography>
              <Typography>{textPopUpError}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUpError}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog fullWidth open={popUpErrorDelete} onClose={closePopUpErrorDelete} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              <Icon icon='line-md:cancel' fontSize='5.5rem' />
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpErrorDelete}</Typography>
              <Typography>{textPopUpErrorDelete}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUpErrorDelete}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid >

    );
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
};

MyPlans.acl = {
  action: 'manage',
  subject: 'plans-page',
};

export default MyPlans;
