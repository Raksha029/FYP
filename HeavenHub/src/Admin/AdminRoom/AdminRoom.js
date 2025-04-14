import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./AdminRoom.module.css";



const PopupForm = ({ onSubmit, title, onClose, formData, handleInputChange }) => {
  return (
    <div className={styles.popupOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={onSubmit}>
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
  const [roomsPerPage] = useState(7); // Changed from 7 to 5
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [formData, setFormData] = useState({
    type: "",
    price: "",
    capacity: "",
    availability: "",
    description: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/cities/all");
        if (!response.ok) throw new Error("Failed to fetch rooms");

        const citiesData = await response.json();

        const allRooms = citiesData.flatMap((city, cityIndex) =>
          city.hotels.flatMap((hotel, hotelIndex) =>
            hotel.rooms.map((room, roomIndex) => ({
              ...room,
              id: room.id || `room_${cityIndex}_${hotelIndex}_${roomIndex}`,
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: `room${Date.now()}`,
      type: formData.type,
      price: Number(formData.price),
      capacity: formData.capacity,
      availability: Number(formData.availability),
      description: formData.description,
      hotelName: "N/A",
      cityName: "N/A",
    };

    setRooms((prevRooms) => [...prevRooms, newRoom]);
    setFormData({
      type: "",
      price: "",
      capacity: "",
      availability: "",
      description: "",
    });
    setShowAddPopup(false);
  };

  const handleRoomSelect = (room) => {
    if (!isEditMode) return;
    setSelectedRoom(room);
    setFormData({
      type: room.type,
      price: String(room.price),
      capacity: room.capacity,
      availability: String(room.availability),
      description: room.description,
    });
    setShowEditPopup(true);
  };

  const handleDeleteSelect = (roomId) => {
    setSelectedForDelete((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const handleDeleteConfirm = () => {
    setRooms((prevRooms) => prevRooms.filter((room) => !selectedForDelete.includes(room.id)));
    setSelectedForDelete([]);
    setIsDeleteMode(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              type: formData.type,
              price: Number(formData.price),
              capacity: formData.capacity,
              availability: Number(formData.availability),
              description: formData.description,
            }
          : room
      )
    );
    setShowEditPopup(false);
    setSelectedRoom(null);
    setFormData({
      type: "",
      price: "",
      capacity: "",
      availability: "",
      description: "",
    });
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
    });
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
          >
            Add Room
          </button>
          <button
            className={`${styles.modifyButton} ${isEditMode ? styles.activeEdit : ''}`}
            onClick={handleEditClick}
            disabled={isDeleteMode}
          >
            {isEditMode ? "Cancel Room" : "Modify Room"}
          </button>
          <button
            className={`${styles.deleteButton} ${isDeleteMode ? styles.activeDelete : ''}`}
            onClick={handleDeleteClick}
            disabled={isEditMode}
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
            {currentRooms.map((room) => (
              <tr
                key={room.id}
                className={`${styles.editableRow} ${
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
                <td>${room.price}</td>
                <td>{room.capacity}</td>
                <td>{room.availability}</td>
                <td>{room.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Pagination */}
      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
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
        title="Add New Room"
        onClose={() => {
          setShowAddPopup(false);
          resetForm();
        }}
        formData={formData}
        handleInputChange={handleInputChange}
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
      />
    )}
  </div>
);
};

export default AdminRoom;