'use client';
import {
  GetAllTradeResponse,
  TradeCard,
  TradeInfo,
} from '@/interfaces/trade-response.interface';
import { getAllTrades } from '@/services/trade.service';
import { AccountCircle } from '@mui/icons-material';
import { AppBar, Grid, IconButton, Paper, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function Home() {
  const [trades, setTrades] = useState<TradeInfo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const orange500 = fullConfig.theme?.colors?.orange['500'];

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: GetAllTradeResponse = await getAllTrades({
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
    <div>
      <AppBar position="static">
        <Toolbar className="justify-between bg-neutral-50">
          <Link href="/">
            <Image
              src="/images/inmeta-logo.svg"
              alt="Inmeta Logo"
              width={150}
              height={50}
            />
          </Link>
          <Link href="/login">
            <IconButton style={{ color: orange500 }}>
              <AccountCircle />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={2} className="p-4">
          {trades.map((trade) => (
            <Grid item xs={12} sm={6} md={4} key={trade.id}>
              <Paper elevation={3} className="p-4">
                <h2>{trade.user.name}</h2>
                <p>{trade.createdAt}</p>
                <p>{trade.tradeCards.length} cards</p>
                <Grid container spacing={1}>
                  {trade.tradeCards.map((el: TradeCard) => (
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
    </div>
  );
}
