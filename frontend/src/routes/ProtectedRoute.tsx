import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { ReactNode } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../helpers/Constans";
import { jwtDecode } from "jwt-decode";
import api from "../api/apiConfig";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAutherized, setIsAuthorizerd] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorizerd(false));
  });

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorizerd(true);
      } else {
        setIsAuthorizerd(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorizerd(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorizerd(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded?.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration! < now) {
      await refreshToken();
    } else {
      setIsAuthorizerd(true);
    }
  };

  if (isAutherized === null) {
    return <div>Loading ...</div>;
  }
  return isAutherized ? children : <Navigate to="/login" />;
};
