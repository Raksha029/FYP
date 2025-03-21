import React from "react";
import CityTemplate from "../CityTemplate/CityTemplate";
import { citiesData } from "../data/citiesData";

const Lalitpur = ({ savedProperties, setSavedProperties }) => {
  return (
    <CityTemplate
      cityData={citiesData.lalitpur}
      savedProperties={savedProperties}
      setSavedProperties={setSavedProperties}
    />
  );
};

export default Lalitpur;
