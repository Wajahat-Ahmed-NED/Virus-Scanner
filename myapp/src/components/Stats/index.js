import React, { useEffect, useState } from "react";
import { DonutChart } from "react-circle-chart";
import { getData } from "../../Utilities";

function Stats() {
  const [res, setRes] = useState({ malicious: 0, suspicious: 0, total: 0 });

  useEffect(() => {
    let data = getData()?.data?.attributes;
    console.log(data);
    res["malicious"] = data?.last_analysis_stats?.malicious || 0;
    res["suspicious"] = data?.last_analysis_stats?.suspicious || 0;
    res["total"] = Object.keys(data?.last_analysis_results)?.length || 0;
    console.log(res);
    setRes({ ...res });
  }, []);

  return (
    <>
      {res && (
        <div className="my-5 d-flex justify-content-between">
          <div
            className="text-center  px-5 py-2 border mx-2"
            style={{
              width: "100%",
              borderRadius: "5px",
              backgroundColor: "#eceef4",
            }}
          >
            <h3>Malicious Ratio</h3>
            <hr />

            <DonutChart
              trackColor="#cdcdcd"
              size="130"
              totalFontSize="22px"
              tooltipFontSize="16px"
              roundedCaps={false}
              showTotal={true}
              backgroundTooltipColor="#000000"
              items={[
                {
                  value: Math.ceil((res?.malicious / res?.total) * 100),
                  label: "Malicious Found",
                  color: "#c52420",
                },
              ]}
            />
          </div>
          <div
            className="text-center  px-5 py-2 border mx-2 "
            style={{
              width: "100%",
              borderRadius: "5px",
              backgroundColor: "#eceef4",
            }}
          >
            <h3>Malicious Detected</h3>
            <hr />
            <br />
            <h4>
              <span style={{ color: "#c52420" }}>{res?.malicious}</span>/
              {res?.total}
            </h4>
            <br />
            <p>
              {res?.malicious} malicious out of {res?.total} & {res?.suspicious}{" "}
              suspicious out of {res?.total}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Stats;
