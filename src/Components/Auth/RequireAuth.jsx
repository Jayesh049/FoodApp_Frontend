import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';

/** Blocks unauthenticated users; preserves intended path in ?next= */
export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Redirect to={`/login?next=${next}`} />;
  }

  return children;
}
