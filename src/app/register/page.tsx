'use client';
import {
  FormControl,
  TextField,
  Button,
  FormHelperText,
  Snackbar,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import CustomAlert from '@/components/CustomAlert';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/user.service';

export default function Register() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (event: any) => {
    event.preventDefault();
    const newErrors = { name: false, email: false, password: false };

    if (!name) {
      newErrors.name = true;
    }

    if (!email || !emailRegex.test(email)) {
      newErrors.email = true;
    }

    if (!password) {
      newErrors.password = true;
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.password) {
      try {
        await createUser({
          name: name!,
          email: email!,
          password: password!,
        });
        setAlertMessage('Usuário registrado com sucesso!');
        setAlertSeverity('success');
        setOpenAlert(true);
        router.push('/');
      } catch (error: any) {
        console.error(error);
        setAlertMessage(error.response.data.message || 'Erro ao criar usuário');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    }
  };

  return (
    <main className="form-container p-10">
      <h1 className="text-h1 mb-4">Cadastro</h1>
      <form
        className="flex w-full min-w-80 max-w-[500px] flex-col items-center justify-center rounded-lg border border-gray-500 border-opacity-20 bg-white p-10"
        onSubmit={handleRegister}
        noValidate
      >
        <FormControl fullWidth className="mb-4" error={errors.name}>
          <TextField
            id="name"
            label="Nome"
            error={errors.name}
            variant="outlined"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <FormHelperText>Esse campo é obrigatório</FormHelperText>
          )}
        </FormControl>

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
            <FormHelperText>
              {email ? 'Formato de email inválido' : 'Esse campo é obrigatório'}
            </FormHelperText>
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
          <Link className="w-full md:max-w-52" href="/login">
            <Button
              className="w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
              variant="contained"
            >
              <span>Fazer Login</span>
            </Button>
          </Link>

          <Button
            className="mb-4 w-full bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500 md:mb-0 md:max-w-52"
            variant="contained"
            type="submit"
          >
            <span>Registrar</span>
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
