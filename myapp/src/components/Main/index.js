import React, { useState } from "react";
import Navbar from "../Navbar";
import Form from "../Form";
import "./index.css";
import Report from "../Report";

export default function Main() {
  const [file, setFile] = useState("mx-2 bg-orange-red-a");
  const [research, setResearch] = useState("mx-2");

  const handleNavbar = (flag) => {
    switch (flag) {
      case 0:
        setFile("mx-2");
        setResearch("mx-2 bg-orange-red-a ");
        break;
      case 1:
        setFile("mx-2 bg-orange-red-a");
        setResearch("mx-2 ");
        break;
      default:
        break;
    }
  };
  return (
    <>
      {/* <Navbar />
      <Form /> */}
      <div className="container-fluid ">
        <div className="container p-0">
          <div className="redLine"></div>
          <div className="header-content">
            <p className="h3 mx-4">
              <span className="title">VirusTotal</span> Integration
            </p>
          </div>
          <div className="navbar d-flex justify-content-start">
            <a href="#" className={file} onClick={() => handleNavbar(1)}>
              Scan File Box
            </a>
            <a href="#" className={research} onClick={() => handleNavbar(0)}>
              File Scan Report
            </a>
          </div>
          <div className="redLine"></div>
          <div className="mainBody m-3">
            {file.split(" ").length == 2 ? <Form /> : <Report />}
          </div>
        </div>
      </div>
    </>
  );
}
