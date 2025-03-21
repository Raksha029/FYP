import React from "react";
import CityTemplate from "../CityTemplate/CityTemplate";
import { citiesData } from "../data/citiesData";

const Baktapur = ({ savedProperties, setSavedProperties }) => {
  return (
    <CityTemplate
      cityData={citiesData.baktapur}
      savedProperties={savedProperties}
      setSavedProperties={setSavedProperties}
    />
  );
};

export default Baktapur;
