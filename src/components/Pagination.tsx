import { GetAllCardsResponseI } from '@/interfaces/card-response.interface';
import { Button } from '@mui/material';
import React from 'react';

interface PaginationProps {
  pageInfo: GetAllCardsResponseI;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageInfo, onPageChange }) => {
  const handlePrevClick = () => {
    onPageChange(pageInfo.page - 1);
  };

  const handleNextClick = () => {
    onPageChange(pageInfo.page + 1);
  };

  return (
    <div className="mt-4 flex justify-center">
      <Button
        variant="contained"
        className="bg-orange-500"
        onClick={handlePrevClick}
        disabled={pageInfo.page === 1}
      >
        Anterior
      </Button>
      <p className="mx-4 content-center text-center">{`Página ${pageInfo.page}`}</p>
      <Button
        variant="contained"
        className="bg-orange-500"
        onClick={handleNextClick}
        disabled={!pageInfo.more}
      >
        Próximo
      </Button>
    </div>
  );
};

export default Pagination;
