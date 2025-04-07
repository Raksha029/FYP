import React, { useState, useEffect } from "react";
import styles from "./AdminRoom.module.css";

const AdminRoom = () => {
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

  // Fetch rooms from all hotels in all cities
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/cities/all');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const citiesData = await response.json();
        
        // Flatten rooms from all hotels in all cities into a single array
        const allRooms = citiesData.flatMap(city => 
          city.hotels.flatMap(hotel => 
            hotel.rooms.map(room => ({
              ...room,
              hotelName: hotel.name,
              cityName: city.name
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changing:", name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: `room${Date.now()}`,
      type: formData.type,
      price: Number(formData.price),
      capacity: formData.capacity,
      availability: Number(formData.availability),
      description: formData.description,
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
      price: room.price,
      capacity: room.capacity,
      availability: room.availability,
      description: room.description,
    });
    setShowEditPopup(true);
  };

  const handleDeleteSelect = (roomId) => {
    setSelectedForDelete((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const handleDeleteConfirm = () => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => !selectedForDelete.includes(room.id))
    );
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

  const PopupForm = ({ onSubmit, title, onClose }) => (
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
          <div className={styles.formRow}>
            <input
              type="text"
              name="type"
              placeholder="Room Type"
              value={formData.type}
              onChange={handleInputChange}
              autoComplete="off"
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
              autoComplete="off"
              required
            />
            <input
              type="text"
              name="capacity"
              placeholder="Capacity (e.g., 2 Adults)"
              value={formData.capacity}
              onChange={handleInputChange}
              autoComplete="off"
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
          <button type="submit" className={styles.submitBtn}>
            {title}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.roomContainer}>
      <div className={styles.header}>
        <h2>Rooms Management</h2>
        <div className={styles.actions}>
          <button className={styles.addButton}>Add Room</button>
          <button className={styles.modifyButton}>Modify Room</button>
          <button className={styles.deleteButton}>Delete Room</button>
        </div>
      </div>

      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.roomTable}>
            <thead>
              <tr>
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
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.type}</td>
                  <td>{room.hotelName}</td>
                  <td>{room.cityName}</td>
                  <td>${room.price}</td>
                  <td>{room.capacity}</td>
                  <td>{room.available}</td>
                  <td>{room.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRoom;