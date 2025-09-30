
import React, { useEffect } from 'react';

const LegacyGoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.getElementsByTagName('head')[0].appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'mr',
          includedLanguages: 'en,hi,mr,gu,ta,te,kn,ml,bn,pa',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="text-center">
        <div id="google_translate_element"></div>
      </div>
    </div>
  );
};

export default LegacyGoogleTranslate;
