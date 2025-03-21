import React from "react";
import CityTemplate from "../CityTemplate/CityTemplate";
import { citiesData } from "../data/citiesData";

const Janakpur = ({ savedProperties, setSavedProperties }) => {
  return (
    <CityTemplate
      cityData={citiesData.janakpur}
      savedProperties={savedProperties}
      setSavedProperties={setSavedProperties}
    />
  );
};

export default Janakpur;
