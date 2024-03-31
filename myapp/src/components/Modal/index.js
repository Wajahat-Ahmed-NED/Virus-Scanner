import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { generateReport } from "../../api/index";
import CircularProgress from "@mui/material/CircularProgress";
import { getData } from "../../Utilities";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,

  p: 4,
};

export default function BasicModal({ state, setState }) {
  const [email, setEmail] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [successAlert, setSuccessAlert] = React.useState(true);
  const [alertContent, setAlertContent] = React.useState({});
  const handleClose = () => setState(false);

  const handleGenerateEmail = (e) => {
    e.preventDefault();
    setLoader(true);
    setAlertContent({});
    let data = getData()?.data?.attributes;
    console.log(document.getElementsByTagName("svg"));
    let chart = document.getElementsByTagName("svg")[0].outerHTML;
    let obj = {
      stats: data?.last_analysis_stats,
      name: data?.meaningful_name,
      md5: data.md5,
      sha1: data.sha1,
      sha256: data.sha256,
      email: email,
      chart: chart,
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
            message: "Report send successfully",
          });
          console.log(res);
        }
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
      });
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessAlert(false);
    }, 3000);
  }, []);

  return (
    <div>
      <Modal
        open={state}
        // onClose={handleClose}
        // disableBackdropClick
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseIcon
            className="mb-2 "
            style={{ float: "right", cursor: "pointer" }}
            onClick={handleClose}
          />
          {alertContent.alert && (
            <Alert
              severity={alertContent?.severity}
              className="mb-3 text-center mt-2"
            >
              {alertContent?.message}
            </Alert>
          )}
          {successAlert && (
            <Alert severity="success" className="mb-3 text-center mt-2">
              Scan Successfully Completed
            </Alert>
          )}
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h5"
            className="text-center"
          >
            Send Report To Your Mail
          </Typography>
          <hr />
          <form onSubmit={handleGenerateEmail}>
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
              fullWidth
              className="mt-4 bg-orange-red"
              type="submit"
              disabled={loader}
            >
              {loader ? <CircularProgress size="25px" /> : "Send Report "}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
