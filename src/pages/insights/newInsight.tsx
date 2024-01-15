// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Divider, TextField } from '@mui/material';
import DatePicker from 'react-datepicker'
import { format, addDays } from 'date-fns';
import TrackingPopUp from '../plans/tracking/trackingPopUp'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from '../../views/forms/form-elements/pickers/PickersCustomInput'


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

interface FormData {
    name: string
    date: Date
    weight: number
}

const schema = yup.object().shape({
    weight: yup.number().required("El peso es un campo obligatorio").max(400, "Maximo 400kg").min(1, "Minimo 1kg"),
    name: yup.string().required("El nombre es un campo obligatorio").max(30, "Maximo 30 dígitos").min(1, "Minimo 1 dígito")
})

type Props = {
    nuevoRegistro: boolean
    setNuevoRegistro: (val: boolean) => void
    dataPeso: StudentInsightItem[]
    setDataPeso: (val: any) => void

    // dataId: string
}

const NewInsight = (props: Props) => {

    const { nuevoRegistro, setNuevoRegistro, dataPeso, setDataPeso } = props

    const today = new Date();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            date: today,
            weight: undefined,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const [isDuplicateName, setIsDuplicateName] = useState(false);
    const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
    const [titlePopUp, setTitlePopUp] = useState<string>('')
    const currentEndDate = new Date();
    currentEndDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 0);


    // const formatDate = (date: Date): string => {
    //     const day = date.getDate().toString().padStart(2, '0');
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const year = date.getFullYear().toString().slice(-2);

    //     return `${day}/${month}/${year}`;
    // };

    const route = useRouter()

    const handlePopUpNuevoRegistro = () => {
        setNuevoRegistro(false)
    }

    const createRegistro: SubmitHandler<FieldValues> = async (data) => {
        const studentId = route.query.id
        const { name, date, weight } = data;

        const isDuplicate = dataPeso?.some((item: any) => {
            return item.name.toLowerCase() === name.toLowerCase();
        });

        if (isDuplicate) {
            setIsDuplicateName(true)

            return;
        }
        else {
            setIsDuplicateName(false)
        }
        const requestBody = {
            id: studentId,
            data: {
                name: name,
                dataOfItem: {
                    date: date,
                    weight: weight,
                    deleted: false
                }
            }
        };
        try {
            const res = await fetch('/api/studentInsights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            if (res.status == 200) {
                const data = await res.json();
                const registroR = data;
                console.log('registro', registroR);
                handlePopUpNuevoRegistro()
                setTitlePopUp('Registrado con éxito!');
                setDataPeso(registroR)
                setTrackingPopUp(true)


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
        <>
            <Dialog
                open={nuevoRegistro}
                onClose={handlePopUpNuevoRegistro}
                aria-labelledby='user-view-plans'
                aria-describedby='user-view-plans-description'
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 660, height: '610px' } }}

            >
                <DialogTitle
                    id='user-view-plans'
                    sx={{
                        textAlign: 'center',
                        fontSize: '1.5rem !important',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    Agregar un nuevo registro
                </DialogTitle>
                <Divider sx={{ my: '0 !important' }} />

                <Box sx={{ justifyContent: 'center', justifyItems: 'center', alignContent: 'center', padding: 5, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                        <form noValidate autoComplete='off' onSubmit={handleSubmit(createRegistro)}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Nombre'
                                            name='name'
                                            type='text'
                                            value={value}
                                            onBlur={onBlur}
                                            error={Boolean(errors.name)}
                                            onChange={(e) => {
                                                onChange(e.target.value === '' ? undefined : e.target.value);
                                            }}
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.name.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Box sx={{
                                display: 'flex',
                                gap: { xs: '1px', md: '10px', lg: '10px' },
                                width: '100%',
                                flexDirection: { xs: 'column', md: 'row', lg: 'row' }
                            }}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePickerWrapper >
                                                <DatePicker
                                                    selected={field.value}
                                                    onChange={(date: Date) => field.onChange(date)}
                                                    onBlur={field.onBlur}
                                                    maxDate={addDays(new Date(), 0)}
                                                    placeholderText="Click to select a date"
                                                    customInput={
                                                        <CustomInput
                                                            label="Día de entrenamiento"
                                                        />
                                                    }
                                                    dateFormat="dd/MM/yyyy"
                                                    value={format(field.value, 'dd/MM/yyyy')}
                                                />
                                            </DatePickerWrapper>
                                        )}
                                    />
                                    {errors.date && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.date.message}
                                        </FormHelperText>
                                    )}

                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='weight'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Kg'
                                                name='weight'
                                                type='number'
                                                value={value}
                                                onBlur={onBlur}
                                                error={Boolean(errors.weight)}
                                                onChange={(e) => {
                                                    onChange(e.target.value === '' ? undefined : e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.weight && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.weight.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mr: 5, mb: 10, mt: 5 }}>
                                <Button
                                    variant='contained'
                                    sx={{ '&:hover': { backgroundColor: 'success.main' } }}
                                    type='submit'

                                >
                                    Aceptar
                                </Button>
                            </Box>

                        </form>

                    </Box>
                    {isDuplicateName && (
                        <Typography sx={{ textAlign: 'center', color: 'error.main', fontSize: '12px' }}  >
                            Este ejercicio ya está registrado. Por favor, ingrese otro nombre del cual no haya registros de entrenamiento.
                        </Typography>
                    )}

                </Box>
            </Dialog>
            <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>
        </ >
    )
};


NewInsight.acl = {
    action: 'manage',
    subject: 'studentInsights-page'
}


export default NewInsight
