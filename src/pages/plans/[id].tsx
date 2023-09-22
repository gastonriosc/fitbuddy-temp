import { useState, useEffect } from 'react';
import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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
}


const MyPlans = () => {
  const [plan, setPlan] = useState<Plan>();

  // const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const route = useRouter();

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
  }, []); // Actualizar cuando cambie la página actual

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
            <CardHeader title="Mis Planes de Entrenamiento" />
            <CardContent>
              <div>
                <Card>
                  <CardHeader title={plan?.nombrePlan} />
                  <CardContent>
                    {plan?.plan.map((day: Day, dayIndex) => (
                      <div key={dayIndex}>
                        <h3 style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>{day.nombreDia}</h3>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Ejercicio</TableCell>
                                <TableCell>Series</TableCell>
                                <TableCell>Repeticiones</TableCell>
                                <TableCell>Peso</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {day.Ejercicios.map((exercise, exerciseIndex) => (
                                <TableRow key={exerciseIndex}>
                                  <TableCell>{exercise.nombreEjercicio}</TableCell>
                                  <TableCell>{exercise.series}</TableCell>
                                  <TableCell>{exercise.repeticiones}</TableCell>
                                  <TableCell>{exercise.peso}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
