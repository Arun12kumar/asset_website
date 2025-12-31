"use client";

import { createContext, useContext, useState } from "react";

const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [open, setOpen] = useState(false);         // Add dialog
  const [asset, setAsset] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const value = {
    open,
    setOpen,
    asset,
    setAsset,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen

  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

// ✅ custom hook for convenience
export const useAssetContext = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssetContext must be used inside AssetProvider");
  }
  return context;
};