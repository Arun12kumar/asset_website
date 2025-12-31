"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [open, setOpen] = useState(false);         // Add dialog
  const [user, setUser] = useState(null);

  const value = {
    open,
    setOpen,
    user,
    setUser,

  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ custom hook for convenience
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }
  return context;
};