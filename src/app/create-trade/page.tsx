'use client';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import {
  orange500,
  teal500,
} from '@/constants/tailwind-theme-colors.constants';
import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import { GetCardsResponseI } from '@/interfaces/card-response.interface';
import { CardI } from '@/interfaces/card.interface';
import { CreateTradeCardRequestI } from '@/interfaces/trade-response.interface';
import { openAlert } from '@/redux/alertSlice';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { getAllCards, getCardsFromLoggedUser } from '@/services/card.service';
import { createTrade } from '@/services/trade.service';
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function CreateTrade() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [userCards, setUserCards] = useState<CardI[]>([]);
  const [allCards, setAllCards] = useState<CardI[]>([]);
  const [selectedOfferCards, setSelectedOfferCards] = useState<CardI[]>([]);
  const [selectedReceiveCards, setSelectedReceiveCards] = useState<CardI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFetchCards, setLoadingFetchCards] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<GetCardsResponseI>({
    list: [],
    rpp: 0,
    page: 1,
    more: false,
  });
  const router = useRouter();

  const fetchCards = async (page: number) => {
    setLoadingFetchCards(true);
    try {
      const allCardsData = await getAllCards({ page: page });
      setAllCards(allCardsData.list);
      setPageInfo(allCardsData);
    } catch (error) {
      console.error('Error fetching all cards:', error);
      dispatch(
        openAlert({
          message: 'Erro ao carregar todos os cards',
          severity: 'error',
        }),
      );
    } finally {
      setLoadingFetchCards(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userCardsData = await getCardsFromLoggedUser();
        setUserCards(userCardsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user cards:', error);
        dispatch(
          openAlert({
            message: 'Erro ao carregar os cards do usuário',
            severity: 'error',
          }),
        );
      }
    }
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    fetchCards(pageInfo.page);
  }, [pageInfo.page]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreateTrade = async () => {
    try {
      const offeringCards: CreateTradeCardRequestI[] = selectedOfferCards.map(
        (card: CardI) => {
          return { cardId: card.id, type: TRADE_CARD_TYPES_ENUM.offering };
        },
      );
      const receivingCards: CreateTradeCardRequestI[] =
        selectedReceiveCards.map((card: CardI) => {
          return { cardId: card.id, type: TRADE_CARD_TYPES_ENUM.receiving };
        });

      if (offeringCards.length === 0) {
        dispatch(
          openAlert({
            message: 'Ofereça ao menos uma carta',
            severity: 'warning',
          }),
        );

        return;
      }
      if (receivingCards.length === 0) {
        dispatch(
          openAlert({
            message: 'Receba ao menos uma carta',
            severity: 'warning',
          }),
        );

        return;
      }
      await createTrade({ cards: [...offeringCards, ...receivingCards] });
      dispatch(
        openAlert({
          message: 'Sucesso ao criar troca',
          severity: 'success',
        }),
      );
      router.push('/my-trades');
    } catch (error) {
      console.error('Error fetching create cards:', error);
      dispatch(
        openAlert({
          message: 'Erro ao criar troca',
          severity: 'error',
        }),
      );
    }
  };

  const handleOfferCardToggle = (card: CardI) => {
    const index = selectedOfferCards.findIndex((el) => el.id === card.id);
    const updatedOfferCards =
      index >= 0
        ? selectedOfferCards.filter((el) => el.id !== card.id)
        : [...selectedOfferCards, card];
    setSelectedOfferCards(updatedOfferCards);
  };

  const handleReceiveCardToggle = (card: CardI) => {
    const index = selectedReceiveCards.findIndex((el) => el.id === card.id);
    const updatedReceiveCards =
      index >= 0
        ? selectedReceiveCards.filter((el) => el.id !== card.id)
        : [...selectedReceiveCards, card];
    setSelectedReceiveCards(updatedReceiveCards);
  };

  const handlePageChange = (newPage: number) => {
    setPageInfo((prevState: GetCardsResponseI) => ({
      ...prevState,
      page: newPage,
    }));
  };

  const handleCardClick = (card: CardI) => {
    dispatch(openCardDialog(card));
  };

  return (
    <main>
      <Navbar />
      <section className="p-10">
        <h2 className="text-h2 mb-4">Criar Troca</h2>
        {loading ? (
          <div className="my-20 flex w-full items-center justify-center text-orange-500">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <>
            <Stepper
              sx={{
                '& .MuiStepIcon-root.Mui-active': { color: teal500 },
                '& .MuiStepIcon-root.Mui-completed': { color: orange500 },
              }}
              activeStep={activeStep}
            >
              <Step>
                <StepLabel>
                  <span className="text-[10px] md:text-sm lg:text-base">
                    Selecionar cards que deseja oferecer
                  </span>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <span className="text-[10px] md:text-sm lg:text-base">
                    Selecionar cards que deseja receber
                  </span>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel>
                  <span className="text-[10px] md:text-sm lg:text-base">
                    Resumo
                  </span>
                </StepLabel>
              </Step>
            </Stepper>
            <div>
              {activeStep === 0 ? (
                <div className="p-4">
                  <Grid container spacing={2}>
                    {userCards.map((card: CardI) => (
                      <Grid item xs={12} sm={6} lg={3} key={card.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOfferCards.includes(card)}
                              onChange={() => handleOfferCardToggle(card)}
                            />
                          }
                          label={
                            <Card className="flex flex-col items-center justify-center gap-y-2 p-4">
                              <Image
                                width={300}
                                height={300}
                                style={{ height: 'auto' }}
                                src={card.imageUrl}
                                alt={card.name}
                              />
                              <p>{card.name}</p>
                              <Button
                                className="bg-teal-600 px-8 py-1 normal-case hover:bg-orange-500"
                                variant="contained"
                                onClick={() => handleCardClick(card)}
                              >
                                <span>Detalhes</span>
                              </Button>
                            </Card>
                          }
                        />
                      </Grid>
                    ))}
                    {userCards.length === 0 && (
                      <div className="mt-20 flex w-full items-center justify-center text-orange-500">
                        <h3>
                          Adicione um card através do "Menu" &gt; "Adicionar
                          Card" antes de criar uma troca
                        </h3>
                      </div>
                    )}
                  </Grid>
                </div>
              ) : activeStep === 1 ? (
                <div className="p-4">
                  <Card className="p-4">
                    <Grid container spacing={2}>
                      {loadingFetchCards ? (
                        <div className="my-20 flex w-full items-center justify-center text-orange-500">
                          <CircularProgress color="inherit" />
                        </div>
                      ) : (
                        allCards.map((card: CardI) => (
                          <Grid item xs={12} sm={6} lg={3} key={card.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    selectedReceiveCards.findIndex(
                                      (el) => el.id === card.id,
                                    ) >= 0
                                  }
                                  onChange={() => handleReceiveCardToggle(card)}
                                />
                              }
                              label={
                                <Card className="flex flex-col items-center justify-center gap-y-2 p-4">
                                  <Image
                                    width={300}
                                    height={300}
                                    style={{ height: 'auto' }}
                                    src={card.imageUrl}
                                    alt={card.name}
                                  />
                                  <p>{card.name}</p>
                                  <Button
                                    className="bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
                                    variant="contained"
                                    onClick={() => handleCardClick(card)}
                                  >
                                    <span>Detalhes</span>
                                  </Button>
                                </Card>
                              }
                            />
                          </Grid>
                        ))
                      )}
                    </Grid>
                    <Pagination
                      pageInfo={pageInfo}
                      onPageChange={handlePageChange}
                    />
                  </Card>
                </div>
              ) : (
                <div className="p-4">
                  <p className="mb-2 font-semibold">
                    Cartas que serão{' '}
                    <span className="text-orange-500">oferecidas</span>:
                  </p>
                  <ul>
                    <Grid container spacing={2}>
                      {selectedOfferCards.map((card) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                          <Card
                            onClick={() => handleCardClick(card)}
                            key={card.id}
                            className="flex w-fit flex-col items-center justify-center gap-y-2 p-4"
                          >
                            <Image
                              width={300}
                              height={300}
                              style={{ height: 'auto' }}
                              src={card.imageUrl}
                              alt={card.name}
                            />
                            <p>{card.name}</p>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </ul>
                  <p className="mb-2 mt-4 font-semibold">
                    Cartas que serão{' '}
                    <span className="text-teal-500">recebidas</span>:
                  </p>
                  <ul>
                    <Grid container spacing={2}>
                      {selectedReceiveCards.map((card) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                          <Card
                            onClick={() => handleCardClick(card)}
                            key={card.id}
                            className="flex w-fit flex-col items-center justify-center gap-y-2 p-4"
                          >
                            <Image
                              width={300}
                              height={300}
                              style={{ height: 'auto' }}
                              src={card.imageUrl}
                              alt={card.name}
                            />
                            <p>{card.name}</p>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </ul>
                </div>
              )}
            </div>
            <div className="my-4 flex w-full items-center justify-center gap-4">
              <Button
                className="bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                <span>Voltar</span>
              </Button>
              {activeStep === 2 ? (
                <Button
                  className="bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
                  variant="contained"
                  onClick={handleCreateTrade}
                >
                  <span>Criar Troca</span>
                </Button>
              ) : (
                <Button
                  className="bg-teal-600 px-8 py-1 normal-case hover:bg-teal-500"
                  variant="contained"
                  onClick={handleNext}
                >
                  <span>Próximo</span>
                </Button>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
