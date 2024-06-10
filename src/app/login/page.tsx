'use client';
import { openAlert } from '@/redux/alertSlice';
import { login } from '@/services/auth.service';
import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errors, setErrors] = useState({ email: false, password: false });
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
        await login(email!, password!);
        router.push('/');
      } catch (error: any) {
        console.error('Error logging in:', error);
        error.response.data.message =
          error.response.data.message === 'Incorrect password/email'
            ? 'Email e/ou senha incorreto'
            : error.response.data.message;
        dispatch(
          openAlert({
            message: error.response.data.message || 'Erro ao realizar login',
            severity: 'error',
          }),
        );
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

        <Button
          className="mb-4 w-full bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
          variant="contained"
          type="submit"
        >
          <span>Entrar</span>
        </Button>

        <Link className="w-full" href="/register">
          <Button
            className="mb-4 w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
            variant="contained"
          >
            <span>Cadastre-se</span>
          </Button>
        </Link>

        <Link className="w-full" href="/">
          <Button
            className="w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
            variant="contained"
          >
            <span>Voltar para Homepage</span>
          </Button>
        </Link>
      </form>
    </main>
  );
}
