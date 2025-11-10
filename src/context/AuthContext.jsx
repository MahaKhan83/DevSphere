import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    console.log("Logging in with:", email, password);
    setUser({ email });
  };

  const signup = async (name, email, password) => {
    console.log("Signing up:", name, email, password);
    setUser({ name, email });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};