import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./PopularPlaces.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const PopularPlaces = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        console.log("Fetching popular places...");
        const response = await fetch(
          "http://localhost:4000/api/cities/popular/places"
        );

        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`);
          throw new Error("Failed to fetch places");
        }

        const text = await response.text();
        console.log("Raw response:", text);

        let data;
        try {
          data = JSON.parse(text);
          console.log("Parsed places data:", data);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          throw new Error("Invalid response format");
        }

        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
        toast.error("Could not load popular places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

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

  // Add error handling for images
  const ImageWithFallback = ({ src, alt, className }) => {
    const [imgError, setImgError] = useState(false);

    // Transform image path
    const transformedSrc = !src
      ? "/logo192.png"
      : src.startsWith("http")
      ? src
      : src.startsWith("/images")
      ? `http://localhost:4000${src}`
      : `http://localhost:4000/images/${src}`;

    return (
      <img
        src={imgError ? "/logo192.png" : transformedSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          console.error(`Image load error: ${transformedSrc}`);
          setImgError(true);
        }}
      />
    );
  };

  if (loading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  if (!places || places.length === 0) {
    return <div className={styles.noPlaces}>{t('noPopularPlaces')}</div>;
  }

  return (
    <section className={styles.popularPlacesSection}>
      <h2 className={styles.sectionTitle}>{t('popularPlaces')}</h2>
      <div className={styles.carouselContainer}>
        <button
          className={`${styles.scrollButton} ${styles.leftButton}`}
          onClick={() => handleScroll("left")}
        >
          <FaChevronLeft />
        </button>
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {places.map((place, index) => {
            const cityKey = place.name.toLowerCase();
            return (
              <div key={index} className={styles.placeCard}>
                <Link
                  to={place.route || `/${cityKey}`}
                  className={styles.imageLink}
                >
                  <div className={styles.imageContainer}>
                    <ImageWithFallback
                      src={place.image}
                      alt={t(`city.${cityKey}`)}
                      className={styles.placeImage}
                    />
                    <div className={styles.placeName}>
                      <h3>{t(`city.${cityKey}`)}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
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

export default PopularPlaces;