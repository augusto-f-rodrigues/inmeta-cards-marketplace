'use client';
import {
  FormControl,
  TextField,
  Button,
  FormHelperText,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/services/auth.service';
import CustomAlert from '@/components/CustomAlert';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const newErrors = { email: false, password: false };

    if (!email) {
      newErrors.email = true;
    }

    if (!password) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      try {
        const { token } = await login(email!, password!);
        localStorage.setItem('token', token);
        router.push('/');
      } catch (error: any) {
        console.error('Error logging in:', error);
        error.response.data.message =
          error.response.data.message === 'Incorrect password/email'
            ? 'Email e/ou senha incorreto'
            : error.response.data.message;
        setAlertMessage(
          error.response.data.message || 'Erro ao realizar login',
        );
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    }
  };

  return (
    <main className="form-container p-10">
      <h1 className="text-h1 mb-4">Login</h1>
      <form
        className="flex w-full min-w-80 max-w-[500px] flex-col items-center justify-center rounded-lg border border-gray-500 border-opacity-20 bg-white p-10"
        onSubmit={handleLogin}
        noValidate
      >
        <FormControl fullWidth className="mb-4" error={errors.email}>
          <TextField
            id="email"
            label="Email"
            error={errors.email}
            variant="outlined"
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <FormHelperText>Esse campo é obrigatório</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth className="mb-4" error={errors.password}>
          <TextField
            id="password"
            label="Senha"
            error={errors.password}
            type="password"
            variant="outlined"
            value={password || ''}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <FormHelperText>Esse campo é obrigatório</FormHelperText>
          )}
        </FormControl>

        <div className="flex w-full flex-col items-center gap-4 md:flex-row">
          <Link className="w-full md:max-w-52" href="/register">
            <Button
              className="w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
              variant="contained"
            >
              <span>Cadastre-se</span>
            </Button>
          </Link>

          <Button
            className="mb-4 w-full bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500 md:mb-0 md:max-w-52"
            variant="contained"
            type="submit"
          >
            <span>Entrar</span>
          </Button>
        </div>

        <Link className="mt-4 w-full" href="/">
          <Button
            className="w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
            variant="contained"
          >
            <span>Voltar para Homepage</span>
          </Button>
        </Link>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openAlert}
        autoHideDuration={1500}
        onClose={() => setOpenAlert(false)}
      >
        <CustomAlert severity={alertSeverity} message={alertMessage!} />
      </Snackbar>
    </main>
  );
}
