import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./AdminRoom.module.css";
import { useNotification } from "../../context/NotificationContext";

const PopupForm = ({ onSubmit, title, onClose, formData, handleInputChange, cities, hotels, onCityChange, onHotelChange }) => {
  return (
    <div className={styles.popupOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={onSubmit}>
            <div className={styles.selectionRow}>
              <select
                name="cityName"
                value={formData.cityName}
                onChange={(e) => {
                  handleInputChange(e);
                  onCityChange(e.target.value);
                }}
                required
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city._id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            
              <select
                name="hotelId"
                value={formData.hotelId}
                onChange={(e) => {
                  handleInputChange(e);
                  onHotelChange(e.target.value);
                }}
                required
                disabled={!formData.cityName}
              >
                <option value="">Select Hotel</option>
                {hotels && hotels.map(hotel => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <input
                type="text"
                name="type"
                placeholder="Room Type"
                value={formData.type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="capacity"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <input
                type="number"
                name="availability"
                placeholder="Available Rooms"
                value={formData.availability}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <textarea
                name="description"
                placeholder="Room Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className={styles.description}
              />
            </div>
            <button type="submit" className={styles.submitBtn}>{title}</button>
          </form>
        </div>
      </div>
    </div>
  );
};


const AdminRoom = () => {
  // Change roomsPerPage from 7 to 5
  const [currentPage, setCurrentPage] = useState(1);
  const { addNotification } = useNotification();
  const [roomsPerPage] = useState(5); // Changed from 7 to 5
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [hotels, setHotels] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedHotel, setSelectedHotel] = useState(''); // Correct declaration

  const [formData, setFormData] = useState({
    type: "",
    price: "",
    capacity: "",
    availability: "",
    description: "",
    cityName: "",
    hotelId: "",
  });


const handleCityChange = (cityName) => {
  setSelectedCity(cityName);
  setFormData(prev => ({ ...prev, cityName, hotelId: '' }));
};

const handleHotelChange = (hotelId) => {
  setSelectedHotel(hotelId);
  setFormData(prev => ({ ...prev, hotelId }));
};

// Add this useEffect for fetching cities
useEffect(() => {
  const fetchCitiesAndHotels = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/cities/all");
      if (!response.ok) throw new Error("Failed to fetch cities");

      const citiesData = await response.json();
      setCities(citiesData);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchCitiesAndHotels();
}, []);

// Add this useEffect for updating hotels when city changes
useEffect(() => {
  if (selectedCity) {
    const cityData = cities.find(city => city.name === selectedCity);
    if (cityData && cityData.hotels) {
      const hotelsWithIds = cityData.hotels.map(hotel => ({
        ...hotel,
        _id: hotel._id || hotel.id // Handle both _id and id cases
      }));
      setHotels(hotelsWithIds);
    } else {
      setHotels([]);
    }
    if (!formData.hotelId) {
      setSelectedHotel('');
      setFormData(prev => ({ ...prev, hotelId: '' }));
    }
  } else {
    setHotels([]);
    setSelectedHotel('');
    setFormData(prev => ({ ...prev, hotelId: '' }));
  }
}, [selectedCity, cities, formData.hotelId, setSelectedHotel]); // Added setSelectedHotel to dependency array

// Update the fetchRooms useEffect to include hotelId
useEffect(() => {
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/cities/all");
      if (!response.ok) throw new Error("Failed to fetch rooms");

      const citiesData = await response.json();

      // In fetchRooms useEffect
      const allRooms = citiesData.flatMap((city, cityIndex) =>
        city.hotels.flatMap((hotel, hotelIndex) =>
          hotel.rooms.map((room, roomIndex) => ({
            ...room,
            id: room._id || room.id || `room_NPR{cityIndex}_NPR{hotelIndex}_NPR{roomIndex}`,
            hotelId: hotel._id,
            hotelName: hotel.name,
            cityName: city.name,
            availability: room.availableRooms || room.available || 0,
          }))
        )
      );

      setRooms(allRooms);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchRooms();
}, []);

// Update handleRoomSelect to properly set the city and hotel
const handleRoomSelect = (room) => {
  if (!isEditMode) return;
  setSelectedRoom(room);
  
  // First set the city to trigger hotel list update
  setSelectedCity(room.cityName);
  setSelectedHotel(room.hotelId);
  
  // Set form data
  setFormData({
    type: room.type,
    price: String(room.price),
    capacity: room.capacity,
    availability: String(room.availability),
    description: room.description,
    cityName: room.cityName,
    hotelId: room.hotelId,
  });

  // Find the city data to get hotels
  const cityData = cities.find(city => city.name === room.cityName);
  if (cityData && cityData.hotels) {
    const hotelsWithIds = cityData.hotels.map(hotel => ({
      ...hotel,
      _id: hotel._id || hotel.id
    }));
    setHotels(hotelsWithIds);
  }
  
  setShowEditPopup(true);
};

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/cities/rooms/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityName: formData.cityName,
          hotelId: formData.hotelId,
          roomData: {
            type: formData.type,
            price: Number(formData.price),
            capacity: formData.capacity,
            available: Number(formData.availability),
            description: formData.description,
          },
        }),
      });
  
      if (!response.ok) throw new Error("Failed to add room");
      const newRoom = await response.json();
      const hotelName = hotels.find(h => h._id === formData.hotelId)?.name;
  
    
      // Create a complete room object with all necessary data
      const completeNewRoom = {
        ...newRoom,
        id: newRoom._id,
        cityName: formData.cityName,
        hotelId: formData.hotelId,
        hotelName: hotels.find(h => h._id === formData.hotelId)?.name,
        type: formData.type,
        price: Number(formData.price),
        capacity: formData.capacity,
        availability: Number(formData.availability),
        description: formData.description
      };
  
      setRooms(prevRooms => [...prevRooms, completeNewRoom]);
      
      addNotification({
        type: 'success',
        message: `Room "${formData.type}" has been successfully added to ${hotelName}`, messageKey: 'roomAdded',
        messageParams: { roomType: formData.type, hotelName }
      });
      
      // Add to admin notifications
const existingAdminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
localStorage.setItem('adminNotifications', JSON.stringify([{
  id: Date.now(),
  type: 'room_added',
  message: `Room "${formData.type}" has been successfully added to ${hotelName}`, time: new Date().toLocaleTimeString(),
  read: false
},  ...existingAdminNotifications
]));
    
      setShowAddPopup(false);
      resetForm();
    } catch (error) {
      console.error("Error adding room:", error);
      addNotification({
        type: 'error',
        message: `Failed to add room: ${error.message}`,
        messageKey: 'roomAddError',
        messageParams: { error: error.message }
      });
      setError(error.message);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/cities/rooms/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityName: selectedRoom.cityName,
          hotelId: selectedRoom.hotelId,
          roomId: selectedRoom.id,
          updatedRoom: {
            type: formData.type,
            price: Number(formData.price),
            capacity: formData.capacity,
            available: Number(formData.availability),
            description: formData.description,
          },
        }),
      });
  
      if (!response.ok) throw new Error("Failed to update room");
  
      const updatedRoomData = await response.json();
  
      // Create a complete updated room object
      const completeUpdatedRoom = {
        ...selectedRoom,
        ...updatedRoomData,
        type: formData.type,
        price: Number(formData.price),
        capacity: formData.capacity,
        availability: Number(formData.availability),
        description: formData.description,
        cityName: selectedRoom.cityName,
        hotelId: selectedRoom.hotelId,
        hotelName: selectedRoom.hotelName
      };
  
      // Update rooms state immediately with the new data
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === selectedRoom.id ? completeUpdatedRoom : room
        )
      );

      addNotification({
        type: 'success1',
        message: `Room "${formData.type}" has been successfully updated in ${selectedRoom.hotelName}`,messageKey: 'roomUpdated',
        messageParams: { roomType: formData.type, hotelName: selectedRoom.hotelName }
      });

      const existingAdminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      localStorage.setItem('adminNotifications', JSON.stringify([{
       id: Date.now(),
       type: 'room_updated',
       message: `Room "${formData.type}" has been successfully updated in ${selectedRoom.hotelName}`, time: new Date().toLocaleTimeString(),
       read: false
      },  ...existingAdminNotifications
      ]));
      
      setShowEditPopup(false);
      setSelectedRoom(null);
      resetForm();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating room:", error);
      addNotification({
        type: 'error',
        message: `Failed to update room: ${error.message}`, messageKey: 'roomUpdateError',
        messageParams: { error: error.message }
      });
      setError(error.message);
    }
  };
  

  const handleDeleteSelect = (roomId) => {
    setSelectedForDelete((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedForDelete.length === 0) return;

      const roomsToDelete = rooms.filter(room => selectedForDelete.includes(room.id));
      const roomDetails = roomsToDelete.map(room => `${room.type} (${room.hotelName})`).join(', ');
      const roomToDelete = roomsToDelete[0];
      if (!roomToDelete) return;
  
      const response = await fetch("http://localhost:4000/api/cities/rooms", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityName: roomToDelete.cityName,
          hotelId: roomToDelete.hotelId,
          roomIds: selectedForDelete
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      // Update local state after successful deletion
      setRooms(prev => 
        prev.filter(room => !selectedForDelete.includes(room.id))
      );
      addNotification({
        type: 'success2',
        message: selectedForDelete.length === 1 ? `Room ${roomDetails} has been successfully deleted`
        : `Rooms ${roomDetails} have been successfully deleted`, messageKey: 'roomsDeleted',
        messageParams: { 
          count: selectedForDelete.length,roomDetails
        }
      });

      const existingAdminNotifications = JSON.parse(localStorage.getItem
        ('adminNotifications') || '[]');
      localStorage.setItem('adminNotifications', JSON.stringify([{
  id: Date.now(),
  type: 'room_deleted',
  message: selectedForDelete.length === 1 ? `Room ${roomDetails} has been successfully deleted`
  : `Rooms ${roomDetails} have been successfully deleted`,
time: new Date().toLocaleTimeString(),
read: false
},  ...existingAdminNotifications
]));

      setSelectedForDelete([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("Deletion error:", error);
      addNotification({
        type: 'error',
        message: `Failed to delete rooms: ${error.message}`,
        messageKey: 'roomsDeleteError',
        messageParams: { error: error.message }
      });
      setError(error.message);
    }
  };

  // Add pagination calculations after the useEffect and before the handlers
  const { searchQuery } = useOutletContext();

  // Add filtered rooms functionality
  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    
    const query = searchQuery.toLowerCase();
    return rooms.filter(room => 
      room.type.toLowerCase().includes(query) ||
      room.hotelName?.toLowerCase().includes(query) ||
      room.cityName?.toLowerCase().includes(query)
    );
  }, [rooms, searchQuery]);

  // Update pagination to use filteredRooms
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Add this function before handleAddClick
  const resetForm = () => {
    setFormData({
      type: "",
      price: "",
      capacity: "",
      availability: "",
      description: "",
      cityName: "",
      hotelId: "",
    });
    setSelectedCity('');
    setSelectedHotel(''); 
  };

  const handleAddClick = () => {
    resetForm();
    setShowAddPopup(true);
  };
  
  // Inside AdminRoom component, replace the return statement
  // Add these handler functions before the return statement
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setIsDeleteMode(false);
    setSelectedForDelete([]);
  };
  
  const handleDeleteClick = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsEditMode(false);
    setSelectedForDelete([]);
  };
  
  // Update the return statement buttons section
  return (
    <div className={styles.roomContainer}>
      <div className={styles.header}>
        <h2>Rooms Management</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={handleAddClick}
            disabled={isEditMode || isDeleteMode}
            style={{ 
              backgroundColor: isEditMode || isDeleteMode ? '#e2e8f0' : '#6366f1',
              color: isEditMode || isDeleteMode ? '#94a3b8' : 'white',
              cursor: isEditMode || isDeleteMode ? 'not-allowed' : 'pointer'
            }}
          >
            Add Room
          </button>
          <button
            className={`${styles.modifyButton} ${isEditMode ? styles.activeEdit : ''}`}
            onClick={handleEditClick}
            disabled={isDeleteMode}
            style={{ 
              backgroundColor: isDeleteMode ? '#e2e8f0' : isEditMode ? '#eab308' : '#6366f1',
              color: isDeleteMode ? '#94a3b8' : 'white',
              cursor: isDeleteMode ? 'not-allowed' : 'pointer'
            }}
          >
            {isEditMode ? "Cancel Room" : "Modify Room"}
          </button>
          <button
            className={`${styles.deleteButton} ${isDeleteMode ? styles.activeDelete : ''}`}
            onClick={handleDeleteClick}
            disabled={isEditMode}
            style={{ 
              backgroundColor: isEditMode ? '#e2e8f0' : '#ef4444',
              color: isEditMode ? '#94a3b8' : 'white',
              cursor: isEditMode ? 'not-allowed' : 'pointer'
            }}
          >
            {isDeleteMode ? "Cancel Room" : "Delete Room"}
          </button>
        </div>
      </div>
  
      {/* Table container */}
      <div className={styles.tableContainer}>
        <table className={styles.roomTable}>
          <thead>
            <tr>
              {isDeleteMode && <th>Select</th>}
              <th>Type</th>
              <th>Hotel</th>
              <th>City</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr
                  key={room.id}
                  className={`NPR{styles.editableRow} NPR{
                    selectedRoom?.id === room.id ? styles.selected : ""
                  }`}
                  onClick={() => isEditMode && handleRoomSelect(room)}
                >
                  {isDeleteMode && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedForDelete.includes(room.id)}
                        onChange={() => handleDeleteSelect(room.id)}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  <td>{room.type}</td>
                  <td>{room.hotelName}</td>
                  <td>{room.cityName}</td>
                  <td>NPR{room.price}</td>
                  <td>{room.capacity}</td>
                  <td>{room.availability}</td>
                  <td>{room.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isDeleteMode ? 8 : 7} className={styles.noResults}>
                  No rooms found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination - Only show when there are results */}
      {currentRooms.length > 0 && !loading && !error && (
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
    {/* Mode-specific prompts */}
    {isEditMode && (
      <div className={styles.editPrompt}>
        Click on a room to edit its information
      </div>
    )}

    {isDeleteMode && selectedForDelete.length > 0 && (
      <div className={styles.deleteConfirm}>
        <button 
          className={styles.deleteConfirmButton}
          onClick={handleDeleteConfirm}
        >
          Delete Selected ({selectedForDelete.length})
        </button>
      </div>
    )}

    {/* Popups */}
    {showAddPopup && (
      <PopupForm
        onSubmit={handleAddSubmit}
        title="Add Room"
        onClose={() => setShowAddPopup(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        cities={cities}
        hotels={hotels}
        onCityChange={handleCityChange}
        onHotelChange={handleHotelChange}
      />
    )}

    {showEditPopup && (
      <PopupForm
        onSubmit={handleEditSubmit}
        title="Edit Room"
        onClose={() => {
          setShowEditPopup(false);
          resetForm();
        }}
        formData={formData}
        handleInputChange={handleInputChange}
        cities={cities}
        hotels={hotels}
        onCityChange={handleCityChange}
        onHotelChange={handleHotelChange}
      />
    )}
  </div>
);
};

export default AdminRoom;