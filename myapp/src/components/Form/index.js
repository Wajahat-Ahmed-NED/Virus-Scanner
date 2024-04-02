import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { generateIdInVirusTotal } from "../../api";
import BasicModal from "../Modal";
import Stats from "../Stats";
import { getData, holdData } from "../../Utilities";
import Alert from "@mui/material/Alert";
import Image from "../Image";

export default function Form() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(false);
  const [errorFromApi, setErrorFromApi] = useState({
    flag: false,
    message: "",
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("form " + JSON.stringify(event.target.files[0]));
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!file) {
      setLoading(false);
      alert("Please select a file");
      return;
    }

    // const formData = new FormData();
    // formData.append("file", file);
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    console.log("Form ", hashHex);
    generateIdInVirusTotal(hashHex)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        holdData(data);
        setName(data?.data?.attributes?.meaningful_name);
        setData(data?.data?.attributes?.last_analysis_stats);
        setLoading(false);
        console.log(
          Object.keys(data?.data?.attributes?.last_analysis_stats).length
        );
        setReport(true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setErrorFromApi({
          flag: true,
          message: "No record found against this file",
        });
        setTimeout(() => {
          setErrorFromApi({ flag: false, message: "" });
        }, 3000);
      });
  };

  const handleScan = (hash) => {
    console.log(hash);
    generateIdInVirusTotal(hash)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        holdData(data);
        setName(data?.data?.attributes?.meaningful_name);
        setData(data?.data?.attributes?.last_analysis_stats);
        setLoading(false);
        console.log(
          Object.keys(data?.data?.attributes?.last_analysis_stats).length
        );

        setReport(true);
        return;
      })
      .catch((error) => {
        console.error(error);
        // setLoading(false);
        setErrorFromApi({
          flag: true,
          message: "No record found against this file",
        });
        return;
      });
  };
  useEffect(() => {
    let storedData = getData();
    storedData !== null &&
      setData(storedData?.data?.attributes?.last_analysis_stats);
    setName(storedData?.data?.attributes?.meaningful_name);
  }, []);

  const handleReport = (flag) => {
    setReport(flag);
  };
  return (
    <>
      <div className=" my-5 mx-3 d-flex justify-content-around ">
        <div className="my-5 px-5" style={{ width: "50% " }}>
          <p className="h1 text-center">FireStick Virus Scanner</p>
          <p style={{ fontWeight: "bold", textAlign: "justify" }}>
            Drag and drop suspicious files to detect malware and other breaches
            for free.
          </p>
          <p style={{ textAlign: "justify" }}>
            Scan any document, image, PDF, or other file types. Make sure your
            files are safe and free from viruses before you open them with
            Internxt's zero-knowledge Virus Scanner.
          </p>
        </div>
        <div className="my-5" style={{ width: "50%" }}>
          <Image handleScan={handleScan} />

          {/* {errorFromApi.flag && (
            <Alert severity="error" className="mb-3 text-center mt-2">
              {errorFromApi.message}
            </Alert>
          )}
          <p className="h6 text-left">Upload File</p>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
          <div className="d-flex justify-content-between mt-2">
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
              className="bg-orange-red "
            >
              Search
            </Button>
            <Button
              variant="outlined"
              disabled={!data}
              className="bg-outline-orange-red "
              onClick={() => setReport(true)}
            >
              Generate Report
            </Button> */}
          {/* </div> */}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        {loading && <h3 style={{ textAlign: "center" }}>Scanning ...</h3>}
      </div>

      {/* {report && <BasicModal state={report} setState={handleReport} />} */}
      {!loading && Object.keys(data).length > 0 && (
        <>
          <h5> &nbsp;Fetched Results for {name}</h5>
          <Stats />
        </>
      )}
    </>
  );
}
