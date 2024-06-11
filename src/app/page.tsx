'use client';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import TradeCard from '@/components/TradeCard';
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
    rpp: 6,
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
      <div className="flex max-h-[700px] items-center justify-center overflow-hidden bg-[#F3EECB]">
        <Image
          src="/svg/banner.svg"
          alt="Banner duel cards"
          width={1920}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          priority
        />
      </div>
      <section className="section-container">
        <div className="content-container">
          <h2 className="text-h2 my-4">Todas as Trocas</h2>

          {loading ? (
            <div className="mt-20 flex w-full items-center justify-center text-orange-500">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <>
              <Grid container spacing={2} className="p-4">
                {trades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onCardClick={handleCardClick}
                    onOpenModal={handleOpenModal}
                  />
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
