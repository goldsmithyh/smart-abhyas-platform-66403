import whatsappLogo from '../assets/whatsapp-logo.svg';

const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/919730100160"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float transition-transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="w-12 h-12" />
    </a>
  );
};

export default WhatsAppFloat;