// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, FieldValues } from 'react-hook-form'
import Card from '@mui/material/Card'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import TrackingPopUp from '../plans/tracking/trackingPopUp'

interface StudentInsightItem {
  _id: string;
  name: string;
  dataOfItem: StudentInsightDataOfItem[];
}

interface StudentInsightDataOfItem {
  _id: string;
  date: Date;
  weight: number;
  deleted: boolean;
}

interface Props {
  data: StudentInsightItem

  // setDataPeso: (val: any) => void

  // dataId: string
}

const DataTable = (props: Props) => {

  const { data } = props;
  console.log(data)

  // const [dataPeso, setDataPeso] = useState<StudentInsightItem | any>()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDeleteRegistro, setOpenDeleteRegistro] = useState<boolean>(false)
  const [registroABorrar, setRegistroABorrar] = useState<StudentInsightDataOfItem>()
  const [popUp, setPopUp] = useState<boolean>(false)
  const [titlePopUp, setTitlePopUp] = useState<string>('')
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.dataOfItem.length / itemsPerPage);
  const currentEndDate = new Date();
  currentEndDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 0);

  const id = data._id
  const route = useRouter()

  const borrarRegistroPeso = (registroId: StudentInsightDataOfItem) => {
    setRegistroABorrar(registroId)
    setOpenDeleteRegistro(true)
  }

  const hadleCloseDeleteRegistroPopUp = () => {
    setOpenDeleteRegistro(false)
  }

  const createRegistro: SubmitHandler<FieldValues> = async () => {
    const dataId = id

    const requestBody = {
      isDelete: true,
      id: dataId,
      dataOfItem: {
        _id: registroABorrar?._id,
        date: registroABorrar?.date,
        weight: registroABorrar?.weight,
        deleted: true

      }
    };

    console.log(requestBody)
    try {
      const res = await fetch('/api/studentInsights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      if (res.status == 200) {
        const data = await res.json();
        const registroR = data;
        console.log('registro', registroR);
        setTitlePopUp('Peso borrado con éxito!');
        hadleCloseDeleteRegistroPopUp()
        setPopUp(true)

        // setDataPeso(registroR)


      }
      if (res.status == 404) {
        route.replace('/404');
      }
      if (res.status == 500) {
        route.replace('/500');
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    < >
      <Box sx={{ width: { xs: '100%', md: '100%', lg: '25%' }, padding: 1, mt: 4, height: '466px' }}>
        <Card sx={{ height: '466px' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>

                  <TableCell style={{ textAlign: 'center' }}>Fecha</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Peso</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.dataOfItem ? (
                  data.dataOfItem
                    .sort((a: any, b: any) => new Date(b.date) - new Date(a.date))
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((dataItem: StudentInsightDataOfItem) => (
                      <TableRow key={dataItem._id}>
                        <TableCell style={{ textAlign: 'center' }}>
                          {dataItem.date && new Date(dataItem.date).toLocaleDateString('es')}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {dataItem.weight} kg
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Icon icon='mdi:delete' onClick={() => borrarRegistroPeso(dataItem)} />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
          <Box className='demo-space-y' mt={2} alignItems={'center'} justifyContent='center' display={'flex'}>
            <Pagination count={totalPages} color='primary' page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
          </Box>

        </Card>
      </Box >

      <Dialog fullWidth open={openDeleteRegistro} onClose={hadleCloseDeleteRegistroPopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
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
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='line-md:alert' fontSize='5.5rem' />
            <Typography variant='h5' sx={{ mb: 5 }}>¿Seguro que deseas borrar el registro?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={createRegistro}>
            Confirmar
          </Button>
          <Button variant='outlined' color='secondary' onClick={hadleCloseDeleteRegistroPopUp} >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <TrackingPopUp trackingPopUp={popUp} setTrackingPopUp={setPopUp} title={titlePopUp}></TrackingPopUp>
    </ >
  )
};


DataTable.acl = {
  action: 'manage',
  subject: 'studentInsights-page'
}


export default DataTable
