// ** React Imports
import { useState } from 'react'
import TextField from '@mui/material/TextField'

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


const UserList = () => {
  // ** State:  (gender, discipline, searchTerm) son variables de estado que almacenan el valor seleccionado en el campo de género, disciplina y el de nombre. setGender, setDiscipline, setSearchTerm son funciones que permiten actualizar el valor de las variables de estado de geneder, discipline y searchTerm.
  const [gender, setGender] = useState<string>('');
  const [discipline, setDiscipline] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('');
  const [following, setFollowing] = useState<string>('');

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

  const handleDaysPerWeekChange = (e: SelectChangeEvent) => {
    setDaysPerWeek(e.target.value)
  }

  const handleIntensityChange = (e: SelectChangeEvent) => {
    setIntensity(e.target.value)
  }

  const handleFollowingChange = (e: SelectChangeEvent) => {
    setFollowing(e.target.value)
  }



  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title='Filtros' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} /> */}
          <CardContent>
            <CardHeader subheader='Filtros entrenadores' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' }, mt: -7 }} />
            <Grid container spacing={6} >
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='gender-select'>Género</InputLabel>
                  <Select
                    fullWidth
                    value={gender}
                    id='select-gender'
                    label='Genero'
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
                    label='Disciplina'
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
                  <TextField
                    fullWidth
                    value={searchTerm}
                    id='search-input'
                    label='Ingrese un nombre'
                    onChange={handleSearchChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <CardHeader subheader='Filtros suscripciones' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
            <Grid container spacing={6} >
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='days-select'>Días por semana</InputLabel>
                  <Select
                    fullWidth
                    value={daysPerWeek}
                    id='select-days'
                    label='Días por semana'
                    labelId='days-select'
                    onChange={handleDaysPerWeekChange}
                  >
                    <MenuItem value=''>Seleccione nº de días</MenuItem>
                    <MenuItem value='1'>1</MenuItem>
                    <MenuItem value='2'>2</MenuItem>
                    <MenuItem value='3'>3</MenuItem>
                    <MenuItem value='4'>4</MenuItem>
                    <MenuItem value='5'>5</MenuItem>
                    <MenuItem value='6'>6</MenuItem>
                    <MenuItem value='7'>7</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='intensity-select'>Intensidad</InputLabel>
                  <Select
                    fullWidth
                    value={intensity}
                    id='select-intensity'
                    label='Intensidad'
                    labelId='intensity-select'
                    onChange={handleIntensityChange}
                  >
                    <MenuItem value=''>Seleccione intensidad</MenuItem>
                    <MenuItem value='baja'>Baja</MenuItem>
                    <MenuItem value='media'>Media</MenuItem>
                    <MenuItem value='alta'>Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='following-select'>Seguimiento</InputLabel>
                  <Select
                    fullWidth
                    value={following}
                    id='select-following'
                    label='Seguimiento'
                    labelId='following-select'
                    onChange={handleFollowingChange}
                  >
                    <MenuItem value=''>Seleccione Disciplina</MenuItem>
                    <MenuItem value='bajo'>Bajo</MenuItem>
                    <MenuItem value='intermedio'>Intermedio</MenuItem>
                    <MenuItem value='alto'>Alto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
          </CardContent>
          <Divider />
          {/*  Componente Search */}
          <Search genderFilter={gender} disciplineFilter={discipline} searchTerm={searchTerm} daysPerWeek={daysPerWeek} intensity={intensity} following={following} />
        </Card>
      </Grid>
    </Grid >
  );
};

export default UserList;

UserList.acl = {
  action: 'manage',
  subject: 'search-page'
}


