// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Types Imports
import { UsersType } from 'src/types/apps/userTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
}


// El componente Search recibe tres propiedades como argumentos (genderFilter, disciplineFilter y searchTerm), que se utilizan para filtrar los usuarios.
const Search = ({ genderFilter, disciplineFilter, searchTerm }: SearchProps) => {
  const [users, setUsers] = useState<UsersType[]>([]);   //Users es un array del tipo UsersType[]. Podria tambien solamente ser del tipo []


  useEffect(() => {
    const fetchAlumnoUsers = async () => {              //Funcion asincrona que hace la llamada a la API de students.
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setUsers(data);                                 //Cargamos users con la data que viene de la solicitud a la API.
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAlumnoUsers();                                 //Se llama a la función fetchAlumnoUsers dentro de useEffect. Esto asegura que la llamada a la API se realice solo una vez
  }, []);


  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'name',
      headerName: 'Nombre',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap variant='body2'>
                <b>{row.name}</b>
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            <b>{row.email}</b>
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'phoneNumber',
      headerName: 'Telefono',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            <b>{row.phone}</b>
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'gender',
      headerName: 'Genero',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            <b>{row.gender}</b>
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'discipline',
      headerName: 'Disciplina',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={userDisciplineObj[row.discipline].icon} fontSize={20} />
            <Typography noWrap variant='body2'>
              <b>{row.discipline}</b>
            </Typography>
          </Box>

        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'country',
      headerName: 'Pais',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            <b>{row.country}</b>
          </Typography>
        );
      }
    },
  ];

  const getRowId = (user: any) => user._id;                                 // La función getRowId  se utiliza para identificar de manera única cada fila de datos dentro de la tabla. Cuando el usuario interactúa con la tabla (por ejemplo, seleccionando una fila o actualizando los datos), el componente necesita saber qué fila específica está siendo afectada

  const filterUsersByName = (users: UsersType[], name: string) => {         //Esta función realiza una búsqueda de usuarios dentro de un array de usuarios (users) en base a un nombre (name) dado como parámetro
    return users.filter((user) =>                                           // Recibe dos parámetros: users (array de usuarios) y name (nombre a buscar). Utiliza el método filter en el array de usuarios (users). El método filter crea un nuevo array con todos los elementos que cumplan con la condición especificada.
      user.name.toLowerCase().includes(name.toLowerCase())                  // Para cada usuario en el array, se compara el nombre del usuario (convertido a minúsculas) con el nombre de búsqueda (también convertido a minúsculas) utilizando includes.
    );
  };

  const filteredUsers = users.filter(                                     //Users es el array cargado que viene con los datos de la consulta a la API.
    (user) =>
      (!genderFilter || user.gender === genderFilter) &&                  // Si no hay filtro de género o el género coincide
      (!disciplineFilter || user.discipline === disciplineFilter) &&      // Si no hay filtro de disciplina o la disciplina coincide
      (!searchTerm || filterUsersByName([user], searchTerm).length > 0)   // Si no hay término de búsqueda o el nombre coincide. Para verificar si el nombre coincide, utiliza la función filterUsersByName para filtrar un array que solo contiene el usuario actual ([user]), comparando con el searchTerm, que es lo que va comparando a medida que se va escribiendo.
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={filteredUsers} columns={columns} getRowId={getRowId} />
    </div>
  );

};

export default Search;

Search.acl = {
  action: 'manage',
  subject: 'search-page'
}
