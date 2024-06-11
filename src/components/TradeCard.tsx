import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import { TradeCardI, TradeInfoI } from '@/interfaces/trade-response.interface';
import { openAlert } from '@/redux/alertSlice';
import { deleteTrade } from '@/services/trade.service';
import { Delete } from '@mui/icons-material';
import { Button, Grid, IconButton, Modal, Paper } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface TradeCardProps {
  trade: TradeInfoI;
  onCardClick: (card: TradeCardI['card']) => void;
  onOpenModal: (trade: TradeInfoI) => void;
  deleteOption?: boolean;
}

const TradeCard: React.FC<TradeCardProps> = ({
  trade,
  onCardClick,
  onOpenModal,
  deleteOption = false,
}) => {
  const dispatch = useDispatch();
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [tradeToDeleteId, setTradeToDeleteId] = useState<string>('');

  const handleCardClick = (card: TradeCardI['card']) => {
    onCardClick(card);
  };

  const handleOpenModal = () => {
    onOpenModal(trade);
  };

  const handleConfirmDelete = () => {
    if (tradeToDeleteId) {
      handleDeleteTrade(tradeToDeleteId);
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await deleteTrade(tradeId);
      const updatedTrades = trades.filter((trade) => trade.id !== tradeId);
      setTrades(updatedTrades);
      setDeleteConfirmationOpen(false);
      dispatch(
        openAlert({
          message: 'Sucesso ao deletar proposta de troca!',
          severity: 'success',
        }),
      );
    } catch (error) {
      console.error('Error deleting trade:', error);
      dispatch(
        openAlert({
          message: 'Erro ao deletar proposta de troca!',
          severity: 'error',
        }),
      );
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Paper elevation={3} className="relative px-4 pb-12 pt-4">
          <h2>
            <strong>Quem propôs a troca:</strong> {trade.user.name.slice(0, 15)}{' '}
            {trade.user.name.length >= 15 && '...'}
          </h2>
          <p className="my-2">
            <strong>Data de criação:</strong> {trade.createdAt}
          </p>
          <div>
            <p className="my-2 font-semibold">
              Cartas <span className="text-orange-500">oferecidas</span> por{' '}
              {trade.user.name.slice(0, 15)}{' '}
              {trade.user.name.length >= 15 && '...'} :
            </p>
            <Grid container spacing={1}>
              {trade.tradeCards
                .filter(
                  (el: TradeCardI) =>
                    el.type === TRADE_CARD_TYPES_ENUM.offering,
                )
                .slice(0, 2)
                .map((el: TradeCardI) => (
                  <Grid item xs={4} key={el.card.id}>
                    <button onClick={() => handleCardClick(el.card)}>
                      <Image
                        width={300}
                        height={300}
                        style={{ height: 'auto' }}
                        src={el.card.imageUrl}
                        alt={el.card.name}
                        className="w-full"
                      />
                    </button>
                  </Grid>
                ))}
              {trade.tradeCards.filter(
                (el: TradeCardI) => el.type === TRADE_CARD_TYPES_ENUM.offering,
              ).length > 2 && (
                <Grid item xs={4}>
                  <button
                    onClick={handleOpenModal}
                    className="flex h-full w-full items-center justify-center rounded-lg bg-gray-400 text-4xl font-extrabold text-white"
                  >
                    +
                    {trade.tradeCards.filter(
                      (el: TradeCardI) =>
                        el.type === TRADE_CARD_TYPES_ENUM.offering,
                    ).length - 2}
                  </button>
                </Grid>
              )}
            </Grid>
          </div>
          <div>
            <p className="my-2 font-semibold">
              Cartas que serão <span className="text-teal-500">recebidas</span>:
            </p>
            <Grid container spacing={1}>
              {trade.tradeCards
                .filter(
                  (el: TradeCardI) =>
                    el.type === TRADE_CARD_TYPES_ENUM.receiving,
                )
                .slice(0, 2)
                .map((el: TradeCardI) => (
                  <Grid item xs={4} key={el.card.id}>
                    <button onClick={() => handleCardClick(el.card)}>
                      <Image
                        width={300}
                        height={300}
                        style={{ height: 'auto' }}
                        src={el.card.imageUrl}
                        alt={el.card.name}
                        className="w-full"
                      />
                    </button>
                  </Grid>
                ))}
              {trade.tradeCards.filter(
                (el: TradeCardI) => el.type === TRADE_CARD_TYPES_ENUM.receiving,
              ).length > 2 && (
                <Grid item xs={4}>
                  <button
                    onClick={handleOpenModal}
                    className="flex h-full w-full items-center justify-center rounded-lg bg-gray-400 text-4xl font-extrabold text-white"
                  >
                    +
                    {trade.tradeCards.filter(
                      (el: TradeCardI) =>
                        el.type === TRADE_CARD_TYPES_ENUM.receiving,
                    ).length - 2}
                  </button>
                </Grid>
              )}
            </Grid>
          </div>
          {deleteOption && (
            <div className="absolute right-0 top-0 p-2">
              <IconButton
                onClick={() => {
                  setTradeToDeleteId(trade.id);
                  setDeleteConfirmationOpen(true);
                }}
              >
                <Delete fontSize="large" style={{ color: 'red' }} />
              </IconButton>
            </div>
          )}
          <button
            onClick={handleOpenModal}
            className="absolute bottom-0 left-0 w-full cursor-pointer bg-gray-200 p-2 text-center text-gray-800 hover:bg-gray-300"
          >
            <span>Ver detalhes</span>
          </button>
        </Paper>
      </Grid>
      <Modal
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        aria-labelledby="delete-confirmation-modal-title"
        aria-describedby="delete-confirmation-modal-description"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6">
          <p>Tem certeza que deseja excluir esta troca?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              className="bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
              variant="contained"
              onClick={() => setDeleteConfirmationOpen(false)}
            >
              <span>Cancelar</span>
            </Button>
            <Button
              className="bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
              variant="contained"
              onClick={handleConfirmDelete}
            >
              <span>Confirmar</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TradeCard;
