import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/AuthProvider";

/** Blocks unauthenticated users; preserves intended path in ?next= */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
