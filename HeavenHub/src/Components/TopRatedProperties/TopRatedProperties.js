import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./TopRatedProperties.module.css";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const TopRatedProperties = ({ savedProperties, setSavedProperties }) => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/cities/hotels/top-rated"
        );
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Failed to load top rated properties");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const toggleSaveProperty = async (property) => {
    try {
      const token = localStorage.getItem("token");
      const isPropertySaved = savedProperties && savedProperties[property.id];

      // Check if user is logged in
      if (!token) {
        toast.warning("Please log in to save properties to favorites");
        return;
      }

      // If logged in, update on server
      const method = isPropertySaved ? "DELETE" : "POST";
      const url =
        method === "DELETE"
          ? `http://localhost:4000/api/favorites/remove/${property.id}`
          : "http://localhost:4000/api/favorites/add";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                propertyId: property.id,
                name: property.name,
                city: property.cityName || "",
                image: Array.isArray(property.image)
                  ? property.image[0]
                  : property.image,
                rating: property.rating || 0,
              })
            : null,
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      // Update local state
      if (isPropertySaved) {
        const { [property.id]: removed, ...rest } = savedProperties;
        setSavedProperties(rest);
        localStorage.setItem("savedProperties", JSON.stringify(rest));
        toast.success("Property removed from favorites");
      } else {
        const updatedProperties = {
          ...savedProperties,
          [property.id]: {
            ...property,
            isFavorite: true,
            propertyId: property.id,
          },
        };
        setSavedProperties(updatedProperties);
        localStorage.setItem("savedProperties", JSON.stringify(updatedProperties));
        toast.success("Property added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <section className={styles.topRatedSection}>
      <h2 className={styles.sectionTitle}>{t('topRatedProperties')}</h2>
      <div className={styles.carouselContainer}>
        <button
          className={`${styles.scrollButton} ${styles.leftButton}`}
          onClick={() => handleScroll("left")}
        >
          <FaChevronLeft />
        </button>
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              to={`/hotel-details/${hotel.cityName}/${hotel.id}`}
              className={styles.propertyCard}
            >
              <div className={styles.imageContainer}>
                <img
                  src={hotel.image[0]}
                  alt={hotel.name}
                  className={styles.propertyImage}
                />
                <button
                  className={styles.heartButton}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    toggleSaveProperty(hotel);
                  }}
                >
                  <FaHeart
                    className={
                      savedProperties && savedProperties[hotel.id]
                        ? styles.heartFilled
                        : styles.heartEmpty
                    }
                  />
                </button>
              </div>
              <div className={styles.propertyInfo}>
               <h3>{t(`hotel.${hotel.name}`)}</h3>
                <p className={styles.location}>{t(`location.${hotel.location}`)}</p>
                <p className={styles.price}>
                  {t('currency')} {hotel.price} {t('perNight')}
                </p>
                <p className={styles.rating}>{t('rating')}: {hotel.rating} ★</p>
              </div>
            </Link>
          ))}
        </div>
        <button
          className={`${styles.scrollButton} ${styles.rightButton}`}
          onClick={() => handleScroll("right")}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TopRatedProperties;