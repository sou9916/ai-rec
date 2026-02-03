import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

export default function RefreshHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = location.pathname;
    if (token && PUBLIC_PATHS.includes(path)) {
      navigate("/app", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}
