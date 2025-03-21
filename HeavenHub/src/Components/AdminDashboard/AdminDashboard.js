     import React, { useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';
     import styles from './AdminDashboard.module.css';

     const AdminDashboard = () => {
       const navigate = useNavigate();

       useEffect(() => {
         // Check if admin is logged in
         const adminToken = localStorage.getItem('adminToken');
         if (!adminToken) {
           navigate('/admin');
         }
       }, [navigate]);

       const handleLogout = () => {
         localStorage.removeItem('adminToken');
         navigate('/admin');
       };

       return (
         <div className={styles.dashboardContainer}>
           <div className={styles.sidebar}>
             <h2>Admin Panel</h2>
             <nav>
               <ul>
                 <li>Dashboard</li>
                 <li>Hotels</li>
                 <li>Rooms</li>
                 <li>Bookings</li>
                 <li>Users</li>
                 <li onClick={handleLogout}>Logout</li>
               </ul>
             </nav>
           </div>
           <div className={styles.mainContent}>
             <h1>Welcome to Admin Dashboard</h1>
             <div className={styles.statsGrid}>
               <div className={styles.statCard}>
                 <h3>Total Hotels</h3>
                 <p>50</p>
               </div>
               <div className={styles.statCard}>
                 <h3>Total Bookings</h3>
                 <p>150</p>
               </div>
               <div className={styles.statCard}>
                 <h3>Total Users</h3>
                 <p>300</p>
               </div>
             </div>
           </div>
         </div>
       );
     };

     export default AdminDashboard;