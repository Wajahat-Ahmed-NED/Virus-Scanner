import React, { useState, useEffect } from "react";
import Stats from "../Stats";
import { getData } from "../../Utilities";

export default function Report() {
  const [data, setData] = useState(null);
  const [test, setTest] = useState({});
  useEffect(() => {
    let res = getData();
    console.log(res);
    if (res !== null && res !== undefined) {
      console.log(res.data?.attributes);
      setData(res?.data?.attributes);
      //   console.log(first);
      //   for (let i in res?.attributes?.sandbox_verdicts) {
      //     console.log(i.malware_classification);
      //   }
      //   let obj = {
      //     typesOfMalware: [],
      //   };
      //   {
      //     Object.keys(res?.attributes?.sandbox_verdicts).map((key) => {
      //       for (let i in res?.attributes?.sandbox_verdicts[key]
      //         ?.malware_classification) {
      //         if (!obj.typesOfMalware.includes(i)) {
      //           obj.typesOfMalware.push(i);
      //         }
      //       }
      //       // obj.typesOfMalware.push([...res?.attributes?.sandbox_verdicts[key].malware_classification])
      //     });
      //   }
      //   setTest(obj);
    }
  }, []);

  const severityLevel = () => {
    const analysis = data?.last_analysis_results;
    const totalEngines = Object.keys(analysis)?.length;
    let detectedEngines = 0;

    for (const engine in analysis) {
      if (analysis[engine].category === "malicious") {
        detectedEngines++;
      }
    }

    const severityLevel = (detectedEngines / totalEngines) * 100;
    return severityLevel;
  };

  return (
    <>
      {data !== null ? (
        <div className=" mt-2 mx-3">
          <p className="h2 text-left">File Scan Report for FireStick Users</p>
          <hr />
          <div className="my-3">
            <p className="h5">Malware Detection:</p>
            <p>File Name: {data?.meaningful_name}</p>
            <Stats />
            <div className=" my-5">
              <table className="table table-hover table-light">
                <thead>
                  <tr>
                    <th
                      style={{ backgroundColor: "#ef3636", color: "#ffffff" }}
                    >
                      Stats Parameters
                    </th>
                    <th
                      style={{ backgroundColor: "#ef3636", color: "#ffffff" }}
                    >
                      Values
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(data?.last_analysis_stats)?.map((e, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: "bold" }}>{e}</td>
                      <td>{data?.last_analysis_stats[e]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Object.keys(data?.last_analysis_stats) < 1 && (
                <p className="h4 text-center">No Record</p>
              )}
            </div>
          </div>

          <div className="my-3">
            <p className="h5">File Hashes</p>
            <table className="table table-hover table-light">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#ef3636", color: "#ffffff" }}>
                    Keys
                  </th>
                  <th style={{ backgroundColor: "#ef3636", color: "#ffffff" }}>
                    Values
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: "bold" }}>MD5</td>
                  <td>{data?.md5 || " - "}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>SHA1</td>
                  <td>{data?.sha1 || " - "}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>SHA256</td>
                  <td>{data?.sha256 || " - "}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h4 className="text-center my-5">No File Scanned</h4>
      )}
    </>
  );
}
