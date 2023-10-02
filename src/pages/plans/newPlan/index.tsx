import React, { useState } from 'react';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell';
import Button, { ButtonProps } from '@mui/material/Button';
import TextField from '@mui/material/TextField';

//import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { Box, Dialog, DialogActions, DialogContent, Divider, FormControl, Input, InputLabel, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Icon from 'src/@core/components/icon';
import { useRouter } from 'next/router';


const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ButtonStyled = styled(Button)<ButtonProps & { component?: React.ElementType; htmlFor?: string }>(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center',
    },
  })
);

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-of-type td, &:last-of-type th': {
    border: 0,
  },
}));

const createData = (nombre: string, series: number, repeticiones: number, peso: number, link: string) => {
  return { nombre, series, repeticiones, peso, link };
};

const initialRows = [
  createData('Press de banca plano', 4, 12, 80, 'https://www.youtube.com/shorts/i14IBMNQDQQ'),
  createData('Press de banca inclinado', 3, 12, 60, 'https://www.youtube.com/shorts/SqT0lZDPm-Y'),
  createData('Press de banca declinado', 3, 12, 80, 'https://www.youtube.com/shorts/flTPZxfXwuw'),
  createData('Cruce de poleas', 3, 12, 25, 'https://www.youtube.com/shorts/B_5amA7vPbA'),
  createData('Remo con barra', 4, 12, 70, 'https://drive.google.com/drive/folders/1Ih5LM3fcFGNAQ_KNSlou-IIVjjYJT9LR'),
];

