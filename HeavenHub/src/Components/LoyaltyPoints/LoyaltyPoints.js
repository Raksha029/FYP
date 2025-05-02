import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./LoyaltyPoints.module.css";
import chestbox from "../Assets/Chestboxs.png";
import { useTranslation } from 'react-i18next';

// Add WeeklyHotelDeals component
const WeeklyHotelDeals = ({ points, setUserData, setPointsHistory }) => {
  const { t } = useTranslation();
  const [weeklyDeals, setWeeklyDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeeklyDeals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/bookings/weekly-deals', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch weekly deals: ${response.status}`);
        }
        
        const data = await response.json();
        setWeeklyDeals(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching weekly deals:', error);
        setError('Unable to load weekly deals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyDeals();
  }, []);

  // In WeeklyHotelDeals component, update handleRedeemDeal
  const handleRedeemDeal = async (deal) => {
    if (points < deal.pointsRequired) {
      toast.error(t('loyaltyPoints1.pointsNeeded', { points: deal.pointsRequired }));
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/bookings/redeem-points', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hotelId: deal.hotelId,
          hotelName: deal.hotelName,
          pointsToRedeem: deal.pointsRequired,
          cityName: deal.cityName,
          type: 'redemption',
          discountPercentage: 20,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 7 days
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to redeem points');
      }
  
      const data = await response.json();
      
      // Store the discount information with specific hotel details
      localStorage.setItem('loyaltyDiscount', JSON.stringify({
        discountCode: data.discountCode,
        discountPercentage: 20,
        hotelId: deal.hotelId,
        hotelName: deal.hotelName,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        pointsRedeemed: deal.pointsRequired
      }));
  
      // Update user points and history
      setUserData(prevData => ({
        ...prevData,
        loyaltyPoints: data.remainingPoints
      }));
  
      setPointsHistory(prev => [...prev, {
        date: new Date(),
        points: -deal.pointsRequired,
        hotelName: deal.hotelName,
        type: 'redeemed',
        status: 'Redeemed'
      }]);
  
      toast.success(t('loyaltyPoints1.redeemSuccess', { 
        points: deal.pointsRequired,
        hotel: deal.hotelName 
      }));
      navigate(`/hotel-details/${deal.cityName.toLowerCase()}/${deal.hotelId}?discount=true`);
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast.error(t('loyaltyPoints1.redeemError'));
    }
  };

  // Update the fetchPointsHistory useEffect
  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/bookings/all-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          const history = data.map(booking => ({
            date: new Date(booking.bookingDate),
            points: booking.status === 'Cancelled' ? -100 :
                   booking.type === 'redemption' ? -500 : 100,
            hotelName: booking.hotelName,
            type: booking.type === 'redemption' ? 'redeemed' : 'earned',
            status: booking.status
          }));
          setPointsHistory(history);
  
          // Calculate total points correctly
          const totalPoints = history.reduce((total, item) => {
            if (item.status === 'Cancelled') return total;
            if (item.type === 'redeemed') return total - 500;
            return total + 100;
          }, 0);
  
          setUserData(prev => ({
            ...prev,
            loyaltyPoints: totalPoints
          }));
        }
      } catch (error) {
        console.error('Error fetching points history:', error);
      }
    };
  
    fetchPointsHistory();
  }, [setPointsHistory, setUserData, t]);

 

  if (loading) {
    return <div>{t('loyaltyPoints1.loading')}</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
         <h2>{t('loyaltyPoints1.weeklyDealsTitle')}</h2>
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.dealsDescription}>
          {t('loyaltyPoints1.dealsDescription')}
        </p>
      </div>
    );
  }

  // Change onClick to use handleRedeemDeal instead of onRedeem
  return (
    <div className={styles.weeklyDealsContainer}>
      <h2>{t('loyaltyPoints1.weeklyDealsTitle')}</h2>
      <p className={styles.dealsDescription}>
        {t('loyaltyPoints1.dealsDescription')}
      </p>
      <div className={styles.dealsList}>
        {weeklyDeals.map((deal) => (
          <div key={deal.hotelId} className={styles.dealItem}>
            <img 
              src={deal.hotelImage || chestbox} 
              alt={deal.hotelName} 
              className={styles.dealImage} 
              onError={(e) => {
                e.target.src = chestbox;
              }}
            />
            <div className={styles.dealInfo}>
              <h3>{t(`hotel.${deal.hotelName}`)}</h3>
              <p>{t(`location.${deal.location}`)}</p>
              <p className={styles.discount}>
                {t('common.getXOff', {percent: deal.discountPercentage})}
              </p>
              <p className={styles.pointsCost}>
                {t('loyaltyPoints1.pointsNeeded', {points: deal.pointsRequired})}
              </p>
              <button 
                className={styles.redeemButton}
                disabled={points < deal.pointsRequired}
                onClick={() => handleRedeemDeal(deal)}
              >
                {t('loyaltyPoints1.redeemButton')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// Inside the LoyaltyPoints component
const LoyaltyPoints = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [activeSection, setActiveSection] = useState("Loyalty Points");
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    loyaltyPoints: 0
  });
  const [pointsHistory, setPointsHistory] = useState([]);

  const FAQs = [
    {
      question: t('faq.earnQuestion'),
      answer: t('faq.earnAnswer'),
    },
    {
      question: t('faq.redeemQuestion'),
      answer: t('faq.redeemAnswer'),
    },
    {
      question: t('faq.whenQuestion'),
      answer: t('faq.whenAnswer'),
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:4000/api/user-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.firstName || data.googleDisplayName || 'User',
            lastName: data.lastName || '',
            email: data.email || '',
            loyaltyPoints: data.loyaltyPoints || 0
          });
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleTabClick = (section) => {
    setActiveSection(section);
  };

  const handleHistoryTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };


  // Inside the fetchPointsHistory useEffect
  useEffect(() => {
    const fetchPointsHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/bookings/all-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          const history = data.map(item => ({
            date: new Date(item.bookingDate),
            points: item.type === 'redemption' ? -500 : 100,
            hotelName: item.hotelName,
            type: item.type === 'redemption' ? 'redeemed' : 'earned',
            status: item.status
          }));
          setPointsHistory(history);
  
          // Calculate total points
          const totalPoints = history.reduce((total, item) => {
            if (item.status === 'Cancelled') return total;
            return total + (item.type === 'redeemed' ? -500 : 100);
          }, 0);
  
          setUserData(prev => ({
            ...prev,
            loyaltyPoints: totalPoints
          }));
        }
      } catch (error) {
        console.error('Error fetching points history:', error);
      }
    };
  
    fetchPointsHistory();
  }, []);

  // Update the renderPointsHistory function
  const renderPointsHistory = () => {
    const filteredHistory = pointsHistory.filter(item => {
      if (activeTab === "All") return true;
      if (activeTab === "Earned") return item.type === 'earned' && item.status !== 'Cancelled';
      if (activeTab === "Redeemed") return item.type === 'redeemed';
      return true;
    });
  
    if (filteredHistory.length === 0) {
      return (
        <div className={styles.emptyState}>
          <img
            className={styles.centeredImage}
            src={chestbox}
            alt="Empty State"
          />
          <p className={styles.centeredText}>
            {activeTab === "Redeemed" 
              ? t('loyaltyPoints1.emptyState.redeemed')
              : activeTab === "Earned"
              ? t('loyaltyPoints1.emptyState.earned')
              : t('loyaltyPoints1.emptyState.general')}
          </p>
        </div>
      );
    }
  
    return (
      <div className={styles.historyList}>
        {filteredHistory.map((item, index) => (
          <div key={index} className={`${styles.historyItem} ${
            item.type === 'redeemed' ? styles.redeemedItem : 
            item.status === 'Cancelled' ? styles.cancelledItem : ''
          }`}>
            <div className={styles.historyDetails}>
              <h3 className={
                item.type === 'redeemed' ? styles.redeemedText :
                item.status === 'Cancelled' ? styles.cancelledText : ''
              }>
                {item.status === 'Cancelled' 
                  ? t('loyaltyPoints1.bookingPoints.cancelled', { points: 100 }) 
                  : item.type === 'earned' 
                  ? t('loyaltyPoints1.bookingPoints.earned', { points: 100 }) 
                  : t('loyaltyPoints1.bookingPoints.redeemed', { points: Math.abs(item.points) })}
              </h3>
              <p>{t(`hotel.${item.hotelName}`)}</p>
              <p>{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <div className={`${styles.pointsAmount} ${
              item.type === 'redeemed' ? styles.redeemed : 
              item.status === 'Cancelled' ? styles.cancelled : ''
            }`}>
              {item.status === 'Cancelled' ? t('common.cancelledPoints', { points: 100 }) :
               item.type === 'earned' ? t('common.earnedPoints', { points: 100 }) : 
               t('common.redeemedPoints', { points: Math.abs(item.points) })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Update the Loyalty Points section render
  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.loyaltyContainer}>
        <div className={styles.sidebar}>
           <h1 style={{ fontWeight: "bold", fontSize: "1.5em" }}>
             {t('loyaltyPoints1.greeting', { name: userData.firstName })}
          </h1>
          <p>{userData.email}</p>
          <div className={styles.card}>
          <h2>{t('loyaltyPoints1.loyaltyPoints')}</h2>
            <hr className={styles.separator} />
            <div className={styles.coinDisplay}>{userData.loyaltyPoints}</div>
          </div>
          <div className="nav">
            <ul className={styles.navList}>
              <li
                onClick={() => handleTabClick("Loyalty Points")}
                className={`${
                  activeSection === "Loyalty Points" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="coin">
                  💰
                </span>{" "}
                {t('loyaltyPoints1.loyaltyPoints')}
              </li>
              <li
                onClick={() => handleTabClick("Rewards")}
                className={`${
                  activeSection === "Rewards" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="reward">
                  🏆
                </span>{" "}
                {t('loyaltyPoints1.rewards')}
              </li>
              <li
                onClick={() => handleTabClick("FAQs")}
                className={`${
                  activeSection === "FAQs" ? styles.activeTab : ""
                }`}
              >
                <span role="img" aria-label="faq">
                  ❓
                </span>{" "}
                {t('loyaltyPoints1.faqs')}
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.content}>
          {activeSection === "Loyalty Points" && (
            <>
              <h2>{t('loyaltyPoints1.loyaltyPoints')}</h2>
              <div className={styles.historyHeader}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "All" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("All")}
                >
                  {t('loyaltyPoints1.tabs.all')}
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Earned" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("Earned")}
                >
                  {t('loyaltyPoints1.tabs.earned')}
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "Redeemed" ? styles.activeTabs : ""
                  }`}
                  onClick={() => handleHistoryTabClick("Redeemed")}
                >
                  {t('loyaltyPoints1.tabs.redeemed')}
                </button>
              </div>
              {renderPointsHistory()}
            </>
          )}
          
          {activeSection === "Rewards" && (
            <div className={styles.content}>
              <h2>{t('loyaltyPoints1.tabs.rewards')}</h2>
              <WeeklyHotelDeals 
                points={userData.loyaltyPoints}
                setUserData={setUserData}
                setPointsHistory={setPointsHistory}
              />
            </div>
          )}
          {activeSection === "FAQs" && (
            <div className={styles.content}>
              <h2>{t('loyaltyPoints1.faqTitle')}</h2>
              {FAQs.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <div
                    onClick={() => toggleFAQ(index)}
                    className={styles.faqQuestion}
                  >
                    {faq.question}
                  </div>
                  {activeFAQ === index && (
                    <div className={styles.faqAnswer}>{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default LoyaltyPoints;