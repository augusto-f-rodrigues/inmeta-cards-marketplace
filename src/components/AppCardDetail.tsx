'use client';
import { closeCardDialog } from '@/redux/cardDetailSlice';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AppCardDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedCard, isDialogOpen } = useSelector(
    (state: any) => state.cardDetail,
  );

  const handleCloseDialog = () => {
    dispatch(closeCardDialog());
  };

  if (!selectedCard) return null;

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Detalhes do Card</DialogTitle>
      <DialogContent>
        <div className="flex w-full items-center justify-center">
          <img
            src={selectedCard.imageUrl}
            alt={selectedCard.name}
            style={{ width: '300', marginBottom: '1rem' }}
          />
        </div>
        <Typography variant="h6">{selectedCard.name}</Typography>
        <Typography className="w-[320px]" variant="body1">
          {selectedCard.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Criado em: {new Date(selectedCard.createdAt).toLocaleDateString()}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          className="w-full bg-red-600 px-8 py-1 normal-case hover:bg-red-500"
          variant="contained"
          onClick={handleCloseDialog}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppCardDetail;
