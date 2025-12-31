"use client";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("./Header"), { ssr: false });

const HeaderClient = () => {
 return <Header />;
}

export default HeaderClient