import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

interface ConfirmationDialogProps {
    message: string;
    open: boolean;
    handleOk: () => void
    handleCancel: () => void
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    const { message, open, handleOk, handleCancel } = props;

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Potwierdzenie</DialogTitle>
            <DialogContent dividers>
                {message}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleOk}>Tak</Button>
                <Button color="primary" onClick={handleCancel}>Anuluj</Button>
            </DialogActions>
        </Dialog>
    );
}