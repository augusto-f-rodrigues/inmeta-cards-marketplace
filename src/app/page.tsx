import Link from 'next/link';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function Home() {
  const orange500 = fullConfig.theme?.colors?.orange['500'];

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
            <IconButton color="inherit">
              <AccountCircle style={{ color: orange500 }} />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
