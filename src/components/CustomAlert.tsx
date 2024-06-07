import React from 'react';
import Alert from '@mui/material/Alert';

interface CustomAlertProps {
  severity: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const CustomAlert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  (props, ref) => {
    return (
      <Alert ref={ref} severity={props.severity}>
        {props.message}
      </Alert>
    );
  },
);

export default CustomAlert;
