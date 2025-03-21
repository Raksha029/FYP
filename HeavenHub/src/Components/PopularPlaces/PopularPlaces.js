import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./PopularPlaces.module.css";
import place1 from "../Assets/place1.png";
import place2 from "../Assets/place2.png";
import place3 from "../Assets/place3.png";
import place4 from "../Assets/place4.png";
import place5 from "../Assets/place5.png";
import place6 from "../Assets/place6.png";
import place7 from "../Assets/place7.png";
import place8 from "../Assets/place8.png";

const PopularPlaces = () => {
  const scrollContainerRef1 = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  const popularPlaces = [
    { img: place1, name: "Kathmandu", route: "/kathmandu" },
    { img: place2, name: "Pokhara", route: "/pokhara" }, // Example for additional places
    { img: place3, name: "Baktapur", route: "/baktapur" },
    { img: place4, name: "Lalitpur", route: "/lalitpur" },
    { img: place5, name: "Lumbini", route: "/lumbini" },
    { img: place6, name: "Janakpur", route: "/janakpur" },
    { img: place7, name: "Nagarkot", route: "/nagarkot" },
    { img: place8, name: "Dharan", route: "/dharan" },
  ];

  return (
    <section className={styles.popularPlacesSection}>
      <h3 className={styles.sectionTitle}>Popular Places</h3>
      <div className="relative">
        <div ref={scrollContainerRef1} className={styles.scrollContainer}>
          {popularPlaces.map((place, index) => (
            <div
              key={index}
              className={`${styles.placeCard} ${
                index < 4 ? styles.static : styles.scrollable
              }`}
              onClick={() => navigate(place.route)} // Navigate on click
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <img
                src={place.img}
                alt={place.name}
                className={styles.placeImage}
              />
              <p className={styles.placeName}>{place.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPlaces;
