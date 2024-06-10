'use client';
import Navbar from '@/components/Navbar';
import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import {
  GetTradeResponseI,
  TradeCardI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { getAllTrades } from '@/services/trade.service';
import { CircularProgress, Grid, Paper } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Home() {
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: GetTradeResponseI = await getAllTrades({
        rpp: 10,
        page,
      });
      setTrades(response.list);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      {loading ? (
        <div className="mt-20 flex w-full items-center justify-center text-orange-500">
          <CircularProgress color="inherit" />
        </div>
      ) : (
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
                          <img
                            src={el.card.imageUrl}
                            alt={el.card.name}
                            className="w-full"
                          />
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
                          <img
                            src={el.card.imageUrl}
                            alt={el.card.name}
                            className="w-full"
                          />
                        </Grid>
                      ))}
                  </Grid>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </main>
  );
}
