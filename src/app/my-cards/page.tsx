'use client';
import CustomAlert from '@/components/CustomAlert';
import Navbar from '@/components/Navbar';
import { CardI } from '@/interfaces/card.interface';
import {
  deleteCardFromLoggedUser,
  getCardsFromLoggedUser,
} from '@/services/card.service';
import { Button, Card, CircularProgress, Grid, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export default function MyCards() {
  const [cards, setCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await getCardsFromLoggedUser();
      setCards(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setAlertMessage('Erro ao carregar os cards');
      setAlertSeverity('error');
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleRemoveCard = async (cardId: string) => {
    setAlertMessage('Endpoint não existe na API');
    setAlertSeverity('error');
    setOpenAlert(true);
  };

  return (
    <main>
      <Navbar />
      <section className="p-10">
        {loading ? (
          <div className="mt-20 flex w-full items-center justify-center text-orange-500">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            <Grid container spacing={3}>
              {cards.map((card: CardI) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card className="flex flex-col items-center justify-center gap-y-2 p-4">
                    <img src={card.imageUrl} alt={card.name} />
                    <h2 className="text-center">{card.name}</h2>
                    <div>
                      <Button
                        className="w-full bg-red-600 px-8 py-1 normal-case hover:bg-red-500"
                        variant="contained"
                        onClick={() => handleRemoveCard(card.id)}
                      >
                        <span>Remover</span>
                      </Button>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={openAlert}
          autoHideDuration={1500}
          onClose={() => setOpenAlert(false)}
        >
          <CustomAlert severity={alertSeverity} message={alertMessage} />
        </Snackbar>
      </section>
    </main>
  );
}
