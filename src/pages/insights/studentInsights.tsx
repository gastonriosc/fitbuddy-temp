// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChartRegistroPesos from './charts/chartRegistroPesos'
import DataTable from './dataTable'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress';
import NewInsight from './newInsight'
import Icon from 'src/@core/components/icon'
import ChartEntrenamientosSemanales from './charts/chartEntrenamientosSem'

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

interface StudentInsight {
  _id: string;
  studentId: string;
  data: StudentInsightItem[];
}

const StudentInsight = () => {



  const [nuevoRegistro, setNuevoRegistro] = useState<boolean>(false)
  const [insights, setInsights] = useState<string[]>([])
  const [dataPeso, setDataPeso] = useState<StudentInsightItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const route = useRouter()
  useEffect(() => {
    const fetchMyTracking = async () => {
      const id = route.query.id;
      try {
        const res = await fetch(
          `/api/studentInsights/?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setDataPeso(data.dataPeso)
          setInsights(data.dataTracking)
          setIsLoading(true)
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

    fetchMyTracking();
  }, [route, dataPeso]);


  if (isLoading) {
    return (
      <Grid >
        <Card sx={{ padding: '5', ml: 1, mr: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
          <Box ml={5} >
            <h2 style={{ fontSize: '24px', textTransform: 'uppercase' }}>Métricas </h2>
            {/* <p>Su peso al registrarse en FitBuddy fue de {userPeso}</p> */}
          </Box>
          <Box sx={{ mx: 4, my: 4, justifyContent: 'right' }} >

            <Button sx={{ mx: 4, my: 4 }} variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setNuevoRegistro(true)}>
              Registro
            </Button>
          </Box>




        </Card>
        <Box sx={{}}>
          <div>
            {dataPeso && dataPeso.length > 0 && (
              dataPeso.map((item: StudentInsightItem) => (
                <Box key={item._id} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column', lg: 'row' } }}>
                  <Box sx={{ width: { xs: '100%', md: '100%', lg: '75%' }, padding: 1, mt: 4 }}>
                    <ChartRegistroPesos direction='ltr' data={item}></ChartRegistroPesos>
                  </Box>

                  <DataTable data={dataPeso} />

                </Box>
              ))
            )}
          </div>



          <NewInsight nuevoRegistro={nuevoRegistro} setNuevoRegistro={setNuevoRegistro} dataPeso={dataPeso} setDataPeso={setDataPeso} />
          <Box sx={{ mt: 5 }}>
            <ChartEntrenamientosSemanales insights={insights}></ChartEntrenamientosSemanales>
          </Box >
        </Box >

      </Grid >
    )
  } else {
    return (
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress size={100} thickness={6} color='primary' />
      </Box>
    );
  }
};


StudentInsight.acl = {
  action: 'manage',
  subject: 'studentInsights-page'
}


export default StudentInsight
