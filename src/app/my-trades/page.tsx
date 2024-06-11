'use client';
import AppTradeDetailsModal from '@/components/AppTradeModalDetail';
import Navbar from '@/components/Navbar';
import TradeCard from '@/components/TradeCard';
import { CardI } from '@/interfaces/card.interface';
import {
  GetTradeResponseI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { closeTradeDetails, openTradeDetails } from '@/redux/tradeDetailSlice';
import { getAllTradesFromLoggedUser } from '@/services/trade.service';
import { CircularProgress, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function MyTrades() {
  const dispatch = useDispatch();
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [loading, setLoading] = useState(false);

  const modalState = useSelector((state: any) => state.tradeDetail);

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

  const handleCardClick = (card: CardI) => {
    dispatch(openCardDialog(card));
  };

  const handleOpenModal = (trade: TradeInfoI) => {
    dispatch(openTradeDetails(trade));
  };

  const handleCloseModal = () => {
    dispatch(closeTradeDetails());
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
                  <TradeCard
                    key={trade.id}
                    deleteOption={true}
                    trade={trade}
                    onCardClick={handleCardClick}
                    onOpenModal={handleOpenModal}
                  />
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

      {modalState.trade && (
        <AppTradeDetailsModal
          open={modalState.isOpen}
          trade={modalState.trade}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
