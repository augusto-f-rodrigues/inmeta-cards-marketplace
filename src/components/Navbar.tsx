'use client';
import { orange500 } from '@/constants/tailwind-theme-colors.constants';
import { logOut } from '@/services/auth.service';
import { Logout } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AppBar, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let username: null | string = null;
  if (typeof window !== 'undefined') {
    username = localStorage.getItem('name');
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar className="justify-between bg-neutral-50 p-4">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Duel Cards Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
        {username ? (
          <div className="flex items-center gap-4">
            <p className="navbar-text text-secondary">{`Olá ${username}!`}</p>
            <button
              aria-controls="navbar-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              className="text-orange-500"
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
                <Link href="/add-card">
                  <p className="text-secondary">Adicionar Card</p>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/create-trade">
                  <p className="text-secondary">Criar Troca</p>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/my-cards">
                  <p className="text-secondary">Meus Cards</p>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/my-trades">
                  <p className="text-secondary">Minhas Trocas</p>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/">
                  <p className="text-secondary">Todas as Trocas</p>
                </Link>
              </MenuItem>
            </Menu>
            <IconButton
              onClick={logOut}
              className="gap-2"
              style={{ color: orange500 }}
            >
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
  );
}
