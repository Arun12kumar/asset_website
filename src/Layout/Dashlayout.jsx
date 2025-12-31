"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import gsap from "gsap";
import Sidebar from "@/Layout/MobileSidebar";
import DesktopSidebar from "@/Layout/DesktopSidebar";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider"


const DashLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [renderSidebar, setRenderSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const{auth} = useAuth();


  

  const openSidebar = () => {
    setRenderSidebar(true);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // GSAP animations
  useEffect(() => {
    if (isOpen && sidebarRef.current && overlayRef.current) {
      // Animate IN
      gsap.fromTo(
        sidebarRef.current,
        { x: -300 },
        { x: 0, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.4, ease: "power2.out" }
      );
    } else if (!isOpen && sidebarRef.current && overlayRef.current) {
      // Animate OUT
      gsap.to(sidebarRef.current, {
        x: -300,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => setRenderSidebar(false), // remove from DOM after animation
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <div>
      <div className="w-screen h-dvh grid grid-cols-10 grid-rows-10 relative z-0">
        <nav className="row-start-1 row-end-2 col-start-1 md:col-start-3 col-end-11 shadow-[0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-between px-4 bg-white">
          <button onClick={openSidebar}>
            <Menu className="md:hidden" />
          </button>
          <div className="flex items-center gap-3">
            
            <div className="flex gap-2 items-center">
              <p>{auth?.email || "Guest"}</p>
              <p className="bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center justify-center">{auth?.role || "admin"}</p>
            </div>

          </div>

        </nav>

        {/* Sidebar (Desktop) */}
        <div className="hidden md:block row-start-1 row-end-11 col-start-1 col-end-3 px-5 py-6">
          <DesktopSidebar/>
        </div>

        {/* Main Content */}
        <main className="bg-[#F5F6FA] row-start-2 row-end-11 col-start-1 md:col-start-3 col-end-11 p-4">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar + Overlay */}
      {renderSidebar && (
        <>
          <div
            ref={sidebarRef}
            className="bg-white w-[300px] h-dvh absolute top-0 left-0 md:hidden flex flex-col justify-between items-center px-5 py-6 z-20 shadow-lg"
          >

          <Sidebar closeSidebar={closeSidebar} />

          </div>

          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={closeSidebar}
            className="bg-black absolute w-screen h-dvh top-0 left-0 md:hidden z-10"
          />
        </>
      )}
    </div>
  );
};

export default DashLayout;