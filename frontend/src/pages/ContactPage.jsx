import React from 'react';
import '../styles/contact.css';


const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-info">
        {/*<h2>Contact Information:</h2>*/}
        {/*<p>*/}
        {/*  You can contact us via：*/}
        {/*</p>*/}
        <ul>
          <li>Email：contact@foodie.com</li>
          <li>phone：+1234567890</li>
          <li>Address：123 Foodie Street, Germany</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;



