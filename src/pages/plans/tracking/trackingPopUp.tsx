// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'

import DialogContent from '@mui/material/DialogContent'

import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type Props = {
  trackingPopUp: boolean
  setTrackingPopUp: (val: boolean) => void
  title: string
}

const TrackingPopUp = (props: Props) => {

  //*props
  const { trackingPopUp, setTrackingPopUp, title } = props

  //*state
  const handleCloseTrackingPopUp = () => {
    setTrackingPopUp(false);

  };

  return (
    <>
      <Dialog fullWidth open={trackingPopUp} onClose={handleCloseTrackingPopUp} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 670 } }}>
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
              '& svg': { mb: 6, color: 'success.main' }
            }}
          >
            <Icon icon='line-md:confirm' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5 }}>{title}</Typography>
            {/* <Typography>Refresque la pagina para ver los cambios</Typography> */}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >

          <Button variant='outlined' color='success' onClick={handleCloseTrackingPopUp}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TrackingPopUp
