// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, esES } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Types Imports
import { UsersType } from 'src/types/apps/userTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, CircularProgress } from '@mui/material'
import { getInitials } from 'src/@core/utils/get-initials'
import { useSession } from 'next-auth/react'

// iconos
interface UserDisciplineType {
  [key: string]: { icon: string }
}

const userDisciplineObj: UserDisciplineType = {
  Musculación: { icon: 'mdi:dumbbell' },
  Aeróbico: { icon: 'mdi:gymnastics' }
}


interface CellType {
  row: UsersType;                                                   //Va ser del tipo UsersType
}

interface SearchProps {
  genderFilter: string;
  disciplineFilter: string;
  searchTerm: any;
  daysPerWeek: string;
  following: string;
  intensity: string;
}

interface SubscriptionData {
  daysPerWeek: number;
  intensity: string;
  following: string;
}

interface TrainerData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  discipline: string;
  gender: string;
  country: string;
  avatar: string;
  subscriptions: SubscriptionData[];
}


const renderClient = (row: UsersType) => {
  if (row.avatar) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.name)}
      </CustomAvatar>
    )
  }
}


// El componente Search recibe tres propiedades como argumentos (genderFilter, disciplineFilter y searchTerm), que se utilizan para filtrar los usuarios.
const Search = ({ genderFilter, disciplineFilter, searchTerm, daysPerWeek, following, intensity }: SearchProps) => {
  const [users, setUsers] = useState<TrainerData[]>([]);   //Users es un array del tipo UsersType[]. Podria tambien solamente ser del tipo []
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const session = useSession()

  useEffect(() => {
    setIsLoading(true)
    const fetchAlumnoUsers = async () => {              //Funcion asincrona que hace la llamada a la API de students.
      try {
        const response = await fetch('/api/trainerSearch');
        const data = await response.json();
        console.log(data)
        setUsers(data);          //Cargamos users con la data que viene de la solicitud a la API.
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAlumnoUsers();                                 //Se llama a la función fetchAlumnoUsers dentro de useEffect. Esto asegura que la llamada a la API se realice solo una vez
  }, []);


  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 280,
      field: 'name',
      headerName: 'Nombre',
      renderCell: ({ row }: CellType) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography color={'lightgray'} noWrap variant='body2'>
                <b>{name}</b>
              </Typography>
            </Box>
          </Box>
        );
      }
    },


    {
      flex: 0.2,
      minWidth: 200,
      field: 'gender',
      headerName: 'Genero',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography color={'lightgray'} noWrap variant='body2'>
            <b>{row.gender}</b>
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'discipline',
      headerName: 'Disciplina',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={userDisciplineObj[row.discipline].icon} fontSize={20} />
            <Typography color={'lightgray'} noWrap variant='body2'>
              <b>{row.discipline}</b>
            </Typography>
          </Box>

        );
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'country',
      headerName: 'Pais',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography color={'lightgray'} noWrap variant='body2'>
            <b>{row.country}</b>
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'observe',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row._id !== session?.data?.user._id && (
              <Button href={'/myProfile/' + row._id}>
                <Icon icon={'mdi:eye-outline'} fontSize={20} />
              </Button>
            )}
          </Typography>
        );
      }
    },

  ];

  const getRowId = (user: any) => user._id;                                 // La función getRowId  se utiliza para identificar de manera única cada fila de datos dentro de la tabla. Cuando el usuario interactúa con la tabla (por ejemplo, seleccionando una fila o actualizando los datos), el componente necesita saber qué fila específica está siendo afectada

  const filterUsersByName = (users: TrainerData[], name: string) => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (!genderFilter || user.gender === genderFilter) &&
      (!disciplineFilter || user.discipline === disciplineFilter) &&
      (!searchTerm || filterUsersByName([user], searchTerm).length > 0) &&
      (
        (!daysPerWeek && !intensity && !following) ||
        user.subscriptions.some(
          (subscription) =>
            (!daysPerWeek || subscription.daysPerWeek.toString() === daysPerWeek) &&
            (!intensity || subscription.intensity === intensity) &&
            (!following || subscription.following === following)
        )
      )
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <DataGrid localeText={esES.components.MuiDataGrid.defaultProps.localeText} rows={filteredUsers} columns={columns} getRowId={getRowId} />
      )}
    </div>
  );
};

export default Search;

Search.acl = {
  action: 'manage',
  subject: 'search-page'
}
