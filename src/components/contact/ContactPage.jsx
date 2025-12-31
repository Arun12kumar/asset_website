
import React from "react";
import ContactTable from "./ContactTable";


const ContactPage = () => {
  return (
    <>
      <div className="flex flex-col justify-between items-start">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">Contact Management</h1>
        <ContactTable/>

      </div>
    </>
  );
};

export default ContactPage;
