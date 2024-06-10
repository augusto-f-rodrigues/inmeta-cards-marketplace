'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';
import CustomAlert from '@/components/CustomAlert';
import { closeAlert } from '@/redux/alertSlice';

const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: any) => state.alert);

  const handleClose = () => {
    dispatch(closeAlert());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
    >
      <CustomAlert severity={severity} message={message} />
    </Snackbar>
  );
};

export default AppSnackbar;
