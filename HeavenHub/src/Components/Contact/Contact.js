import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import styles from "./Contact.module.css";

const Contact = () => {
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
      question: "How do I make a reservation?",
      answer: "You can make a reservation through our website by selecting your desired dates and room type. Follow the booking process and confirm your stay with payment."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Our standard cancellation policy allows free cancellation up to 24 hours before check-in. Different rates may have different policies."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, we offer airport transfer services. Please contact us in advance to arrange your pickup."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, digital wallets, and bank transfers."
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

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear all fields including subject
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.mainTitle}>Get in Touch</h1>
      <p className={styles.subtitle}>We'd love to hear from you. Please fill out this form or shoot us an email.</p>
      
      <div className={styles.contactInfoSection}>
        {contactInfo.map((info, index) => (
          <div key={index} className={styles.infoCard}>
            <div className={styles.iconWrapper}>{info.icon}</div>
            <h3>{info.title}</h3>
            <p>{info.details}</p>
            <span>{info.subDetails}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contactContainer}>
          <div className={styles.contactImage}></div>
          <div className={styles.contactForm}>
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
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