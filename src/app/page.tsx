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
import { CircularProgress, Grid, Paper } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

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
                <Paper elevation={3} className="p-4">
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
    </main>
  );
}
