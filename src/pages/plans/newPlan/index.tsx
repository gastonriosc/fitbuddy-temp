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

// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

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
        <Grid item md={6} xs={12}>
          <ButtonStyled onClick={handleAddDay}>
            Agregar Día
          </ButtonStyled>
          <ButtonStyled onClick={handleDeleteDay}>
            Eliminar Día
          </ButtonStyled>
          <ButtonStyled onClick={exportToPDF}>
            Exportar a PDF
          </ButtonStyled>
        </Grid>
      </Grid>
    </form>
  );
};

NewPlan.acl = {
  action: 'manage',
  subject: 'newPlan-page',
};

export default NewPlan;
