import { ReactNode, useContext, ReactElement } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}
export function Private({ children }: PrivateProps):  ReactElement | null {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return <div>Loading...</div>;
  }
  if (!signed) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
