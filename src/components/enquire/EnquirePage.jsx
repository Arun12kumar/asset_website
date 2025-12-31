import React from "react";
import EnquireTable from "./EnquireTable";


const EnquirePage = () => {
  return (
    <>
      <div className="flex flex-col justify-between items-start">
        <h1 className="text-xl md:text-3xl text-black/80 font-bold">Enquiry Management</h1>
        <EnquireTable/>

      </div>
    </>
  );
};

export default EnquirePage;
