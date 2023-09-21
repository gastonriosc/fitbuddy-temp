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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
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

const createData = (nombre: string, series: number, repeticiones: number, peso: number) => {
  return { nombre, series, repeticiones, peso };
};

const initialRows = [
  createData('Press de banca plano', 4, 12, 80),
  createData('Press de banca inclinado', 3, 12, 60),
  createData('Press de banca declinado', 3, 12, 80),
  createData('Cruce de poleas', 3, 12, 25),
  createData('Remo con barra', 4, 12, 70),
];

const NewPlan = () => {
  const [planLists, setPlanLists] = useState([initialRows]);
  const [editingRow, setEditingRow] = useState([-1]);
  const [nombre, setNombre] = useState('');
  const [series, setSeries] = useState(0);
  const [repeticiones, setRepeticiones] = useState(0);
  const [peso, setPeso] = useState(0);
  const [popUp, setPopUp] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>()
  const { data: session } = useSession();
  const closePopUp = () => setPopUp(false)
  const route = useRouter();


  const textPopUp = 'Refresque la pagina para ver los cambios'

  const handleAddRow = (dayIndex: number) => {
    const newPlanLists = [...planLists];
    newPlanLists[dayIndex].push(createData('', 0, 0, 0));
    setPlanLists(newPlanLists);
    setEditingRow([...editingRow, newPlanLists[dayIndex].length - 1]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);

    planLists.forEach((day, index) => {
      if (index > 0) {
        doc.addPage(); // Agregar una página en blanco después de la primera página
      }
      doc.text(`Día ${index + 1}`, 10, 20);
      const tableData = day.map((row) => [row.nombre, row.series, row.repeticiones, row.peso]);

      // @ts-ignore
      doc.autoTable({
        head: [['Ejercicio', 'Series', 'Repeticiones', 'Peso']],
        body: tableData,
        startY: 30,
      });
    });
    doc.save('PlanDeEntrenamiento.pdf');
  };

  const handleDeleteDay = () => {
    if (planLists.length > 0) {
      const newPlanLists = [...planLists];
      newPlanLists.pop(); // Elimina el último día
      setPlanLists(newPlanLists);
      const newEditingRow = [...editingRow];
      newEditingRow.pop(); // Elimina el último índice de edición
      setEditingRow(newEditingRow);
    }
  };

  const handleEditRow = (dayIndex: number, rowIndex: number) => {
    const newEditingRow = [...editingRow];
    newEditingRow[dayIndex] = rowIndex;
    setEditingRow(newEditingRow);
  };

  const handleSaveRow = (dayIndex: number, rowIndex: number) => {
    if (nombre.trim() !== '' && series > 0 && repeticiones > 0 && peso > 0) {
      const updatedPlanLists = [...planLists];
      updatedPlanLists[dayIndex][rowIndex] = createData(nombre, series, repeticiones, peso);
      setPlanLists(updatedPlanLists);
      const newEditingRow = [...editingRow];
      newEditingRow[dayIndex] = -1;
      setEditingRow(newEditingRow);
      setNombre('');
      setSeries(0);
      setRepeticiones(0);
      setPeso(0);
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
  };

  const handleDeleteRow = (dayIndex: number, rowIndex: number) => {
    const updatedPlanLists = [...planLists];
    updatedPlanLists[dayIndex].splice(rowIndex, 1);
    setPlanLists(updatedPlanLists);
  };

  const handleAddDay = () => {
    const newPlanLists = [...planLists, []];
    setPlanLists(newPlanLists);
    setEditingRow([...editingRow, -1]);
  };


  const createPlanTraining: SubmitHandler<FieldValues> = async () => {
    const name = 'Plan de entrenamiento';
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours())
    const expirationDate = new Date(currentDate)
    expirationDate.setDate(currentDate.getDate() + 30)

    const requestBody = {
      nombrePlan: name,
      plan: planLists.map((day, dayIndex) => ({
        nombreDia: `Día ${dayIndex + 1}`,
        Ejercicios: day.map((row) => ({
          nombreEjercicio: row.nombre,
          series: row.series,
          repeticiones: row.repeticiones,
          peso: row.peso,
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
                        <StyledTableCell align='right'>Series</StyledTableCell>
                        <StyledTableCell align='right'>Repeticiones</StyledTableCell>
                        <StyledTableCell align='right'>Peso</StyledTableCell>
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
                              <>
                                <ButtonStyled onClick={() => handleSaveRow(dayIndex, rowIndex)}>Guardar</ButtonStyled>
                                <ButtonStyled onClick={() => handleCancelEditRow(dayIndex)}>Cancelar</ButtonStyled>
                              </>
                            ) : (
                              <>
                                <ButtonStyled onClick={() => handleEditRow(dayIndex, rowIndex)}>Editar</ButtonStyled>
                                <ButtonStyled onClick={() => handleDeleteRow(dayIndex, rowIndex)}>Eliminar</ButtonStyled>
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
                          <StyledTableCell align='right'>
                            <TextField
                              type='number'
                              value={peso}
                              onChange={(e) => setPeso(Number(e.target.value))}
                            />
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            <ButtonStyled onClick={() => handleSaveRow(dayIndex, day.length)}>Guardar</ButtonStyled>
                            <ButtonStyled onClick={() => handleCancelEditRow(dayIndex)}>Cancelar</ButtonStyled>
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
            <ButtonStyled sx={{ marginLeft: '2%' }} onClick={exportToPDF}>
              Exportar a PDF
            </ButtonStyled>
          </Grid>

          <Grid item md={1.2} xs={12} >
            <ButtonStyled sx={{ marginLeft: '2%' }} onClick={createPlanTraining}>
              Guardar plan
            </ButtonStyled>
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
              <Icon icon='mdi:check-circle-outline' fontSize='5.5rem' />
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

      </Grid>

    </form >

  );
};

NewPlan.acl = {
  action: 'manage',
  subject: 'newPlan-page',
};

export default NewPlan;
