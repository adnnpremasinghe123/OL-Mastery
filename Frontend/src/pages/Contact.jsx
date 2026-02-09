import React, { useRef } from "react";
import "./Contact.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await emailjs.sendForm(
        "service_do01elr",   // Replace with your EmailJS service ID
        "template_f0jrbo9",  // Replace with your EmailJS template ID
        form.current,
        "LPl79hLFT1vxAl8Uv"  // Replace with your EmailJS public key
      );
      alert("Message sent successfully!");
      form.current.reset();
    } catch (error) {
      console.error("Email send error:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="contact-container">
      {/* ===== Left Section ===== */}
      <div className="contact-info">
        <h1>Contact Us</h1>
        <p>
          We’re here to help you on your O/L success journey!  
          Feel free to reach out for inquiries, partnerships, or support.
        </p>
        <ul className="contact-details">
          <li><FaMapMarkerAlt /> No o3,RanwanUyana,Munagama,Horana</li>
          <li><FaPhoneAlt /> +94 77 3486636</li>
          <li><FaEnvelope /> info@olmastery.lk</li>
        </ul>
      </div>

      {/* ===== Right Section (Form) ===== */}
      <div className="contact-form">
        <h2>Send Us an Email</h2>
        <form ref={form} onSubmit={sendEmail}>
          <input type="text" name="user_name" placeholder="Full Name" required />
          <input type="email" name="user_email" placeholder="Email Address" required />
          <textarea name="message" placeholder="Your Message" required />
          <button type="submit">Send Email</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
