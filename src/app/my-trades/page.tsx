'use client';
import Navbar from '@/components/Navbar';
import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import { CardI } from '@/interfaces/card.interface';
import {
  GetTradeResponseI,
  TradeCardI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { openAlert } from '@/redux/alertSlice';
import { openCardDialog } from '@/redux/cardDetailSlice';
import {
  deleteTrade,
  getAllTradesFromLoggedUser,
} from '@/services/trade.service';
import { Delete } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function MyTrades() {
  const dispatch = useDispatch();
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [tradeToDeleteId, setTradeToDeleteId] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: GetTradeResponseI = await getAllTradesFromLoggedUser();
      setTrades(response.list);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
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

  const handleConfirmDelete = () => {
    if (tradeToDeleteId) {
      handleDeleteTrade(tradeToDeleteId);
    }
  };

  const handleCardClick = (card: CardI) => {
    dispatch(openCardDialog(card));
  };

  return (
    <main>
      <Navbar />
      {loading ? (
        <div className="mt-20 flex w-full items-center justify-center text-orange-500">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          <Grid container spacing={2} className="p-4">
            {trades.map((trade) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={trade.id}>
                <Paper elevation={3} className="relative p-4">
                  <h2>
                    <strong>Quem propôs a troca:</strong> {trade.user.name}
                  </h2>
                  <p className="my-2">
                    <strong>Data de criação:</strong> {trade.createdAt}
                  </p>
                  <div>
                    <p className="my-2 font-semibold">
                      Cartas <span className="text-orange-500">oferecidas</span>{' '}
                      por {trade.user.name}:
                    </p>
                    <Grid container spacing={1}>
                      {trade.tradeCards
                        .filter(
                          (el: TradeCardI) =>
                            el.type === TRADE_CARD_TYPES_ENUM.offering,
                        )
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
                    </Grid>
                  </div>
                  <div>
                    <p className="my-2 font-semibold">
                      Cartas que serão{' '}
                      <span className="text-teal-500">recebidas</span>:
                    </p>
                    <Grid container spacing={1}>
                      {trade.tradeCards
                        .filter(
                          (el: TradeCardI) =>
                            el.type === TRADE_CARD_TYPES_ENUM.receiving,
                        )
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
                    </Grid>
                  </div>
                  <div className="flex w-full justify-end">
                    <IconButton
                      onClick={() => {
                        setTradeToDeleteId(trade.id);
                        setDeleteConfirmationOpen(true);
                      }}
                    >
                      <Delete style={{ color: 'red' }} />
                    </IconButton>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {trades.length === 0 && (
            <div className="mt-20 flex w-full items-center justify-center text-orange-500">
              <h3>Nenhuma troca encontrada</h3>
            </div>
          )}
        </>
      )}
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
    </main>
  );
}
