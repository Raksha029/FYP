import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard",
      icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
    },
    { 
      name: "Hotels", 
      path: "/admin/hotels",
      icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z"/></svg>
    },
    { 
      name: "Rooms", 
      path: "/admin/rooms",
      icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 0 0 1 1h1v3h2v-3h12v3h2v-3h1a1 1 0 0 0 1-1v-4c0-1.475-.811-2.75-2-3.443zM18 7v2h-5V7h5zM6 7h5v2H6V7zm14 9H4v-3c0-1.103.897-2 2-2h12c1.103 0 2 .897 2 2v3z"/></svg>
    },
    { 
      name: "Guests", 
      path: "/admin/users",
      icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
    },
    { 
      name: "Bookings", 
      path: "/admin/booking",
      icon: <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path fill="currentColor" d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3l-3-2.7zM17 18h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z"/>
          </svg>
          <span>HeavenHub</span>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? styles.active : ""}
              >
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.logoutButton} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search in dashboard..." 
              value={searchQuery}
              onChange={handleSearch}
            />
            <svg className={styles.searchIcon} viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <div className={styles.userIcon} title={`Admin: ${adminData?.username || 'Loading...'}`}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </div>
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
};

export default AdminLayout;