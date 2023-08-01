// ** React Imports
// import { useState, useEffect, MouseEvent, useCallback } from 'react'
import { useState } from 'react'

// ** Next Imports
//import Link from 'next/link'

// ** MUI Imports
//import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

//import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

//import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'

//import IconButton from '@mui/material/IconButton'

//import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

//import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
//import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
//import CustomChip from 'src/@core/components/mui/chip'
//import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
//import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
//import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
//import axios from 'axios'

// ** Types Imports
//import { RootState , AppDispatch } from 'src/store'
//import { ThemeColor } from 'src/@core/layouts/types'
//import { UsersType } from 'src/types/apps/userTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
//import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import Search from './search'
import { Input } from '@mui/material'




const UserList = ({ apiData }) => {
  // ** State
  const [gender, setGender] = useState<string>('');
  const [discipline, setDiscipline] = useState<string>('');

  //const [value, setValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);


  // const handleFilter = useCallback((val: string) => {
  //   setValue(val)
  // }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenderChange = (e: SelectChangeEvent) => {
    setGender(e.target.value);
  };

  const handleDisciplineChange = (e: SelectChangeEvent) => {
    setDiscipline(e.target.value)
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontal.map((item: CardStatsHorizontalProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filtros' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='gender-select'>Género</InputLabel>
                  <Select
                    fullWidth
                    value={gender}
                    id='select-gender'
                    label='Select gender'
                    labelId='gender-select'
                    onChange={handleGenderChange}
                    inputProps={{ placeholder: 'Selecciona un género' }}
                  >
                    <MenuItem value=''>Seleccione un género</MenuItem>
                    <MenuItem value='Masculino'>Masculino</MenuItem>
                    <MenuItem value='Femenino'>Femenino</MenuItem>
                    <MenuItem value='Otro'>Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='discipline-select'>Disciplina</InputLabel>
                  <Select
                    fullWidth
                    value={discipline}
                    id='select-discipline'
                    label='Select discipline'
                    labelId='discipline-select'
                    onChange={handleDisciplineChange}
                    inputProps={{ placeholder: 'Selecciona una disciplina' }}
                  >
                    <MenuItem value=''>Seleccione Disciplina</MenuItem>
                    <MenuItem value='Musculación'>Musculación</MenuItem>
                    <MenuItem value='Aeróbico'>Aeróbico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='search-input'>Nombre</InputLabel>
                  <Input
                    fullWidth
                    value={searchTerm}
                    id='search-input'
                    onChange={handleSearchChange}
                    placeholder='Ingrese un nombre para buscar'
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}

          {/*  Componente Search */}
          <Search genderFilter={gender} disciplineFilter={discipline} searchTerm={searchTerm} />
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};


export default UserList;


UserList.acl = {
  action: 'manage',
  subject: 'search-page'
}


