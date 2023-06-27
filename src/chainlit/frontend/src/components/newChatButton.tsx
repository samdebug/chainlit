import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import useClearChat from 'hooks/clearChat';
import AccentButton from 'components/accentButton';
import RegularButton from 'components/button';

export default function NewChatButton() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const clearChat = useClearChat();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    clearChat();
    navigate('/');
    handleClose();
  };

  return (
    <Box>
      <AccentButton
        id="new-chat-button"
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<AddIcon />}
      >
        新增聊天
      </AccentButton>
      <Dialog
        open={open}
        onClose={handleClose}
        id="new-chat-dialog"
        PaperProps={{
          sx: {
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {'创建一个新的聊天?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            此操作会清除当前的聊天，并创建一个新的聊天，是否确认？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <RegularButton onClick={handleClose}>取消</RegularButton>
          <AccentButton
            id="confirm"
            variant="outlined"
            onClick={handleConfirm}
            autoFocus
          >
            确认
          </AccentButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
