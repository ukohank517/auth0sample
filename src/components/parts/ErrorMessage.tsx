import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = ({ children }: any) => (
  <Alert color="danger" fade={false} data-testid="error">
    {children}
  </Alert>
);

export default ErrorMessage;
