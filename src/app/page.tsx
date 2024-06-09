'use client';
import Navbar from '@/components/Navbar';
import {
  GetAllTradeResponseI,
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
      const response: GetAllTradeResponseI = await getAllTrades({
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
            <Grid item xs={12} sm={6} md={4} key={trade.id}>
              <Paper elevation={3} className="p-4">
                <h2>{trade.user.name}</h2>
                <p>{trade.createdAt}</p>
                <p>{trade.tradeCards.length} cards</p>
                <Grid container spacing={1}>
                  {trade.tradeCards.map((el: TradeCardI) => (
                    <Grid item xs={4} key={el.card.id}>
                      <img
                        src={el.card.imageUrl}
                        alt={el.card.name}
                        className="w-full"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </main>
  );
}
