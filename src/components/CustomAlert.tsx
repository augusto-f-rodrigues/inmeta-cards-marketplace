import React from 'react';
import Alert from '@mui/material/Alert';

interface CustomAlertProps {
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const CustomAlert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  (props, ref) => {
    return (
      <Alert
        className="flex h-14 w-96 items-center rounded-lg border text-base font-semibold shadow-lg"
        ref={ref}
        severity={props.severity}
      >
        {props.message}
      </Alert>
    );
  },
);

export default CustomAlert;
