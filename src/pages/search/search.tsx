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
interface  UserDisciplineType {
  [key: string]: { icon: string}
}

const userDisciplineObj: UserDisciplineType = {
  Musculación: { icon: 'mdi:dumbbell'},
  Aeróbico: { icon: 'mdi:gymnastics'}
}


interface CellType {
  row: UsersType
}

interface SearchProps {
  genderFilter: string;
  disciplineFilter: string;
  searchTerm: any
}


const Search = ({ genderFilter, disciplineFilter, searchTerm }: SearchProps) => {
  const [users, setUsers] = useState<UsersType[]>([]);


  useEffect(() => {
    const fetchAlumnoUsers = async () => {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAlumnoUsers();
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
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
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
  const getRowId = (user: any) => user._id;

  const filterUsersByName = (users: UsersType[], name: string) => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (!genderFilter || user.gender === genderFilter) && // Si no hay filtro de género o el género coincide
      (!disciplineFilter || user.discipline === disciplineFilter) && // Si no hay filtro de disciplina o la disciplina coincide
      (!searchTerm || filterUsersByName([user], searchTerm).length > 0) // Si no hay término de búsqueda o el nombre coincide
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
