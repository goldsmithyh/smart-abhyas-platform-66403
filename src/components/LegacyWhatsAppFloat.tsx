
import React from 'react';
import whatsappLogo from '../assets/whatsapp-logo.svg';

const LegacyWhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/919730100160" 
      className="float"
      target="_blank" 
      rel="noopener noreferrer"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="my-float" style={{ width: '60px', height: '60px' }} />
    </a>
  );
};

export default LegacyWhatsAppFloat;
