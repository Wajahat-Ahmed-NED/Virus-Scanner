import React, { useState } from "react";

let data = null;

const holdData = (prop) => {
  data = prop;
};

const getData = () => {
  return data;
};

export { holdData, getData };
