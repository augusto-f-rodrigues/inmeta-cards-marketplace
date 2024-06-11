'use client';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import { CardI } from '@/interfaces/card.interface';
import {
  GetTradeResponseI,
  TradeCardI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { getAllTrades } from '@/services/trade.service';
import {
  CircularProgress,
  Grid,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  Divider,
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

export default function Home() {
  const dispatch = useDispatch();
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<GetTradeResponseI>({
    list: [],
    rpp: 10,
    page: 1,
    more: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeInfoI | null>(null);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response: GetTradeResponseI = await getAllTrades({
        rpp: pageInfo.rpp,
        page,
      });
      setTrades(response.list);
      setPageInfo(response);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageInfo.page);
  }, [pageInfo.page]);

  const handlePageChange = (newPage: number) => {
    setPageInfo((prevState: GetTradeResponseI) => ({
      ...prevState,
      page: newPage,
    }));
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
          <h2 className="text-h2 mb-4">Todas as Trocas</h2>

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
              <Pagination
                classNames="mb-4"
                pageInfo={pageInfo}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {selectedTrade && (
            <Modal open={modalOpen} onClose={handleCloseModal}>
              <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                  Detalhes da Troca
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  <strong>Quem propôs a troca:</strong>{' '}
                  {selectedTrade.user.name}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  <strong>Data de criação:</strong> {selectedTrade.createdAt}
                </Typography>
                <div>
                  <Divider textAlign="left">
                    <p className="my-4 font-semibold">
                      Cartas <span className="text-orange-500">oferecidas</span>{' '}
                      por {selectedTrade.user.name.slice(0, 15)}{' '}
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
        </div>
      </section>
    </main>
  );
}
