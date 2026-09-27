import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';
import { isAdmin } from '../../utils/isAdmin';
import RequireAuth from './RequireAuth';

/** Requires logged-in admin (role === 'admin'). */
export default function RequireAdmin({ children }) {
  return (
    <RequireAuth>
      <RequireAdminInner>{children}</RequireAdminInner>
    </RequireAuth>
  );
}

function RequireAdminInner({ children }) {
  const { user } = useAuth();
  if (!isAdmin(user)) {
    return <Redirect to="/" />;
  }
  return children;
}
