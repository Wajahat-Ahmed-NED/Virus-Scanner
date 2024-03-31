const apiKey = process.env.REACT_APP_API_KEY;
console.log(apiKey);
const generateIdInVirusTotal = (hash) => {
  return fetch(`${process.env.REACT_APP_API_URL}generateResult/${hash}`, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

const getResponseById = (api) => {
  return fetch(api, {
    method: "GET",
    headers: {
      "x-apikey": apiKey,
      "Access-Control-Allow-Headers": "*",
    },
  });
};

const generateReport = (reportContent) => {
  return fetch(`${process.env.REACT_APP_API_URL}generateReport/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportContent),
  });
};

export { generateIdInVirusTotal, getResponseById, generateReport };
