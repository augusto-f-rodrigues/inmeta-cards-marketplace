import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
import { TradeCardI, TradeInfoI } from '@/interfaces/trade-response.interface';
import { openCardDialog } from '@/redux/cardDetailSlice';
import { Box, Button, Divider, Grid, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { useDispatch } from 'react-redux';

interface AppTradeDetailsModalProps {
  open: boolean;
  trade: TradeInfoI;
  onClose: () => void;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
  maxHeight: '90vh',
  borderRadius: '16px',
};

const AppTradeDetailsModal: React.FC<AppTradeDetailsModalProps> = ({
  open,
  trade,
  onClose,
}) => {
  const dispatch = useDispatch();

  const handleCardClick = (card: TradeCardI['card']) => {
    dispatch(openCardDialog(card));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Detalhes da Troca
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Quem propôs a troca:</strong> {trade.user.name}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Data de criação:</strong> {trade.createdAt}
        </Typography>
        <div>
          <Divider textAlign="left">
            <p className="my-4 font-semibold">
              Cartas <span className="text-orange-500">oferecidas</span> por{' '}
              {trade.user.name.slice(0, 15)}{' '}
              {trade.user.name.length >= 15 && '...'} :
            </p>
          </Divider>
          <Grid container spacing={1}>
            {trade.tradeCards
              .filter(
                (el: TradeCardI) => el.type === TRADE_CARD_TYPES_ENUM.offering,
              )
              .map((el: TradeCardI) => (
                <Grid
                  className="flex items-center justify-center"
                  item
                  xs={6}
                  md={6}
                  lg={4}
                  xl={2}
                  key={el.card.id}
                >
                  <button onClick={() => handleCardClick(el.card)}>
                    <Image
                      width={300}
                      height={300}
                      style={{ width: 'auto' }}
                      src={el.card.imageUrl}
                      alt={el.card.name}
                      className="w-full"
                    />
                  </button>
                </Grid>
              ))}
          </Grid>
        </div>
        <div>
          <Divider textAlign="left">
            <p className="my-4 font-semibold">
              Cartas que serão <span className="text-teal-500">recebidas</span>:
            </p>
          </Divider>
          <Grid container spacing={1}>
            {trade.tradeCards
              .filter(
                (el: TradeCardI) => el.type === TRADE_CARD_TYPES_ENUM.receiving,
              )
              .map((el: TradeCardI) => (
                <Grid
                  className="flex items-center justify-center"
                  item
                  xs={6}
                  md={6}
                  lg={4}
                  xl={2}
                  key={el.card.id}
                >
                  <button onClick={() => handleCardClick(el.card)}>
                    <Image
                      width={300}
                      height={300}
                      style={{ height: 'auto' }}
                      src={el.card.imageUrl}
                      alt={el.card.name}
                      className="w-full"
                    />
                  </button>
                </Grid>
              ))}
          </Grid>
        </div>
        <Button
          onClick={onClose}
          className="mt-2 w-full bg-orange-600 px-8 py-1 normal-case hover:bg-orange-500"
          variant="contained"
        >
          <span>Fechar</span>
        </Button>
      </Box>
    </Modal>
  );
};

export default AppTradeDetailsModal;
