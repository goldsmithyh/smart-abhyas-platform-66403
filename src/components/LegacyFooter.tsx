
import React from 'react';
import { Link } from 'react-router-dom';

const LegacyFooter = () => {
  return (
    <footer className="simple-footer">
      <div className="container">
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>
        <div className="social-media-links">
          <ul className="social-list">
            <li>
              <a href="https://www.facebook.com/smartlyshikshan" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/smartshikshan" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://t.me/smartshikshan" target="_blank" rel="noopener noreferrer" className="social-icon telegram">
                <i className="fab fa-telegram"></i>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@smartlyshikshan" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                <i className="fab fa-youtube"></i>
              </a>
            </li>
          </ul>
        </div>
        <p className="copyright">&copy; 2025 Smart Creations. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LegacyFooter;
