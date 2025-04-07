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
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Hotels", path: "/admin/hotels" },
    { name: "Rooms", path: "/admin/rooms" },
    { name: "Booking", path: "/admin/booking" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <h2>Admin</h2>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? styles.active : ""}
              >
                {item.name}
              </li>
            ))}
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search" />
            <button>🔍</button>
          </div>
          <div className={styles.userIcon} title={`Admin: ${adminData?.username || 'Loading...'}`}>👤</div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;