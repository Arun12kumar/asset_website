"use client";

import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [open, setOpen] = useState(false);         // Add dialog
  const [category, setCategory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const value = {
    open,
    setOpen,
    category,
    setCategory,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen

  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// ✅ custom hook for convenience
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used inside CategoryProvider");
  }
  return context;
};