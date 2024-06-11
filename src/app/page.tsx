'use client';
import AppTradeDetailsModal from '@/components/AppTradeModalDetail';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import TradeCard from '@/components/TradeCard';
import { CardI } from '@/interfaces/card.interface';
import {
  GetTradeResponseI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { closeTradeDetails, openTradeDetails } from '@/redux/tradeDetailSlice';
import { getAllTrades } from '@/services/trade.service';
import { CircularProgress, Grid } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

  const modalState = useSelector((state: any) => state.tradeDetail);

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
    dispatch(openTradeDetails(trade));
  };

  const handleCloseModal = () => {
    dispatch(closeTradeDetails());
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

          {modalState.trade && (
            <AppTradeDetailsModal
              open={modalState.isOpen}
              trade={modalState.trade}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </section>
    </main>
  );
}
