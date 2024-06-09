'use client';
import CustomAlert from '@/components/CustomAlert';
import Navbar from '@/components/Navbar';
import { CardI } from '@/interfaces/card.interface';
import { getAllCards } from '@/services/card.service';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Pagination,
  Snackbar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddCard() {
  const [cards, setCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const router = useRouter();

  const fetchCards = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllCards({ page: page });
      setCards(response.list);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setAlertMessage('Erro ao carregar os cards');
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(page);
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleAddCard = () => {
    router.push('/add-card');
  };

  return (
    <main>
      <Navbar />
      <section className="p-10">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={3}>
              {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card className="flex flex-col items-center justify-center gap-y-2 p-4">
                    <img src={card.imageUrl} alt={card.name} />
                    <h2 className="text-center">{card.name}</h2>
                    <div>
                      <Button
                        className="w-full bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
                        variant="contained"
                      >
                        <span>Adicionar</span>
                      </Button>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Pagination
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              className="mt-4"
            />
          </>
        )}
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={() => setOpenAlert(false)}
        >
          <CustomAlert severity="error" message={alertMessage} />
        </Snackbar>
        <Button variant="contained" color="primary" onClick={handleAddCard}>
          Adicionar Card
        </Button>
      </section>
    </main>
  );
}
