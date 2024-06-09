'use client';
import useUser from '@/hooks/use-user';
import { Logout } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AppBar, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function Navbar() {
  const orange500 = fullConfig.theme?.colors?.orange['500'];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useUser();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
  );
}
