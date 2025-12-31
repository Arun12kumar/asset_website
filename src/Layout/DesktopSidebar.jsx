"use client";

import { sidebarConstants } from "@/constants/sidebarConstants";
import { LogOut, Settings, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/controller/authController";

const DesktopSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      const data = await logoutMutation.mutateAsync();
      if (data.success) {
        router.push("/admin/login"); // redirect to login
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="flex flex-col items-center w-full gap-5">
        {/* Logo + Close Button */}
        <div className="flex justify-between items-center w-full">
          {/* <img
            src="/images/logo.png"
            alt="dev-traders-logo"
            className="h-auto w-28 md:w-36 object-contain"
          /> */}
          <p className="text-blue-500 font-semibold text-2xl">AppList App</p>
        </div>

        {/* Sidebar Links */}
        <ul className="flex flex-col w-full gap-3">
          {sidebarConstants.map((item) => {
            const isActive = pathname === item.link;

            return (
              <Link key={item.id} href={item.link}>
                <li
                  className={`group flex justify-start items-center gap-2 h-10 px-2 py-1 rounded-lg transition delay-50 duration-300 ease-in-out
                  ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "hover:text-white hover:bg-blue-500"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 lg:w-7 lg:h-7 transition delay-50 duration-300 ease-in-out ${
                      isActive
                        ? "text-white"
                        : "text-blue-500 group-hover:text-white"
                    }`}
                  />
                  <p
                    className={`transition delay-50 duration-300 ease-in-out text-xs lg:text-base ${
                      isActive ? "text-white" : "group-hover:text-white"
                    }`}
                  >
                    {item.title}
                  </p>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>

      <div className="w-full">
        <button
          onClick={handleLogout}
          className="group flex justify-start items-center gap-2 h-10 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white w-full"
        >
          <LogOut className="w-7 h-7 text-red-500 group-hover:text-white" />
          <p className="group-hover:text-white">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;