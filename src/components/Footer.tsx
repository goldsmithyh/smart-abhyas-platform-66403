
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", href: "https://www.facebook.com/smartlyshikshan", color: "hover:bg-blue-600" },
    { name: "Instagram", icon: "fab fa-instagram", href: "https://www.instagram.com/smartshikshan", color: "hover:bg-pink-600" },
    { name: "YouTube", icon: "fab fa-youtube", href: "https://www.youtube.com/@smartlyshikshan", color: "hover:bg-red-600" },
    { name: "Telegram", icon: "fab fa-telegram", href: "https://t.me/smartshikshan", color: "hover:bg-blue-500" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {footerLinks.map((link, index) => (
              <div key={link.name} className="flex items-center">
                <Link 
                  to={link.href} 
                  className="text-white hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="ml-4 text-gray-500">|</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex flex-row space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${social.color}`}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Smart Creations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
