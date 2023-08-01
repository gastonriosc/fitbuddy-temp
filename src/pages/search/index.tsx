// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'

//import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

//import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'

//import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

//import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Custom Table Components Imports

import Search from './search'
import { Input } from '@mui/material'


const UserList = () => {
  // ** State:  (gender, discipline, searchTerm) son variables de estado que almacenan el valor seleccionado en el campo de género, disciplina y el de nombre. setGender, setDiscipline, setSearchTerm son funciones que permiten actualizar el valor de las variables de estado de geneder, discipline y searchTerm.
  const [gender, setGender] = useState<string>('');
  const [discipline, setDiscipline] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  //Esta es una función de manejo de eventos que se llama cada vez que hay un cambio en el campo de búsqueda (nombre). Cuando el usuario ingresa texto en el campo de nombre, esta función se activa y actualiza el estado searchTerm con el valor ingresado.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenderChange = (e: SelectChangeEvent) => {
    setGender(e.target.value);
  };

  //Esta función y la de arriba, actualizan los estados gender y discipline con los valores seleccionados por el usuario, haciendo que cuando seleccione un genero o una disciplina del Select se actualice..
  const handleDisciplineChange = (e: SelectChangeEvent) => {
    setDiscipline(e.target.value)
  }

  return (
    <Grid container spacing={6}>
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
          {/*  Componente Search */}
          <Search genderFilter={gender} disciplineFilter={discipline} searchTerm={searchTerm} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserList;

UserList.acl = {
  action: 'manage',
  subject: 'search-page'
}


