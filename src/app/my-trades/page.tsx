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
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  maxHeight: '90vh',
  borderRadius: '16px',
};

export default function MyTrades() {
  const dispatch = useDispatch();
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [tradeToDeleteId, setTradeToDeleteId] = useState<string>('');
  const [selectedTrade, setSelectedTrade] = useState<TradeInfoI | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleOpenModal = (trade: TradeInfoI) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTrade(null);
  };

  return (
    <main>
      <Navbar />
      <section className="section-container">
        <div className="content-container">
          <h2 className="text-h2 mb-4">Minhas Trocas</h2>
          {loading ? (
            <div className="mt-20 flex w-full items-center justify-center text-orange-500">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <>
              <Grid container spacing={2} className="p-4">
                {trades.map((trade) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={trade.id}>
                    <Paper elevation={3} className="relative px-4 pb-12 pt-4">
                      <h2>
                        <strong>Quem propôs a troca:</strong>{' '}
                        {trade.user.name.slice(0, 15)}{' '}
                        {trade.user.name.length >= 15 && '...'}
                      </h2>
                      <p className="my-2">
                        <strong>Data de criação:</strong> {trade.createdAt}
                      </p>
                      <div>
                        <p className="my-2 font-semibold">
                          Cartas{' '}
                          <span className="text-orange-500">oferecidas</span>{' '}
                          por {trade.user.name.slice(0, 15)}{' '}
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
                                <button
                                  onClick={() => handleCardClick(el.card)}
                                >
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
                            (el: TradeCardI) =>
                              el.type === TRADE_CARD_TYPES_ENUM.offering,
                          ).length > 2 && (
                            <Grid item xs={4}>
                              <div className="flex h-full items-center justify-center rounded-lg bg-gray-400 text-4xl font-extrabold text-white">
                                +
                                {trade.tradeCards.filter(
                                  (el: TradeCardI) =>
                                    el.type === TRADE_CARD_TYPES_ENUM.offering,
                                ).length - 2}
                              </div>
                            </Grid>
                          )}
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
                            .slice(0, 2)
                            .map((el: TradeCardI) => (
                              <Grid item xs={4} key={el.card.id}>
                                <button
                                  onClick={() => handleCardClick(el.card)}
                                >
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
                            (el: TradeCardI) =>
                              el.type === TRADE_CARD_TYPES_ENUM.receiving,
                          ).length > 2 && (
                            <Grid item xs={4}>
                              <div className="flex h-full items-center justify-center rounded-lg bg-gray-400 text-4xl font-extrabold text-white">
                                +
                                {trade.tradeCards.filter(
                                  (el: TradeCardI) =>
                                    el.type === TRADE_CARD_TYPES_ENUM.receiving,
                                ).length - 2}
                              </div>
                            </Grid>
                          )}
                        </Grid>
                      </div>
                      <button
                        onClick={() => handleOpenModal(trade)}
                        className="absolute bottom-0 left-0 w-full cursor-pointer bg-gray-200 p-2 text-center text-gray-800 hover:bg-gray-300"
                      >
                        <span>Ver detalhes</span>
                      </button>
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
        </div>
      </section>
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

      {selectedTrade && (
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">
              Detalhes da Troca
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Quem propôs a troca:</strong> {selectedTrade.user.name}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Data de criação:</strong> {selectedTrade.createdAt}
            </Typography>
            <div>
              <Divider textAlign="left">
                <p className="my-4 font-semibold">
                  Cartas <span className="text-orange-500">oferecidas</span> por{' '}
                  {selectedTrade.user.name.slice(0, 15)}{' '}
                  {selectedTrade.user.name.length >= 15 && '...'} :
                </p>
              </Divider>
              <Grid container spacing={1}>
                {selectedTrade.tradeCards
                  .filter(
                    (el: TradeCardI) =>
                      el.type === TRADE_CARD_TYPES_ENUM.offering,
                  )
                  .map((el: TradeCardI) => (
                    <Grid
                      className="flex items-center justify-center"
                      item
                      xs={6}
                      md={6}
                      lg={4}
                      xl={2}
                      key={el.card.id}
                    >
                      <button onClick={() => handleCardClick(el.card)}>
                        <Image
                          width={300}
                          height={300}
                          style={{ width: 'auto' }}
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
              <Divider textAlign="left">
                <p className="my-4 font-semibold">
                  Cartas que serão{' '}
                  <span className="text-teal-500">recebidas</span>:
                </p>
              </Divider>
              <Grid container spacing={1}>
                {selectedTrade.tradeCards
                  .filter(
                    (el: TradeCardI) =>
                      el.type === TRADE_CARD_TYPES_ENUM.receiving,
                  )
                  .map((el: TradeCardI) => (
                    <Grid
                      className="flex items-center justify-center"
                      item
                      xs={6}
                      md={6}
                      lg={4}
                      xl={2}
                      key={el.card.id}
                    >
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
            <Button
              onClick={handleCloseModal}
              className="mt-2 w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
              variant="contained"
            >
              <span>Fechar</span>
            </Button>
          </Box>
        </Modal>
      )}
    </main>
  );
}
