/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'
import DialogContent from '@mui/material/DialogContent'
import { SubmitHandler, FieldValues } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TrackingPopUp from '../plans/tracking/trackingPopUp'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'


type Props = {
    borrarRegistro: boolean
    setBorrarRegistro: (val: boolean) => void

    // setDataPeso: (val: any) => void
    dataId: string
}

const DeleteInsight = (props: Props) => {

    const { borrarRegistro, setBorrarRegistro, dataId } = props
    const [trackingPopUp, setTrackingPopUp] = useState<boolean>(false)
    const [titlePopUp, setTitlePopUp] = useState<string>('')
    const currentEndDate = new Date();
    currentEndDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 0);


    const route = useRouter()

    const handlePopUpBorrarRegistro = () => {
        setBorrarRegistro(false)
    }

    const createRegistro: SubmitHandler<FieldValues> = async () => {
        const studentId = route.query.id

        const requestBody = {
            id: studentId,
            dataId: dataId
        };

        try {
            const res = await fetch('/api/studentInsights', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            if (res.status == 200) {
                handlePopUpBorrarRegistro()
                setTitlePopUp('Borrado con éxito!');
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
            <Dialog fullWidth open={borrarRegistro} onClose={handlePopUpBorrarRegistro} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}>
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
                    <Button variant='outlined' color='secondary' onClick={handlePopUpBorrarRegistro} >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <TrackingPopUp trackingPopUp={trackingPopUp} setTrackingPopUp={setTrackingPopUp} title={titlePopUp}></TrackingPopUp>
        </ >
    )
};


DeleteInsight.acl = {
    action: 'manage',
    subject: 'studentInsights-page'
}


export default DeleteInsight