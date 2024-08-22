import React from 'react';
//import '../styles/privacy-policy.css'; // 根据实际的文件路径进行调整
import '../styles/privacyPolicy.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <h1>Privacy Policy</h1>
      <div className="privacy-policy-content">
        <p>
          At Foodie, we value your privacy and are committed to protecting your personal data. This Privacy Policy
          explains how we collect, use, and disclose information about you when you use our services.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, participate in surveys,
          or contact us for support.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, as well as to communicate
          with you, customize content, and market our services to you.
        </p>
        <h2>Information Sharing</h2>
        <p>
          We may share your information with third-party service providers who help us operate our services or assist
          with marketing activities.
        </p>
        <h2>Security</h2>
        <p>
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
        </p>
        <h2>Contact Us</h2>
        {/*<p>*/}
        {/*  If you have any questions about this Privacy Policy, you can contact us.*/}
        {/*</p>*/}
        <p>
          If you have any questions about this Privacy Policy, you can <a href="http://localhost:3000/contact">contact
          us</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
