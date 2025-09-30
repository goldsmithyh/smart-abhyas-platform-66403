import { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.getElementsByTagName('head')[0].appendChild(script);

    // Initialize Google Translate
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
      // Cleanup
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="text-center py-4">
      <div id="google_translate_element" className="inline-block"></div>
    </div>
  );
};

export default GoogleTranslate;