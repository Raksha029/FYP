import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Favourites.module.css";

const Favourites = ({ savedProperties, setSavedProperties }) => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const favoriteProperties = await response.json();
          setFavorites(favoriteProperties);

          // Update global savedProperties state
          const favoritesMap = favoriteProperties.reduce((acc, prop) => {
            acc[prop.propertyId] = {
              ...prop,
              isFavorite: true,
            };
            return acc;
          }, {});

          setSavedProperties(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [setSavedProperties]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/favorites/remove/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setFavorites((prev) =>
          prev.filter((prop) => prop.propertyId !== propertyId)
        );

        // Update global savedProperties
        setSavedProperties((prev) => {
          const updated = { ...prev };
          delete updated[propertyId];
          return updated;
        });

        toast.success("Removed from favourites", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
    }
  };

  const handleViewDetails = (propertyId, city) => {
    navigate(`/hotel-details/${city}/${propertyId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.favoritesContainer}>
        <h2 className={styles.favoritesTitle}>My Favorites</h2>
        {favorites.length === 0 ? (
          <p className={styles.emptyState}>No favorites added yet</p>
        ) : (
          <div className={styles.favoritesList}>
            {favorites.map((property) => (
              <div key={property.propertyId} className={styles.favoriteItem}>
                <img
                  src={property.image}
                  alt={property.name}
                  className={styles.propertyImage}
                />
                <div className={styles.propertyDetails}>
                  <h3>{property.name}</h3>
                  <p>{property.city}</p>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() =>
                        handleViewDetails(property.propertyId, property.city)
                      }
                    >
                      View Details
                    </button>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveFavorite(property.propertyId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
