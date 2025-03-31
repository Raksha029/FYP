const API_BASE_URL = "http://localhost:4000/api";

// Fetch all cities
export const fetchCities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/all`);
    if (!response.ok) throw new Error("Failed to fetch cities");
    return response.json();
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// Fetch specific city data
export const fetchCityData = async (cityName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/${cityName}`);
    if (!response.ok) throw new Error("Failed to fetch city data");
    return response.json();
  } catch (error) {
    console.error("Error fetching city data:", error);
    throw error;
  }
};

// Fetch top rated properties
export const fetchTopRatedProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/hotels/top-rated`);
    if (!response.ok) throw new Error("Failed to fetch top rated properties");
    return response.json();
  } catch (error) {
    console.error("Error fetching top rated properties:", error);
    throw error;
  }
};

// Fetch popular places
export const fetchPopularPlaces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/popular/places`);
    if (!response.ok) throw new Error("Failed to fetch popular places");
    return response.json();
  } catch (error) {
    console.error("Error fetching popular places:", error);
    throw error;
  }
};

// Fetch hotel details
export const fetchHotelDetails = async (cityName, hotelId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cities/${cityName}/hotels/${hotelId}`
    );
    if (!response.ok) throw new Error("Failed to fetch hotel details");
    return response.json();
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    throw error;
  }
};