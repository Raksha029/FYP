import React, { useState, useEffect, useCallback } from "react";
import styles from "./AdminHotel.module.css";

const PopupForm = React.memo(({ onSubmit, title, onClose, formData, handleInputChange, availableAmenities, setFormData }) => (
  <div
    className={styles.popupOverlay}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      <form onSubmit={onSubmit}>
        <div className={styles.imageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className={styles.imageInput}
          />
        </div>
        <div className={styles.formRow}>
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
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
            type="text"
            name="distance"
            placeholder="Distance from center"
            value={formData.distance}
            onChange={handleInputChange}
            required
          />
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
));
const AdminHotel = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
    amenities: [],
    distance: "",
    reviews: 0,
    image: "",
  });

  // Fetch hotels from all cities
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/cities/all');
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const citiesData = await response.json();
        
        // Flatten hotels from all cities into a single array
        const allHotels = citiesData.flatMap(city => 
          city.hotels.map(hotel => ({
            ...hotel,
            cityName: city.name // Add city name to each hotel
          }))
        );
        
        setHotels(allHotels);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newHotel = {
      id: `hotel${hotels.length + 1}`,
      ...formData,
      reviews: 0,
    };
    setHotels([...hotels, newHotel]);
    setShowAddPopup(false);
    resetForm();
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
        amenities: hotel.amenities,
        distance: hotel.distance,
        reviews: hotel.reviews,
        image: hotel.image,
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

  const handleDeleteConfirm = () => {
    setHotels(hotels.filter((hotel) => !selectedForDelete.includes(hotel.id)));
    setSelectedForDelete([]);
    setIsDeleteMode(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setHotels(
      hotels.map((hotel) =>
        hotel.id === selectedHotel.id ? { ...hotel, ...formData } : hotel
      )
    );
    setShowEditPopup(false);
    resetForm();
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
      image: "",
    });
  };

  

  return (
    <div className={styles.hotelContainer}>
      <div className={styles.header}>
        <h2>Hotel Management</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddPopup(true)}
          >
            Add Hotel
          </button>
          <button
            className={styles.modifyButton}
            onClick={handleEditClick}
            style={{ backgroundColor: isEditMode ? '#ffc107' : '#28a745' }}
          >
            {isEditMode ? 'Cancel Modify' : 'Modify Hotel'}
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            style={{ backgroundColor: isDeleteMode ? '#dc3545' : '#dc3545' }}
          >
            {isDeleteMode ? 'Cancel Delete' : 'Delete Hotel'}
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading hotels...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.hotelTable}>
            <thead>
              <tr>
                {isDeleteMode && <th>Select</th>}
                <th>Name</th>
                <th>City</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Amenities</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
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
              ))}
            </tbody>
          </table>
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