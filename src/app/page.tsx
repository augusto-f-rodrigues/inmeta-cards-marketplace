'use client';
import {
  GetAllTradeResponseI,
  TradeCardI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import { UserLoggedResponseI } from '@/interfaces/user-response.interface';
import { getAllTrades } from '@/services/trade.service';
import { getLoggedUserData } from '@/services/user.service';
import { AccountCircle, Logout } from '@mui/icons-material';
import {
  AppBar,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function Home() {
  const [trades, setTrades] = useState<TradeInfoI[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserLoggedResponseI | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const orange500 = fullConfig.theme?.colors?.orange['500'];

  useEffect(() => {
    fetchData();
    checkUser();
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

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await getLoggedUserData();
        setUser(res);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <main>
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
          {user ? (
            <div className="flex items-center gap-4">
              <p className="navbar-text text-secondary">{`Olá ${user.name}!`}</p>
              <button
                aria-controls="navbar-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                style={{ color: orange500 }}
              >
                <p className="navbar-text text-secondary">Menu</p>
              </button>
              <Menu
                id="navbar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link href="/my-trades">
                    <p className="text-secondary">Minhas Trocas</p>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/create-trade">
                    <p className="text-secondary">Criar Troca</p>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/add-card">
                    <p className="text-secondary">Adicionar Card</p>
                  </Link>
                </MenuItem>
              </Menu>
              <IconButton className="gap-2" style={{ color: orange500 }}>
                <p className="navbar-text text-primary text-base">Sair</p>
                <Logout />
              </IconButton>
            </div>
          ) : (
            <Link href="/login">
              <IconButton style={{ color: orange500 }}>
                <AccountCircle />
              </IconButton>
            </Link>
          )}
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
