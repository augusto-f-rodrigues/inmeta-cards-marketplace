'use client';
import Navbar from '@/components/Navbar';
import { CardI } from '@/interfaces/card.interface';
import { openAlert } from '@/redux/alertSlice';
import { getCardsFromLoggedUser } from '@/services/card.service';
import { Button, Card, CircularProgress, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openCardDialog } from '@/redux/cardDetailSlice';
import AppCardDetail from '@/components/AppCardDetail';
import Image from 'next/image';

export default function MyCards() {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await getCardsFromLoggedUser();
      setCards(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
      dispatch(
        openAlert({
          message: 'Erro ao carregar os cards',
          severity: 'error',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleRemoveCard = async (cardId: string) => {
    dispatch(
      openAlert({
        message: 'Endpoint não existe na API',
        severity: 'error',
      }),
    );
  };

  const handleCardClick = (card: CardI) => {
    dispatch(openCardDialog(card));
  };

  return (
    <main>
      <Navbar />
      <section className="section-container">
        <div className="content-container">
          <h2 className="text-h2 mb-4">Meus Cards</h2>
          {loading ? (
            <div className="mt-20 flex w-full items-center justify-center text-orange-500">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                {cards.map((card: CardI) => (
                  <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Card
                      className="flex cursor-pointer flex-col items-center justify-center gap-y-2 p-4"
                      onClick={() => handleCardClick(card)}
                    >
                      <Image
                        width={300}
                        height={300}
                        style={{ height: 'auto' }}
                        src={card.imageUrl}
                        alt={card.name}
                      />
                      <h2 className="text-center">{card.name}</h2>
                      <div>
                        <Button
                          className="w-full bg-red-600 px-8 py-1 normal-case hover:bg-red-500"
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCard(card.id);
                          }}
                        >
                          <span>Remover</span>
                        </Button>
                      </div>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {cards.length === 0 && (
                <div className="mt-20 flex w-full items-center justify-center text-orange-500">
                  <h3>Nenhum card adicionado</h3>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <AppCardDetail />
    </main>
  );
}
