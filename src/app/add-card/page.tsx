'use client';
import CustomAlert from '@/components/CustomAlert';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import { GetCardsResponseI } from '@/interfaces/card-response.interface';
import { CardI } from '@/interfaces/card.interface';
import { addCardsToUser, getAllCards } from '@/services/card.service';
import { Button, Card, CircularProgress, Grid, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AddCard() {
  const [cards, setCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<GetCardsResponseI>({
    list: [],
    rpp: 0,
    page: 1,
    more: false,
  });
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const fetchCards = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllCards({ page });
      setCards(response.list);
      setPageInfo(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setAlertMessage('Erro ao carregar os cards');
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(pageInfo.page);
  }, [pageInfo.page]);

  const handlePageChange = (newPage: number) => {
    setPageInfo((prevState: GetCardsResponseI) => ({
      ...prevState,
      page: newPage,
    }));
  };

  const handleAddCard = async (cardId: string) => {
    try {
      await addCardsToUser([cardId]);
      setAlertMessage('Card adicionado com sucesso!');
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (error) {
      setAlertMessage('Erro ao adicionar o card');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
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
                        className="w-full bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
                        variant="contained"
                        onClick={() => handleAddCard(card.id)}
                      >
                        <span>Adicionar</span>
                      </Button>
                    </div>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
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
