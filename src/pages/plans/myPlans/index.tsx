import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Pagination } from '@mui/material';

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
  const [plans, setPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para controlar la página actual
  const plansPerPage = 1; // Cantidad de planes por página

  const session = useSession();

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  // Calcular el índice inicial y final de los planes en la página actual
  const startIndex = (currentPage - 1) * plansPerPage;
  const endIndex = startIndex + plansPerPage;
  const plansToDisplay = plans.slice(startIndex, endIndex);

  useEffect(() => {
    const studentId = session.data?.user._id;

    fetch(`/api/trainingPlans?studentId=${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        setPlans(data);
        console.log('Planes obtenidos:', data);
      })
      .catch((error) => {
        console.error('Error al obtener los planes:', error);
      });
  }, [session]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Mis Planes de Entrenamiento" />
          <CardContent>
            {plansToDisplay.length > 0 ? (
              plansToDisplay.map((plan: Plan, planIndex) => (
                <div key={planIndex}>
                  <Card>
                    <CardHeader
                      title={
                        <div>
                          <span style={{ textDecoration: 'underline', textUnderlineOffset: '5px' }}>Nombre:</span> {plan.nombrePlan}
                        </div>
                      }
                    />
                    <CardContent>
                      {plan.plan.map((day: Day, dayIndex) => (
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
              ))
            ) : (
              <Card sx={{ mt: 2, height: 70, justifyContent: 'center', alignContent: 'center' }}>
                <CardHeader title="No tenes planes por el momento." />
              </Card>
            )}

            {/* Paginador */}
            {plans.length >= plansPerPage && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={Math.ceil(plans.length / plansPerPage)} color='primary' page={currentPage} onChange={handlePageChange} />
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

MyPlans.acl = {
  action: 'manage',
  subject: 'myPlans-page',
};

export default MyPlans;
