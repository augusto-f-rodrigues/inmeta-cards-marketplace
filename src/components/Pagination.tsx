import { Button, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import React from 'react';
import { orange500 } from '@/constants/tailwind-theme-colors.constants';

interface PaginationProps {
  pageInfo: { page: number; more: boolean };
  onPageChange: (newPage: number) => void;
  classNames?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pageInfo,
  onPageChange,
  classNames = '',
}) => {
  const handlePrevClick = () => {
    onPageChange(pageInfo.page - 1);
  };

  const handleNextClick = () => {
    onPageChange(pageInfo.page + 1);
  };

  return (
    <div className={`mt-4 flex justify-center ${classNames}`}>
      <IconButton onClick={handlePrevClick} disabled={pageInfo.page === 1}>
        <ArrowBack
          style={{ color: pageInfo.page === 1 ? 'gray' : orange500 }}
        />
      </IconButton>
      <p className="mx-4 content-center text-center">{`Página ${pageInfo.page}`}</p>
      <IconButton onClick={handleNextClick} disabled={!pageInfo.more}>
        <ArrowForward style={{ color: !pageInfo.more ? 'gray' : orange500 }} />
      </IconButton>
    </div>
  );
};

export default Pagination;
