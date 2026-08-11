import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';
import { ServerErrorPage } from './ServerErrorPage';
import { BadRequestPage } from './BadRequestPage';

export const ErrorElementPage: React.FC = () => {
  const error = useRouteError() as any;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }
    if (error.status === 400) {
      return <BadRequestPage message={error.statusText || error.data?.message} />;
    }
    if (error.status === 500) {
      return <ServerErrorPage message={error.statusText || error.data?.message} />;
    }
  }

  // Fallback for general JavaScript runtime error caught by route boundary
  const errorMessage =
    error?.message || (typeof error === 'string' ? error : 'An unexpected application error occurred.');

  return <ServerErrorPage message={errorMessage} />;
};
