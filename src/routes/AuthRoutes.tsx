import { Route, Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';

export function AuthRoutes() {
  return (
    <Fragment>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth" element={<Navigate to="/signup" replace />} />
    </Fragment>
  );
}