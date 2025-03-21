import React from "react";
import CityTemplate from "../CityTemplate/CityTemplate";
import { citiesData } from "../data/citiesData";

const Kathmandu = ({ savedProperties, setSavedProperties }) => {
  return (
    <CityTemplate
      cityData={citiesData.kathmandu}
      savedProperties={savedProperties}
      setSavedProperties={setSavedProperties}
    />
  );
};

export default Kathmandu;
