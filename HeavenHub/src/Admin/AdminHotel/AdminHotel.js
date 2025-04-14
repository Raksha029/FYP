import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./AdminHotel.module.css";
import { useOutletContext } from "react-router-dom";

// Move PopupForm component definition here, before AdminHotel
const PopupForm = React.memo(
  ({
    onSubmit,
    title,
    onClose,
    formData,
    handleInputChange,
    availableAmenities,
    setFormData,
    cities,
  }) => (
    <div
      className={styles.popupOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.formRow}>
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {/* Add city selection dropdown */}
            <select
              name="cityName"
              value={formData.cityName || ""}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <input
              type="number"
              name="price"
              placeholder="Price per night"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating (0-5)"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <input
              type="number"
              name="distance"
              placeholder="Distance from city center"
              value={formData.distance}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <textarea
              name="description"
              placeholder="Hotel Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className={styles.descriptionInput}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formRow}>
              <div className={styles.imageUploadSection}>
                <h4>Main Image</h4> {/* Removed required indicator */}
                <label className={styles.imageInputLabel}>
                  <span>Click to upload main image (optional)</span>
                  <input
                    type="file"
                    name="mainImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          mainImageFile: file,
                          image: [URL.createObjectURL(file)],
                        }));
                      }
                    }}
                    className={styles.imageInput}
                  />{" "}
                  {/* Removed required attribute */}
                </label>
                {formData.image[0] && (
                  <img
                    src={formData.image[0]}
                    alt="Main Preview"
                    className={styles.imagePreview}
                  />
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.imageUploadSection}>
                <h4>Detail Images</h4>
                <label className={styles.imageInputLabel}>
                  <span>Click to upload multiple images</span>
                  <input
                    type="file"
                    name="detailImages"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        setFormData((prev) => ({
                          ...prev,
                          detailImageFiles: files,
                          detailsImage: files.map((file) =>
                            URL.createObjectURL(file)
                          ),
                        }));
                      }
                    }}
                    className={styles.imageInput}
                  />
                </label>
                {formData.detailsImage.length > 0 && (
                  <div className={styles.imagePreviewGrid}>
                    {formData.detailsImage.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Detail Preview ${index + 1}`}
                        className={styles.imagePreview}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.amenitiesSection}>
            <h3>Amenities</h3>
            <div className={styles.amenitiesGrid}>
              {availableAmenities.map((amenity) => (
                <label key={amenity} className={styles.amenityLabel}>
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        amenities: prev.amenities.includes(amenity)
                          ? prev.amenities.filter((a) => a !== amenity)
                          : [...prev.amenities, amenity],
                      }));
                    }}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {title}
          </button>
        </form>
      </div>
    </div>
  )
);
const AdminHotel = () => {
  const [cities, setCities] = useState([]);

  // Add useEffect for fetching cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/cities/all");
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const citiesData = await response.json();
        setCities(citiesData); // Now setCities is being used
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Keep only this formData declaration and remove the duplicate one below
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
    amenities: [],
    distance: "",
    reviews: 0,
    image: [],
    detailsImage: [],
    description: "",
    coords: [0, 0], // Default coordinates
    cityName: "", // Add this field
  });

  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(7);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove this duplicate formData declaration
  // const [formData, setFormData] = useState({...});

  const { searchQuery } = useOutletContext();

  // Add filtered hotels functionality using searchQuery
  const filteredHotels = useMemo(() => {
    if (!searchQuery) return hotels;

    const query = searchQuery.toLowerCase();
    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(query) ||
        hotel.cityName?.toLowerCase().includes(query) ||
        hotel.location?.toLowerCase().includes(query)
    );
  }, [hotels, searchQuery]);

  // Add pagination calculations using hotelsPerPage
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  // Add pagination handler using setCurrentPage
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Define fetchHotels at component level
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/cities/all");
      if (!response.ok) {
        throw new Error("Failed to fetch hotels");
      }
      const citiesData = await response.json();

      const allHotels = citiesData.flatMap((city) =>
        city.hotels.map((hotel) => ({
          ...hotel,
          cityName: city.name,
          image:
            hotel.image?.map((img) =>
              img.startsWith("http") ? img : `http://localhost:4000${img}`
            ) || [],
          detailsImage:
            hotel.detailsImage?.map((img) =>
              img.startsWith("http") ? img : `http://localhost:4000${img}`
            ) || [],
        }))
      );

      setHotels(allHotels);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Use fetchHotels in useEffect
  useEffect(() => {
    fetchHotels();
  }, []);

  // Remove the duplicate fetchHotels definition from the other useEffect
  const availableAmenities = [
    "5-Star Luxury",
    "Multiple Restaurants",
    "Spa",
    "Pool",
    "Tennis Court",
    "Wi-Fi",
    "Parking",
    "Room Service",
    "Bar",
    "Conference Room",
    "Business Center",
    "Laundry Service",
    "Airport Shuttle",
  ];

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);
  
  // Add to your existing functions:
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("distance", formData.distance);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("cityName", formData.cityName);

      // Handle amenities
      formData.amenities.forEach((amenity, index) => {
        formDataToSend.append(`amenities[${index}]`, amenity);
      });

      // Optional: Handle files if provided
      if (formData.mainImageFile) {
        formDataToSend.append("mainImage", formData.mainImageFile);
      }
      if (formData.detailImageFiles) {
        formData.detailImageFiles.forEach((file) => {
          formDataToSend.append("detailImages", file);
        });
      }

      console.log("Sending form data:", formDataToSend);

      const response = await fetch(
        `http://localhost:4000/api/cities/${formData.cityName}/hotels`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      await response.json(); // Remove the newHotel variable assignment

      // Update state by fetching fresh data from server
      await fetchHotels();

      setShowAddPopup(false);
      resetForm();
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert(`Error adding hotel: ${error.message}`);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setIsDeleteMode(false);
    setSelectedHotel(null);
    setSelectedForDelete([]);
  };

  const handleDeleteClick = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsEditMode(false);
    setSelectedHotel(null);
    setSelectedForDelete([]);
  };

  const handleHotelSelect = (hotel) => {
    if (isEditMode) {
      setSelectedHotel(hotel);
      setFormData({
        name: hotel.name,
        location: hotel.location,
        price: hotel.price,
        rating: hotel.rating,
        amenities: hotel.amenities || [],
        distance: hotel.distance,
        reviews: hotel.reviews,
        image:
          hotel.image?.map((img) =>
            img.startsWith("http") ? img : `http://localhost:4000${img}`
          ) || [],
        detailsImage:
          hotel.detailsImage?.map((img) =>
            img.startsWith("http") ? img : `http://localhost:4000${img}`
          ) || [],
        description: hotel.description || "",
        coords: hotel.coords || [0, 0],
        cityName: hotel.cityName || "", // Add this line to include the city name
      });
      setShowEditPopup(true);
      setIsEditMode(false);
    }
  };

  const handleDeleteSelect = (hotelId) => {
    setSelectedForDelete((prev) => {
      if (prev.includes(hotelId)) {
        return prev.filter((id) => id !== hotelId);
      } else {
        return [...prev, hotelId];
      }
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(
        selectedForDelete.map(async (hotelId) => {
          const hotel = hotels.find((h) => h.id === hotelId);
          if (!hotel) return;

          const response = await fetch(
            `http://localhost:4000/api/cities/${hotel.cityName}/hotels/${hotelId}`,
            { method: "DELETE" }
          );

          if (!response.ok) {
            throw new Error("Failed to delete hotel");
          }
        })
      );

      setHotels(
        hotels.filter((hotel) => !selectedForDelete.includes(hotel.id))
      );
      setSelectedForDelete([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Error deleting hotels:", error);
      alert("Error deleting hotels: " + error.message);
    }
  };

  // In your handleEditSubmit function
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all fields except files
      Object.keys(formData).forEach((key) => {
        if (key !== "mainImageFile" && key !== "detailImageFiles") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append main image if changed
      if (formData.mainImageFile) {
        formDataToSend.append("mainImage", formData.mainImageFile);
      }

      // Append detail images if changed
      if (formData.detailImageFiles) {
        formData.detailImageFiles.forEach((file) => {
          formDataToSend.append("detailImages", file);
        });
      }

      const response = await fetch(
        `http://localhost:4000/api/cities/${formData.cityName}/hotels/${selectedHotel.id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update hotel");
      }

      const updatedHotel = await response.json();
      // Update your state with the returned hotel data
      setHotels(
        hotels.map((hotel) =>
          hotel.id === selectedHotel.id ? updatedHotel : hotel
        )
      );
      setShowEditPopup(false);
      resetForm();
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      price: "",
      rating: "",
      amenities: [],
      distance: "",
      reviews: 0,
      image: [],
      detailsImage: [],
      description: "",
      coords: [0, 0],
      cityName: "", // Add this line
    });
  };

  // Modify the Add Hotel button click handler
  const handleAddClick = () => {
    resetForm();
    setShowAddPopup(true);
  };

  // Update the return statement where buttons are rendered
  return (
    <div className={styles.hotelContainer}>
      <div className={styles.header}>
        <h2>Hotels Management</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={handleAddClick}
            disabled={isEditMode || isDeleteMode}
          >
            Add Hotel
          </button>
          <button
            className={`${styles.modifyButton} ${
              isEditMode ? styles.activeEdit : ""
            }`}
            onClick={handleEditClick}
            disabled={isDeleteMode}
          >
            {isEditMode ? "Cancel Hotel" : "Modify Hotel"}
          </button>
          <button
            className={`${styles.deleteButton} ${
              isDeleteMode ? styles.activeDelete : ""
            }`}
            onClick={handleDeleteClick}
            disabled={isEditMode}
          >
            {isDeleteMode ? "Cancel Hotel" : "Delete Hotel"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading hotels...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.hotelTable}>
            <thead>
              <tr>
                {isDeleteMode && <th></th>}
                <th>Name</th>
                <th>City</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Amenities</th>
              </tr>
            </thead>
            <tbody>
              {currentHotels.length > 0 ? (
                currentHotels.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className={styles.editableRow}
                    onClick={() => handleHotelSelect(hotel)}
                  >
                    {isDeleteMode && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedForDelete.includes(hotel.id)}
                          onChange={() => handleDeleteSelect(hotel.id)}
                          className={styles.checkbox}
                        />
                      </td>
                    )}
                    <td>{hotel.name}</td>
                    <td>{hotel.cityName}</td>
                    <td>{hotel.location}</td>
                    <td>{hotel.rating}</td>
                    <td>
                      <div className={styles.amenitiesList}>
                        {hotel.amenities.map((amenity, index) => (
                          <span key={index} className={styles.amenityTag}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isDeleteMode ? 6 : 5} className={styles.noResults}>
                    No hotels found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {currentHotels.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showAddPopup && (
        <PopupForm
          onSubmit={handleAddSubmit}
          title="Add Hotel"
          onClose={() => setShowAddPopup(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          availableAmenities={availableAmenities}
          setFormData={setFormData}
          cities={cities}
        />
      )}

      {showEditPopup && (
        <PopupForm
          onSubmit={handleEditSubmit}
          title="Edit Hotel"
          onClose={() => setShowEditPopup(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          availableAmenities={availableAmenities}
          setFormData={setFormData}
          cities={cities} // Add this line
        />
      )}

      {isEditMode && (
        <div className={styles.editPrompt}>
          Click on a hotel to edit its information
        </div>
      )}

      {isDeleteMode && (
        <div className={styles.deleteConfirm}>
          <button
            className={styles.deleteConfirmButton}
            onClick={handleDeleteConfirm}
          >
            Delete Selected ({selectedForDelete.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminHotel;