import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Favourites.module.css";
import { useTranslation } from 'react-i18next';

const Favourites = ({ savedProperties, setSavedProperties }) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Fix the transformImagePath function to handle all image types
  const transformImagePath = (imagePath) => {
    if (!imagePath) return "/logo192.png"; // Default fallback

    // If it's already a full URL, use it as is
    if (imagePath.startsWith("http")) return imagePath;

    // If it's a webpack bundled path from static/media, fix it
    if (imagePath.includes("/static/media/")) {
      // Extract the filename without hash
      const filenameWithExt = imagePath.split("/").pop();
      const filename = filenameWithExt.split(".")[0];

      // Extract the extension from the original path if possible
      const ext = filenameWithExt.match(/\.(jpg|jpeg|png|gif)($|\?)/i);

      // Use the detected extension or try multiple extensions
      if (ext && ext[1]) {
        return `http://localhost:4000/images/${filename}.${ext[1]}`;
      }

      // Special case handling
      if (filename === "kathmandu2") {
        return `http://localhost:4000/images/kathmandu2.png`;
      }

      if (filename === "p1" || filename.startsWith("p")) {
        return `http://localhost:4000/images/${filename}.jpg`;
      }

      if (filename === "l5" || filename.startsWith("l")) {
        return `http://localhost:4000/images/${filename}.jpg`;
      }

      if (filename === "b5" || filename.startsWith("b")) {
        return `http://localhost:4000/images/${filename}.jpg`;
      }

      // Try to preserve the original extension if it's in the filename
      if (filename.includes("png")) {
        return `http://localhost:4000/images/${filename}.png`;
      }

      // Default to jpg if no extension can be determined
      return `http://localhost:4000/images/${filename}.jpg`;
    }

    // If it starts with /images, add the backend URL
    if (imagePath.startsWith("/images")) {
      return `http://localhost:4000${imagePath}`;
    }

    // If it already has an extension, use it as is
    if (/\.(jpg|jpeg|png|gif)$/i.test(imagePath)) {
      return `http://localhost:4000/images/${imagePath}`;
    }

    // Try to infer extension from filename
    if (imagePath.includes("png")) {
      return `http://localhost:4000/images/${imagePath}.png`;
    }

    // Check for special filenames
    if (imagePath === "kathmandu2") {
      return `http://localhost:4000/images/kathmandu2.png`;
    }

    // Default to jpg
    return `http://localhost:4000/images/${imagePath}.jpg`;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:4000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const favoriteProperties = await response.json();

          // Transform image paths in the fetched favorites
          const transformedFavorites = favoriteProperties.map((prop) => ({
            ...prop,
            // Transform the image path
            image: transformImagePath(prop.image),
          }));

          setFavorites(transformedFavorites);

          // Update global savedProperties state
          const favoritesMap = transformedFavorites.reduce((acc, prop) => {
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
        toast.error(t('favourites1.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [setSavedProperties, t]);

  // Add this useEffect to update isFavorited status for all favorites
  useEffect(() => {
    // When savedProperties changes, ensure all favorites are marked as favorited
    const favoritesMap = favorites.reduce((acc, prop) => {
      acc[prop.propertyId] = {
        ...prop,
        isFavorite: true,
      };
      return acc;
    }, {});

    // Merge with existing savedProperties to preserve other properties
    // that might not be in the favorites list
    setSavedProperties((prev) => ({
      ...prev,
      ...favoritesMap,
    }));
  }, [favorites, setSavedProperties]);

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

  // Create an improved ImageWithFallback component that tries different extensions
  const ImageWithFallback = ({ src, alt, className }) => {
    const [finalSrc, setFinalSrc] = useState(transformImagePath(src));

    const handleError = () => {
      console.error(`Image load error for: ${finalSrc}`);

      // If we're already showing the fallback, don't try again
      if (finalSrc === "/logo192.png") return;

      // Try different extensions
      if (finalSrc.endsWith(".jpg")) {
        // Try PNG instead
        const pngSrc = finalSrc.replace(/\.jpg$/, ".png");
        console.log(`Trying alternative format: ${pngSrc}`);

        // Set a temporary img to test if PNG exists
        const testImg = new Image();
        testImg.onload = () => setFinalSrc(pngSrc);
        testImg.onerror = () => {
          // Try JPEG
          const jpegSrc = finalSrc.replace(/\.jpg$/, ".jpeg");
          console.log(`Trying alternative format: ${jpegSrc}`);

          const testJpeg = new Image();
          testJpeg.onload = () => setFinalSrc(jpegSrc);
          testJpeg.onerror = () => setFinalSrc("/logo192.png");
          testJpeg.src = jpegSrc;
        };
        testImg.src = pngSrc;
      } else if (finalSrc.endsWith(".png")) {
        // Try JPG instead
        const jpgSrc = finalSrc.replace(/\.png$/, ".jpg");
        console.log(`Trying alternative format: ${jpgSrc}`);

        const testImg = new Image();
        testImg.onload = () => setFinalSrc(jpgSrc);
        testImg.onerror = () => setFinalSrc("/logo192.png");
        testImg.src = jpgSrc;
      } else {
        // If not a recognized extension, use fallback
        setFinalSrc("/logo192.png");
      }
    };

    return (
      <img
        src={finalSrc}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  };

  if (loading) {
    return <div className={styles.loading}>{t('favourites1.loading')}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.favoritesContainer}>
        <h2 className={styles.favoritesTitle}>{t('favourites1.title')}</h2>
        {favorites.length === 0 ? (
          <p className={styles.emptyState}>{t('favourites1.empty')}</p>
        ) : (
          <div className={styles.favoritesList}>
            {favorites.map((property) => (
              <div key={property.propertyId} className={styles.favoriteItem}>
                <ImageWithFallback
                  src={property.image}
                  alt={property.name}
                  className={styles.propertyImage}
                />
                <div className={styles.propertyDetails}>
                  <h3>{t(`hotel.${property.name}`)}</h3>
                  <p>{t(`city.${property.city.toLowerCase()}`)}</p>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewDetailsButton}
                      onClick={() =>
                        handleViewDetails(property.propertyId, property.city)
                      }
                    >
                      {t('favourites1.viewDetails')}
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