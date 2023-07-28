// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'


// ** Types Imports

import { UsersType } from 'src/types/apps/userTypes'



interface CellType {
  row: UsersType
}


const Search = () => {
  const [users, setUsers] = useState([]);

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
      field: 'name', // Assuming this field exists in the user data
      headerName: 'Name',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap variant='caption'>
                {row.name}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'email', // Assuming this field exists in the user data
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'phoneNumber', // Assuming this field exists in the user data
      headerName: 'PhoneNumber',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.phone}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'gender', // Assuming this field exists in the user data
      headerName: 'Gender',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.gender}
          </Typography>
        );
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'country', // Assuming this field exists in the user data
      headerName: 'Country',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.country}
          </Typography>
        );
      }
    },
  ];
  const getRowId = (user: any) => user._id;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={users} columns={columns} getRowId={getRowId} />
    </div>
  );

};

export default Search;

Search.acl = {
  action: 'manage',
  subject: 'search-page'
}
