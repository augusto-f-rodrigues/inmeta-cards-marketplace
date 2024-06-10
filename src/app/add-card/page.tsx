'use client';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import { GetCardsResponseI } from '@/interfaces/card-response.interface';
import { CardI } from '@/interfaces/card.interface';
import { openAlert } from '@/redux/alertSlice';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { addCardsToUser, getAllCards } from '@/services/card.service';
import { Button, Card, CircularProgress, Grid } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function AddCard() {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<GetCardsResponseI>({
    list: [],
    rpp: 0,
    page: 1,
    more: false,
  });

  const fetchCards = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllCards({ page });
      setCards(response.list);
      setPageInfo(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
      dispatch(
        openAlert({
          message: 'Erro ao carregar os cards',
          severity: 'success',
        }),
      );
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
      dispatch(
        openAlert({
          message: 'Card adicionado com sucesso!',
          severity: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        openAlert({
          message: 'Erro ao adicionar o card.',
          severity: 'error',
        }),
      );
    }
  };

  const handleCardClick = (card: CardI) => {
    dispatch(openCardDialog(card));
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
                    <button onClick={() => handleCardClick(card)}>
                      <Image
                        width={300}
                        height={300}
                        style={{ height: 'auto' }}
                        src={card.imageUrl}
                        alt={card.name}
                      />
                    </button>
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
      </section>
    </main>
  );
}
