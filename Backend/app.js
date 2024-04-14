const { default: axios } = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const nodemailer = require("nodemailer");
const {
  PORT,
  VIRUS_TOTAL_API_KEY,
  SMTP_SERVER,
  SMTP_MAIL,
  SMTP_PASSWORD,
} = require("./config");

const port = PORT;
const apiKey = VIRUS_TOTAL_API_KEY;

app.use(cors());
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(express.json({ limit: "100mb" }));

app.use(express.static(path.join(__dirname, "public")));

let STATIC = path.resolve(__dirname, "build");
let INDEX = path.resolve(STATIC, "index.html");

app.use(express.static(STATIC));

app.get("/", function (req, res, next) {
  res.sendFile(INDEX);
});

app.get("/generateResult/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const data = await axios.get(
      `http://www.virustotal.com/api/v3/files/${hash}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-apikey": apiKey,
          "Access-Control-Allow-Headers": "*",
        },
      }
    );
    res.send(data.data);
  } catch (err) {
    res.send(err.message);
  }
});

let reportContent = {
  malwareDetected: null,
  typeOfMalware: null,
  severityLevel: null,
  md5: null,
  sha1: null,
  sha256: null,
  email: null,
};

app.post("/generateReport", (req, res) => {
  try {
    const { stats, name, md5, sha1, sha256, email, chart, fileName } = req.body;
    if (
      !stats ||
      !name ||
      !md5 ||
      !sha1 ||
      !sha256 ||
      !email ||
      !chart ||
      !fileName
    ) {
      return res.status(400).json({
        mBoolean: true,
        message: "Invalid Parameters",
        values: [stats, name, md5, sha1, sha256, email, chart, fileName],
      });
    }

    // console.log(name)
    (reportContent.stats = stats),
      (reportContent.total = Object.values(stats).reduce(
        (acc, curr) => acc + curr,
        0
      )),
      (reportContent.name = name),
      (reportContent.chart = chart),
      (reportContent.md5 = md5),
      (reportContent.sha1 = sha1),
      (reportContent.sha256 = sha256),
      (reportContent.email = email),
      ejs.renderFile(
        path.join(__dirname, "./views/", "report-template.ejs"),
        {
          reportContents: reportContent,
        },
        (err, data) => {
          if (err) {
            // console.log("at 87 " + err);
            res.send(err);
          } else {
            let options = {
              format: "A4",
              orientation: "portrait",

              border: {
                top: "1cm",
                right: "2cm",
                bottom: "1cm",
                left: "1cm",
              },
            };
            pdf
              .create(data, options)
              .toFile(`./${fileName}.pdf`, function (err, data) {
                if (err) {
                  res.send(err);
                } else {
                  let mailTransporter = nodemailer.createTransport({
                    service: SMTP_SERVER,
                    auth: {
                      user: SMTP_MAIL,
                      pass: SMTP_PASSWORD,
                    },
                  });
                  let mailDetails = {
                    from: SMTP_MAIL,
                    to: reportContent?.email,
                    subject: "FireStickHacks - See The Full Scanned Report",
                    html: "<b>Dear User,</b><br/>Thank you for using FireStickHacks File Scanner. Attached to this email you will find a detailed scan report in the PDF format.<br/><br/>To know if this file is safe to use on Firestick, please refer to this Table which shows the % of malicious content and the corresponding safety categories. Here is the link : https://firestickhacks.com/virus-scanner-table",
                    attachments: [
                      {
                        path: path.basename(data.filename),
                      },
                    ],
                  };

                  mailTransporter.sendMail(mailDetails, function (err, data) {
                    if (err) {
                      console.log("at 128 " + err);

                      res.status(400).json({
                        mBoolean: true,
                        message: "Error Occured While Sending Mail",
                      });
                    } else {
                      res.status(200).json({
                        mBoolean: false,
                        message: "Email Send Successfully",
                      });
                    }
                  });
                }
              });
          }
        }
      );
  } catch (error) {
    console.log(error.message);
    return res
      .status(403)
      .json({ mBoolean: true, message: "Invalid Parameters" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
