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
const rows = [
  createData('Press de banca plano', 4, 12, 80),
  createData('Press de banca inclinado', 3, 12, 60),
  createData('Press de banca declinado', 3, 12, 80),
  createData('Cruce de poleas', 3, 12, 25),
  createData('Remo con barra', 4, 12, 70),
];

const newPlan = () => {
  const [planList, setPlanList] = useState(rows);
  const [editingRow, setEditingRow] = useState(-1);
  const [nombre, setNombre] = useState('');
  const [series, setSeries] = useState(0);
  const [repeticiones, setRepeticiones] = useState(0);
  const [peso, setPeso] = useState(0);


  const handleAddRow = () => {
    setEditingRow(planList.length); // Establece el índice de edición en la longitud actual de la lista
    setNombre('');
    setSeries(0);
    setRepeticiones(0);
    setPeso(0);
  };


  const handleEditRow = (rowIndex: number) => {
    setEditingRow(rowIndex);
  };

  const handleSaveRow = () => {
    if (nombre.trim() !== '' && series > 0 && repeticiones > 0 && peso > 0) {
      const updatedPlanList = [...planList];
      updatedPlanList[editingRow] = createData(
        nombre,
        series,
        repeticiones,
        peso
      );
      setPlanList(updatedPlanList);
      setEditingRow(null);
      setNombre('');
      setSeries(0);
      setRepeticiones(0);
      setPeso(0);
    }
  };


  const handleCancelEditRow = () => {
    setEditingRow(null);
    setNombre('');
    setSeries(0);
    setRepeticiones(0);
    setPeso(0);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedPlanList = [...planList];
    updatedPlanList.splice(rowIndex, 1);
    setPlanList(updatedPlanList);
  };



  return (
    <Grid container spacing={6}>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Planes' />
          <CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    // <TableContainer component={Paper}>
    //   <Card>
    //     <CardHeader title='Planes' />
    //     <Table sx={{ minWidth: 700 }} aria-label='customized table'>
    //       <TableHead>
    //         <TableRow>
    //           <StyledTableCell>Ejercicio</StyledTableCell>
    //           <StyledTableCell align='right'>Series</StyledTableCell>
    //           <StyledTableCell align='right'>Repeticiones</StyledTableCell>
    //           <StyledTableCell align='right'>Peso</StyledTableCell>
    //           <StyledTableCell align='right'>Acciones</StyledTableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {planList.map((row, index) => (
    //           <StyledTableRow key={index}>
    //             <StyledTableCell component='th' scope='row'>
    //               {editingRow === index ? (
    //                 <TextField
    //                   value={nombre}
    //                   onChange={(e) => setNombre(e.target.value)}
    //                 />
    //               ) : (
    //                 row.nombre
    //               )}
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               {editingRow === index ? (
    //                 <TextField
    //                   type='number'
    //                   value={series}
    //                   onChange={(e) => setSeries(Number(e.target.value))}
    //                 />
    //               ) : (
    //                 row.series
    //               )}
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               {editingRow === index ? (
    //                 <TextField
    //                   type='number'
    //                   value={repeticiones}
    //                   onChange={(e) => setRepeticiones(Number(e.target.value))}
    //                 />
    //               ) : (
    //                 row.repeticiones
    //               )}
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               {editingRow === index ? (
    //                 <TextField
    //                   type='number'
    //                   value={peso}
    //                   onChange={(e) => setPeso(Number(e.target.value))}
    //                 />
    //               ) : (
    //                 row.peso
    //               )}
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               {editingRow === index ? (
    //                 <>
    //                   <ButtonStyled onClick={handleSaveRow}>Guardar</ButtonStyled>
    //                   <ButtonStyled onClick={handleCancelEditRow}>Cancelar</ButtonStyled>
    //                 </>
    //               ) : (
    //                 <>
    //                   <ButtonStyled onClick={() => handleEditRow(index)}>Editar</ButtonStyled>
    //                   <ButtonStyled onClick={() => handleDeleteRow(index)}>Eliminar</ButtonStyled>
    //                 </>
    //               )}
    //             </StyledTableCell>
    //           </StyledTableRow>
    //         ))}
    //         {editingRow === planList.length && (
    //           <StyledTableRow>
    //             <StyledTableCell component='th' scope='row'>
    //               <TextField
    //                 value={nombre}
    //                 onChange={(e) => setNombre(e.target.value)}
    //               />
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               <TextField
    //                 type='number'
    //                 value={series}
    //                 onChange={(e) => setSeries(Number(e.target.value))}
    //               />
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               <TextField
    //                 type='number'
    //                 value={repeticiones}
    //                 onChange={(e) => setRepeticiones(Number(e.target.value))}
    //               />
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               <TextField
    //                 type='number'
    //                 value={peso}
    //                 onChange={(e) => setPeso(Number(e.target.value))}
    //               />
    //             </StyledTableCell>
    //             <StyledTableCell align='right'>
    //               <ButtonStyled onClick={handleSaveRow}>Guardar</ButtonStyled>
    //               <ButtonStyled onClick={handleCancelEditRow}>Cancelar</ButtonStyled>
    //             </StyledTableCell>
    //           </StyledTableRow>
    //         )}
    //       </TableBody>
    //     </Table>
    //     <CardContent>
    //       <ButtonStyled variant='contained' onClick={handleAddRow}>
    //         Agregar Ejercicio
    //       </ButtonStyled>
    //     </CardContent>
    //   </Card>
    // </TableContainer>
  );
};

newPlan.acl = {
  action: 'manage',
  subject: 'newPlan-page',
};

export default newPlan;