const NewPlan = () => {
  const [planLists, setPlanLists] = useState([initialRows]);
  const [editingRow, setEditingRow] = useState([-1]);
  const [nombre, setNombre] = useState('');
  const [series, setSeries] = useState(0);
  const [repeticiones, setRepeticiones] = useState(0);
  const [peso, setPeso] = useState(0);
  const [link, setLink] = useState('');
  const [popUp, setPopUp] = useState<boolean>(false)
  const [popUpError, setPopUpError] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>()
  const [titlePopUpError, setTitlePopUpError] = useState<string>()
  const [titlePopUpErrorDay, setTitlePopUpErrorDay] = useState<string>()
  const [popUpErrorDay, setPopUpErrorDay] = useState<boolean>(false)
  const [popUpErrorDataExercise, setPopUpErrorDataExercise] = useState<boolean>(false)
  const [titlePopUpErrorData, setTitlePopUpErrorDataExercise] = useState<string>()
  const [nombrePlan, setNombrePlan] = useState('');
  const [popUpErrorName, setPopUpErrorName] = useState<boolean>(false)
  const [titlePopUpErrorName, setTitlePopUpErrorName] = useState<string>()



  const { data: session } = useSession();
  const closePopUp = () => setPopUp(false)
  const closePopUpError = () => setPopUpError(false)
  const closePopUpErrorDay = () => setPopUpErrorDay(false)
  const closePopUpErrorDataExercise = () => setPopUpErrorDataExercise(false)
  const closePopUpErrorName = () => setPopUpErrorName(false)

  const route = useRouter();


  const textPopUp = 'Aguade un momento, será redirigido a la seccion de Mis Alumnos.'
  const textPopUpError = 'Por favor, intente nuevamente o elimine el día de entrenamiento en caso de no tener ejercicios.'
  const textPopUpErrorDay = 'Por favor, intente nuevamente. El plan de entrenamiento debe tener al menos un día.'
  const textPopUpErrorDataExercise = 'Por favor, intente nuevamente. Asegúrese de que la cantidad de series, repeticiones y/o peso sea un número positivo.'
  const textPopUpErrorName = 'Por favor, intente nuevamente. El nombre del plan de entrenamiento no puede estar vacío.'


  const handleAddRow = (dayIndex: number) => {
    const newPlanLists = [...planLists];
    newPlanLists[dayIndex].push(createData('', 0, 0, 0, ''));
    setPlanLists(newPlanLists);
  };

  // const exportToPDF = () => {
  //   const doc = new jsPDF();

  //   doc.setFontSize(14);

  //   planLists.forEach((day, index) => {
  //     if (index > 0) {
  //       doc.addPage();
  //     }
  //     doc.text(`Día ${index + 1}`, 10, 20);
  //     const tableData = day.map((row) => [row.nombre, row.series, row.repeticiones, row.peso, row.link]);

  //     // @ts-ignore
  //     doc.autoTable({
  //       head: [['Ejercicio', 'Series', 'Repeticiones', 'Peso', 'Link']],
  //       body: tableData,
  //       startY: 30,
  //     });
  //   });
  //   doc.save('PlanDeEntrenamiento.pdf');
  // };

  const handleDeleteDay = () => {
    if (planLists.length > 1) {
      const newPlanLists = [...planLists];
      newPlanLists.pop(); // Elimina el último día
      setPlanLists(newPlanLists);
      const newEditingRow = [...editingRow];
      newEditingRow.pop(); // Elimina el último índice de edición
      setEditingRow(newEditingRow);
    }
    else {
      setTitlePopUpErrorDay('El plan debe tener al menos un día!')
      setPopUpErrorDay(true)
    }
  };

  const handleEditRow = (dayIndex: number, rowIndex: number) => {
    const rowToEdit = planLists[dayIndex][rowIndex];
    setNombre(rowToEdit.nombre);
    setSeries(rowToEdit.series);
    setRepeticiones(rowToEdit.repeticiones);
    setPeso(rowToEdit.peso);
    setLink(rowToEdit.link);

    const newEditingRow = [...editingRow];
    newEditingRow[dayIndex] = rowIndex;
    setEditingRow(newEditingRow);
  };

  const handleSaveRow = (dayIndex: number, rowIndex: number) => {
    if (nombre.trim() !== '' && series > 0 && repeticiones > 0 && peso >= 0) {
      const updatedPlanLists = [...planLists];
      updatedPlanLists[dayIndex][rowIndex] = createData(nombre, series, repeticiones, peso, link);
      setPlanLists(updatedPlanLists);
      const newEditingRow = [...editingRow];
      newEditingRow[dayIndex] = -1;
      setEditingRow(newEditingRow);
      setNombre('');
      setSeries(0);
      setRepeticiones(0);
      setPeso(0);
      setLink('');
    }
    else {
      setTitlePopUpErrorDataExercise('Datos de ejercicios incorrectos!')
      setPopUpErrorDataExercise(true)
    }
  };

  const handleCancelEditRow = (dayIndex: number) => {
    const newEditingRow = [...editingRow];
    newEditingRow[dayIndex] = -1;
    setEditingRow(newEditingRow);
    setNombre('');
    setSeries(0);
    setRepeticiones(0);
    setPeso(0);
    setLink('');
  };

  const handleDeleteRow = (dayIndex: number, rowIndex: number) => {
    const updatedPlanLists = [...planLists];
    const day = updatedPlanLists[dayIndex];

    if (day.length > 1) { // Verificar que haya más de una fila en el día antes de eliminar
      day.splice(rowIndex, 1);
      setPlanLists(updatedPlanLists);
    }
    else {
      setTitlePopUpError('Un día al menos debe tener un ejercicio!')
      setPopUpError(true)
    }
  };


  const handleAddDay = () => {
    const newDay = [createData('Agregue aquí un ejercicio', 0, 0, 0, '')];
    const newPlanLists = [...planLists, newDay];
    setPlanLists(newPlanLists);
  };

  const createPlanTraining: SubmitHandler<FieldValues> = async () => {
    if (nombrePlan.trim() === '') {
      setTitlePopUpErrorName('El plan debe tener asignado un nombre!')
      setPopUpErrorName(true);

      return;
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())
    const expirationDate = new Date(currentDate)
    expirationDate.setDate(currentDate.getDate() + 30)

    const requestBody = {
      nombrePlan: nombrePlan,
      plan: planLists.map((day, dayIndex) => ({
        nombreDia: `Día ${dayIndex + 1}`,
        Ejercicios: day.map((row) => ({
          nombreEjercicio: row.nombre,
          series: row.series,
          repeticiones: row.repeticiones,
          peso: row.peso,
          link: row.link,
        })),
      })),
      trainerId: session?.user._id,
      studentId: route.query.id,
      subsRequestId: route.query.subsReq,
      date: currentDate.toISOString(),
      expirationDate: expirationDate.toISOString()
    };
    try {
      const res = await fetch('/api/trainingPlans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 200) {
        console.log('Plan de entrenamiento creado con éxito');
        setTitlePopUp('Plan creado con éxito!')
        setPopUp(true)
      } else {
        console.error('Error al crear el plan de entrenamiento:', res.status);
        setTitlePopUp('Error al crear el plan')
        setPopUp(true)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={6}>
        <Grid item xs={12}  >
          <Card >
            <CardHeader
              title='Nombre del plan de entrenamiento'
              sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
            />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='search-input'>Nombre</InputLabel>
                    <Input
                      fullWidth
                      value={nombrePlan}
                      id='search-input'
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 27) {
                          setNombrePlan(value);
                        }
                      }}
                      placeholder='Ingrese un nombre para buscar'
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
          </Card>
        </Grid>
        {planLists.map((day, dayIndex) => (
          <Grid item xs={12} key={dayIndex}>
            <Card>
              <CardHeader title={`Día ${dayIndex + 1}`} />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label={`customized table - day ${dayIndex}`}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Ejercicio</StyledTableCell>
                        <StyledTableCell align='right' >Series</StyledTableCell>
                        <StyledTableCell align='right'>Repeticiones</StyledTableCell>
                        <StyledTableCell align='right'>Peso</StyledTableCell>
                        <StyledTableCell align='right'>Link </StyledTableCell>
                        <StyledTableCell align='right'>Acciones</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {day.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                          <StyledTableCell component='th' scope='row'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <TextField value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            ) : (
                              row.nombre
                            )}
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <TextField
                                type='number'
                                value={series}
                                onChange={(e) => setSeries(Number(e.target.value))}
                              />
                            ) : (
                              row.series
                            )}
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <TextField
                                type='number'
                                value={repeticiones}
                                onChange={(e) => setRepeticiones(Number(e.target.value))}
                              />
                            ) : (
                              row.repeticiones
                            )}
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <TextField
                                type='number'
                                value={peso}
                                onChange={(e) => setPeso(Number(e.target.value))}
                              />
                            ) : (
                              row.peso
                            )}
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <TextField
                                type='text'
                                value={link}
                                onChange={(e) => setLink(String(e.target.value))}
                              />
                            ) : (
                              <>
                                {row.link ? (
                                  <a
                                    style={{
                                      color: 'red',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '100%',
                                      textDecoration: 'none',
                                    }}
                                    href={row.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {row.link.includes('drive.google.com') ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                      </svg>
                                    )}
                                  </a>
                                ) : (
                                  <span style={{ color: 'skyblue' }}>No se adjuntó link.</span>
                                )}
                              </>
                            )}
                          </StyledTableCell>

                          <StyledTableCell align='right'>
                            {editingRow[dayIndex] === rowIndex ? (
                              <>
                                <ButtonStyled sx={{ marginRight: '-20px' }} onClick={() => handleSaveRow(dayIndex, rowIndex)}><Icon icon='line-md:confirm' style={{ color: 'lightgreen' }} /></ButtonStyled>
                                <ButtonStyled sx={{ marginRight: '-20px' }} onClick={() => handleCancelEditRow(dayIndex)}><Icon icon='line-md:cancel' style={{ color: 'red' }} /></ButtonStyled>
                              </>
                            ) : (
                              <>
                                <ButtonStyled sx={{ marginRight: '-20px' }} onClick={() => handleEditRow(dayIndex, rowIndex)}><Icon icon='mdi:pencil' /></ButtonStyled>
                                <ButtonStyled sx={{ marginRight: '-20px', color: 'red' }} onClick={() => handleDeleteRow(dayIndex, rowIndex)}><Icon icon='mdi:trash' /></ButtonStyled>
                              </>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                      {editingRow[dayIndex] === day.length && (
                        <StyledTableRow>
                          <StyledTableCell component='th' scope='row'>
                            <TextField value={nombre} onChange={(e) => setNombre(e.target.value)} />
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            <TextField
                              type='number'
                              value={series}
                              onChange={(e) => setSeries(Number(e.target.value))}
                            />
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            <TextField
                              type='number'
                              value={repeticiones}
                              onChange={(e) => setRepeticiones(Number(e.target.value))}
                            />
                          </StyledTableCell>
                          <StyledTableCell >
                            <TextField
                              type='number'
                              value={peso}
                              onChange={(e) => setPeso(Number(e.target.value))}
                            />
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            <TextField
                              type='text'
                              value={link}
                              onChange={(e) => setLink(String(e.target.value))}
                            />
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            <ButtonStyled sx={{ color: 'black' }} onClick={() => handleSaveRow(dayIndex, day.length)}>Guardar</ButtonStyled>
                            <ButtonStyled sx={{ color: 'black' }} onClick={() => handleCancelEditRow(dayIndex)}>Cancelar</ButtonStyled>
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                  <CardContent>
                    <ButtonStyled variant='contained' onClick={() => handleAddRow(dayIndex)}>
                      Agregar Ejercicio
                    </ButtonStyled>
                  </CardContent>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid container justifyContent='space-between'>
          <Grid item md={6} xs={12} >
            <ButtonStyled sx={{ marginLeft: '2%' }} onClick={handleAddDay}>
              Agregar Día
            </ButtonStyled>
            <ButtonStyled sx={{ marginLeft: '2%' }} onClick={handleDeleteDay}>
              Eliminar Día
            </ButtonStyled>
            {/* <ButtonStyled sx={{ marginLeft: '2%' }} onClick={exportToPDF}>
              Exportar a PDF
            </ButtonStyled> */}
          </Grid>

          <Grid item md={1.2} xs={12} >
            <ButtonStyled sx={{ marginLeft: '2%' }} onClick={createPlanTraining}>
              Guardar plan
            </ButtonStyled>
          </Grid>
        </Grid>
        {/* PopUp de confirmacion de creacion de plan */}
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

            <Button href={'/myStudents/' + session?.user._id} variant='outlined' color='success' onClick={closePopUp}>
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
        {/* PopUp Error de datos de ejercicio*/}
        <Dialog fullWidth open={popUpErrorDataExercise} onClose={closePopUpErrorDataExercise} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpErrorData}</Typography>
              <Typography>{textPopUpErrorDataExercise}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUpErrorDataExercise}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        {/* PopUp Error no carga el nombre*/}
        <Dialog fullWidth open={popUpErrorName} onClose={closePopUpErrorName} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
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
              <Typography variant='h4' sx={{ mb: 5 }}>{titlePopUpErrorName}</Typography>
              <Typography>{textPopUpErrorName}</Typography>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >

            <Button variant='outlined' color='success' onClick={closePopUpErrorName}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

      </Grid>

    </form >

  );
};

NewPlan.acl = {
  action: 'manage',
  subject: 'newPlan-page',
};

export default NewPlan;

