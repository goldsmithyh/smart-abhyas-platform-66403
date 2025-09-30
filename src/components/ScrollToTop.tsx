
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          id="movetop"
          title="Go to top"
          className="fixed bottom-20 right-20 z-50 bg-[#D648D7] hover:bg-[#B73BC7] text-white p-4 rounded-full shadow-lg transition-colors duration-300"
        >
          <i className="fas fa-level-up-alt" aria-hidden="true"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
