"use client";

import { createContext, useContext, useState } from "react";

const SubCategoryContext = createContext();

export const SubCategoryProvider = ({ children }) => {
  const [open, setOpen] = useState(false);         // Add dialog
  const [subCategory, setSubCategory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const value = {
    open,
    setOpen,
    subCategory,
    setSubCategory,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen

  };

  return (
    <SubCategoryContext.Provider value={value}>
      {children}
    </SubCategoryContext.Provider>
  );
};

// ✅ custom hook for convenience
export const useSubCategoryContext = () => {
  const context = useContext(SubCategoryContext);
  if (!context) {
    throw new Error("useSubCategoryContext must be used inside SubCategoryProvider");
  }
  return context;
};