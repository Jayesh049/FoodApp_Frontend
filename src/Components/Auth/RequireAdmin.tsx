import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthProvider";
import { isAdmin } from "../../utils/isAdmin";
import RequireAuth from "./RequireAuth";

/** Requires logged-in admin (role === 'admin'). */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireAdminInner>{children}</RequireAdminInner>
    </RequireAuth>
  );
}

function RequireAdminInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
