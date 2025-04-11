import React, { useState, useEffect, useCallback } from "react";
import styles from "./AdminRoom.module.css";



const PopupForm = ({ onSubmit, title, onClose, formData, handleInputChange }) => {
  return (
    <div className={styles.popupOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
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
  );
};



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

 
  return (
    <div className={styles.roomContainer}>
      <div className={styles.header}>
        <h2>Rooms Management</h2>
        <div className={styles.actions}>
          <button className={styles.addButton} onClick={() => setShowAddPopup(true)}>
            Add Room
          </button>
          <button
            className={styles.modifyButton}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ backgroundColor: isEditMode ? "#ffc107" : "#28a745" }}
          >
            {isEditMode ? "Cancel Modify" : "Modify Room"}
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            style={{ backgroundColor: isDeleteMode ? "#dc3545" : "#dc3545" }}
          >
            {isDeleteMode ? "Cancel Delete" : "Delete Room"}
          </button>
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
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className={styles.editableRow}
                  onClick={() => handleRoomSelect(room)}
                >
                  {isDeleteMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedForDelete.includes(room.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleDeleteSelect(room.id);
                        }}
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
      )}

{showAddPopup && (
  <PopupForm
    onSubmit={handleAddSubmit}
    title="Add New Room"
    onClose={() => setShowAddPopup(false)}
    formData={formData}
    handleInputChange={handleInputChange}
  />
)}

{showEditPopup && (
  <PopupForm
    onSubmit={handleEditSubmit}
    title="Edit Room"
    onClose={() => setShowEditPopup(false)}
    formData={formData}
    handleInputChange={handleInputChange}
  />
)}


      {isEditMode && (
        <div className={styles.editPrompt}>Click on a room to edit its information</div>
      )}

      {isDeleteMode && (
        <div className={styles.deleteConfirm}>
          <button className={styles.deleteConfirmButton} onClick={handleDeleteConfirm}>
            Delete Selected ({selectedForDelete.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminRoom;
