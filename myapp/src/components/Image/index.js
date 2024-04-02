import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import UploadImg from "../../assets/upload_file.png";
import { upload } from "@testing-library/user-event/dist/upload";
import { Spin } from "antd";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { getData } from "../../Utilities";
import { generateReport } from "../../api";
import Alert from "@mui/material/Alert";

const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: false,
};

const Image = ({ handleScan }) => {
  const [hash, setHash] = useState("");
  const [visibleImg, setVisibleImg] = useState(true);
  const [threat, setThreat] = useState(-1);
  const [scanImg, setScanImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [successAlert, setSuccessAlert] = React.useState(true);
  const [alertContent, setAlertContent] = React.useState({});

  const handleFileChange = async (info) => {
    const file = info.file.originFileObj;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target.result;
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      setHash(hashHex);
      setVisibleImg(false);
      setName(file.name);
      console.log(hashHex);
      //   message.success(`${file.name} file hash calculated successfully.`);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleGenerateEmail = (e) => {
    e.preventDefault();
    setLoader(true);
    setAlertContent({});
    let data = getData()?.data?.attributes;
    console.log(document.getElementsByTagName("svg"));
    let chart = document.getElementsByTagName("svg")[0].outerHTML;
    console.log("here " + JSON.stringify(data?.last_analysis_stats));

    let { malicious, suspicious, harmless, failure } = {
      ...data?.last_analysis_stats,
    };
    let obj = {
      stats: { malicious, suspicious, harmless, failure },
      name: data?.meaningful_name,
      md5: data.md5,
      sha1: data.sha1,
      sha256: data.sha256,
      email: email,
      chart: chart,
      fileName: name,
    };
    generateReport(obj)
      .then((res) => res.json())
      .then((res) => {
        if (res.mBoolean) {
          setAlertContent({
            alert: true,
            severity: "error",
            message: "Report could not send",
          });
        } else {
          setAlertContent({
            alert: true,
            severity: "success",
            message: "Report sent on your email!",
          });
          console.log(res);
        }
        setThreat(-1);
        setLoader(false);
      })
      .catch((err) => {
        setAlertContent({
          alert: true,
          severity: "error",
          message: "Something went wrong " + err.message,
        });
        console.log(err);
        setLoader(false);
        setThreat(-1);
      });
  };
  const handleScanNew = () => {
    setThreat(-1);
    setScanImg(false);
    setName("");
    setEmail("");
    setAlertContent({});
    setVisibleImg(true);
  };
  return (
    <>
      {visibleImg ? (
        <Dragger {...props} onChange={handleFileChange} listType="none">
          <div className="d-flex justify-content-around">
            <img src={UploadImg} alt="My Image" />
            <div className="mt-3">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>

              <p className="ant-upload-hint">Max File Size of 1 GB.</p>
              <p className="ant-upload-text">
                Drop your files to scan for viruses
              </p>
              <button className="btn btn-primary">Choose File</button>
            </div>
          </div>
        </Dragger>
      ) : scanImg ? (
        <div
          style={{
            border: "1px solid rgb(0 102 255) ",
            backgroundColor: "#e3ebf7",
            borderRadius: ".75rem",
            height: "100%",
          }}
          className="d-flex py-5 justify-content-center align-items-center"
        >
          <div className="text-center ">
            <div>
              <h1 className="text-success">
                <strong>Scanning...</strong>
              </h1>
              <br />
              <Spin size="large" />
            </div>
            <div>
              <br />
              <h3>Too many scans are currently in progress!</h3>
              <h3>Wait.. while your file is scanned</h3>
            </div>
          </div>
        </div>
      ) : threat > -1 ? (
        <div
          style={{
            border: "1px solid rgb(0 102 255) ",
            backgroundColor: threat === 1 ? "#f5ecec" : "#caebdb",
            borderRadius: ".75rem",
            height: "100%",
          }}
          className="d-flex py-5 justify-content-center align-items-center"
        >
          <div className="text-center ">
            {threat === 1 && (
              <div>
                <h1 className="text-danger">
                  <strong>Potential Threats Found</strong>
                </h1>
              </div>
            )}
            <div>
              <br />
              {threat === 1 && <h3> Safe to Use or Not?</h3>}
              <h3> Enter your email to get Full Report</h3>
              <br />

              <form onSubmit={handleGenerateEmail}>
                <div className="d-flex justify-content-around">
                  <TextField
                    label="Email"
                    id="outlined-size-small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    fullWidth
                    required
                    type="email"
                  />
                  <Button
                    variant="contained"
                    className="mx-2"
                    type="submit"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid black",
                      color: "black",
                    }}
                    disabled={loader}
                  >
                    {loader ? <Spin size="medium" /> : "Send "}
                  </Button>
                </div>
              </form>
              <br />
              <button
                className="btn btn-primary rounded-pill"
                onClick={handleScanNew}
              >
                Scan New File
              </button>
            </div>
          </div>
        </div>
      ) : alertContent.alert ? (
        <div
          style={{
            border: "1px solid rgb(0 102 255) ",
            backgroundColor:
              alertContent.severity === "error" ? "#f5ecec" : "#caebdb",
            borderRadius: ".75rem",
            height: "100%",
          }}
          className="d-flex py-5 justify-content-center align-items-center"
        >
          <div className="text-center ">
            {alertContent.severity === "error" ? (
              <div>
                <h1 className="text-danger">
                  <strong> Something Went Wrong</strong>
                </h1>
              </div>
            ) : (
              <div>
                <h1 className="text-success">
                  <strong> Successful!</strong>
                </h1>
              </div>
            )}

            <div>
              <br />
              <h3> {alertContent.message}</h3>
              {alertContent.severity == "success" && <h3> Check Inbox</h3>}
              <br />

              <button
                className="btn btn-primary rounded-pill"
                onClick={handleScanNew}
              >
                Scan New File
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            border: "1px solid rgb(0 102 255) ",
            backgroundColor: "#F7FAFF",
            borderRadius: ".75rem",
            height: "100%",
          }}
          className="d-flex py-5 justify-content-center align-items-center"
        >
          <div className="text-center">
            <div>
              <h5>
                <strong>File Selected For Scanning</strong>
              </h5>
              <p>{name}</p>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn  mx-2"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid black",
                }}
                onClick={() => setVisibleImg(true)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary mx-2"
                style={{ backgroundColor: " #0066FF" }}
                onClick={async () => {
                  setScanImg(true);
                  handleScan(hash);
                  await new Promise((resolve) => setTimeout(resolve, 2000));

                  let testdata = getData()?.data?.attributes;
                  console.log(testdata);

                  const malicious = testdata?.last_analysis_stats?.malicious;
                  if (malicious && malicious > 0) {
                    setScanImg(false);
                    setThreat(1);
                  } else {
                    setScanImg(false);
                    setThreat(0);
                  }
                }}
              >
                Scan now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Image;
