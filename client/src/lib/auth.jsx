import React, {useEffect,useState} from 'react';
import { useNavigate } from "react-router-dom";


const checkAuth = async () => {
  
  let res = await fetch("/api/users/auth", { method: "GET", credentials: "include" });
  if (res.status === 200) return true;

  if (res.status === 401) {

    const r = await fetch("/api/users/refresh", { method: "POST", credentials: "include" });
    if (r.ok) {
      const retry = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
      return retry.status === 200;
    }
  }
  return false;
};


const ProtectedRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null); // null = checking, true/false done

  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok = await checkAuth();
        if (!mounted) return;
        setAllowed(ok);
      } catch (err) {
        console.error("auth check failed", err);
        if (mounted) setAllowed(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (allowed === null) return <div>Loading...</div>;
  if (allowed === false) {
    navigate("/login");
  }
  return children;
};

export default ProtectedRoute;