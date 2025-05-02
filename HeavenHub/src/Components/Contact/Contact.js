import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPhone,FaMapMarkerAlt, FaEnvelope, FaChevronDown } from "react-icons/fa";
import styles from "./Contact.module.css";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: "+977 984-1234567",
      subDetails: "Mon-Fri 9am-6pm",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "support@heavenhub.com",
      subDetails: "Online support 24/7",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      details: "Kathmandu, Nepal",
      subDetails: "Visit our office",
    },
  ];


  const faqs = [
    {
      question: t('contact1.faq.items.reservation.question'),
      answer: t('contact1.faq.items.reservation.answer')
    },
    {
      question: t('contact1.faq.items.cancellation.question'),
        answer: t('contact1.faq.items.cancellation.answer')
    },
    {
      question: t('contact1.faq.items.transfer.question'),
        answer: t('contact1.faq.items.transfer.answer')
    },
    {
      question: t('contact1.faq.items.payment.question'),
        answer: t('contact1.faq.items.payment.answer')
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success(t('contact1.form.success'));
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear all fields including subject
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('contact1.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.mainTitle}>{t('contact1.mainTitle')}</h1>
      <p className={styles.subtitle}>{t('contact1.subtitle')}</p>
      
      <div className={styles.contactInfoSection}>
        {contactInfo.map((info, index) => (
          <div key={index} className={styles.infoCard}>
            <div className={styles.iconWrapper}>{info.icon}</div>
            <h3>{t(`contact1.info.${info.title.toLowerCase()}.title`)}</h3>
            <p>{t(`contact1.info.${info.title.toLowerCase()}.details`)}</p>
            <span>{info.subDetails}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contactContainer}>
          <div className={styles.contactImage}></div>
          <div className={styles.contactForm}>
          <h2>{t('contact1.form.title')}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact1.form.name')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact1.form.email')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder={t('contact1.form.subject')}
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder={t('contact1.form.message')}
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              />
              <button type="submit" disabled={isSubmitting}>
              {t('contact1.form.submit')}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.faqSection}>
        <h2>{t('contact1.faq.title')}</h2>
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${activeFaq === index ? styles.active : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.faqQuestion}>
                  <h3>{faq.question}</h3>
                  <FaChevronDown className={styles.faqIcon} />
                </div>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;