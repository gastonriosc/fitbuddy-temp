import { useState, useEffect } from 'react';
import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, ButtonProps } from '@mui/material';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Icon from 'src/@core/components/icon';
import Button from '@mui/material/Button'
import Foro from './foro';

interface Plan {
  _id: string;
  nombrePlan: string;
  plan: Day[];
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
  link: string
}
const ButtonStyled = styled(Button)<ButtonProps & { component?: React.ElementType; htmlFor?: string }>(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center',
    },
  })
);


const MyPlans = () => {
  const [plan, setPlan] = useState<Plan>(); // Inicializa como null o con un valor de Plan si tienes uno por defecto
  const [foroPopUp, setForoPopUp] = useState<boolean>()
  const [planId, setPlanId] = useState<string>()
  const foro = () => {
    setForoPopUp(true);
    setPlanId(route.query.id?.toString());
  };

  // const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const route = useRouter();


  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);

    if (plan && plan.plan) {
      plan.plan.forEach((day: Day, index: any) => {
        if (index > 0) {
          doc.addPage();
        }
        doc.text(`Día ${index + 1}`, 10, 20);

        const tableData = day.Ejercicios.map((exercise: Exercise) => {
          return [exercise.nombreEjercicio, exercise.series, exercise.repeticiones, exercise.peso, exercise.link];
        });

        //@ts-ignore
        doc.autoTable({
          head: [['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Link']],
          body: tableData,
          startY: 30,
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 60 },
          },
        });
      });
    }

    doc.save('PlanDeEntrenamiento.pdf');
  };

  // const handlePageChange = (_, page) => {
  //   setCurrentPage(page);
  // };

  // Calcular el índice inicial y final de los planes en la página actual
  // const startIndex = (currentPage - 1) * plansPerPage;
  // const endIndex = startIndex + plansPerPage;
  // const plansToDisplay = plans.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchMyRequests = async () => {
      const id = route.query.id;

      try {
        // ** Llamada a la API para obtener datos paginados
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
          setPlan(data);
          setIsLoading(true);
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

    fetchMyRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   const studentId = route.query.id;

  //   fetch(`/api/trainingPlans?studentId=${studentId}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setPlans(data);
  //       console.log('Planes obtenidos:', data);
  //     })
  //     .catch((error) => {
  //       console.error('Error al obtener los planes:', error);
  //     });
  // }, [session]);

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box display={'flex'}>
              <Box flexGrow={1} >

                <CardHeader title={plan?.nombrePlan} />

              </Box>
              <Box display={'flex'} sx={{ justifyContent: 'flex-end' }} >
                <Button variant='outlined' color='info' startIcon={<Icon icon='wpf:faq' />} sx={{ mx: 2, my: 2, height: 'auto' }} onClick={() => foro()}>
                  FORO
                </Button>
                <Button variant='outlined' color='info' startIcon={<Icon icon='wpf:statistics' />} sx={{ mx: 2, my: 2, height: 'auto' }}>
                  SEGUIMIENTO
                </Button>
              </Box>
            </Box>
            <CardContent>
              <Box>
                <Card>
                  <CardContent>
                    {plan?.plan.map((day: Day, dayIndex) => (
                      <Box key={dayIndex}>
                        <h3 style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>{day.nombreDia}</h3>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Ejercicio</TableCell>
                                <TableCell>Series</TableCell>
                                <TableCell>Repeticiones</TableCell>
                                <TableCell>Peso</TableCell>
                                <TableCell align='left'>Link</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {day.Ejercicios.map((exercise, exerciseIndex) => (
                                <TableRow key={exerciseIndex}>
                                  <TableCell>{exercise.nombreEjercicio}</TableCell>
                                  <TableCell>{exercise.series}</TableCell>
                                  <TableCell>{exercise.repeticiones}</TableCell>
                                  <TableCell>{exercise.peso}</TableCell>

                                  <TableCell>
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
                                  </TableCell>


                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            </CardContent>
          </Card>
          <ButtonStyled sx={{ marginLeft: '2%' }} onClick={exportToPDF}>
            Exportar a PDF
          </ButtonStyled>
          < Foro
            foroPopUp={foroPopUp}
            setForoPopUp={setForoPopUp}
            planId={planId}
          />
        </Grid>
      </Grid >
    );
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
}

MyPlans.acl = {
  action: 'manage',
  subject: 'plans-page',
};

export default MyPlans;
