import React from "react";
import CityTemplate from "../CityTemplate/CityTemplate";
import { citiesData } from "../data/citiesData";

const Nagarkot = ({ savedProperties, setSavedProperties }) => {
  return (
    <CityTemplate
      cityData={citiesData.nagarkot}
      savedProperties={savedProperties}
      setSavedProperties={setSavedProperties}
    />
  );
};

export default Nagarkot;
