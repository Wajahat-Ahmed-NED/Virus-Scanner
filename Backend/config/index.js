require("dotenv").config();

const { VIRUS_TOTAL_API_KEY, PORT, SMTP_SERVER, SMTP_MAIL, SMTP_PASSWORD } =
  process.env;

module.exports = {
  VIRUS_TOTAL_API_KEY,
  PORT,
  SMTP_SERVER,
  SMTP_MAIL,
  SMTP_PASSWORD,
};
