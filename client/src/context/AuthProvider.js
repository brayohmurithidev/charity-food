import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    role:
      sessionStorage.getItem("role") !== undefined &&
      (sessionStorage.getItem("role") || ""),
    user:
      sessionStorage.getItem("user") !== undefined &&
      (sessionStorage.getItem("user") || ""),
  });

  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("role", auth.role);
      sessionStorage.setItem("user", auth.user);
    } else {
      sessionStorage.clear();
      return;
    }
  }, [auth, auth.role, auth.user]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// EXPORT DEFAULT

export default AuthContext;
