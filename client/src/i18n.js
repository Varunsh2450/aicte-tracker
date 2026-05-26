import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "features": "Features",
        "how-it-works": "How it works",
        "faq": "FAQ",
        "contact": "Contact",
        "login": "Log in",
        "getStarted": "Get Started",
        "logout": "Logout"
      },
      "landing": {
        "title1": "Track Your AICTE Points",
        "title2": "With Elegance.",
        "subtitle": "The most beautiful, intuitive, and automated platform for engineering students to manage their 100-point AICTE activity mandate.",
        "startJourney": "Start Your Journey",
        "viewDemo": "View Demo",
        "featuresTitle": "Why Choose Our Platform?",
        "howItWorksTitle": "How It Works"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "home": "मुख्य पृष्ठ",
        "features": "विशेषताएं",
        "how-it-works": "प्रक्रिया",
        "faq": "सामान्य प्रश्न",
        "contact": "संपर्क",
        "login": "लॉग इन",
        "getStarted": "शुरू करें",
        "logout": "लॉग आउट"
      },
      "landing": {
        "title1": "अपने AICTE अंक ट्रैक करें",
        "title2": "शानदार तरीके से।",
        "subtitle": "इंजीनियरिंग छात्रों के लिए अपने 100-बिंदु AICTE गतिविधि जनादेश को प्रबंधित करने के लिए सबसे सुंदर, सहज और स्वचालित मंच।",
        "startJourney": "अपनी यात्रा शुरू करें",
        "viewDemo": "डेमो देखें",
        "featuresTitle": "हमारा मंच क्यों चुनें?",
        "howItWorksTitle": "यह कैसे काम करता है"
      }
    }
  },
  kn: { // Kannada (since it's a common Indian engineering state language like in VTU Karnataka)
    translation: {
      "nav": {
        "home": "ಮನೆ",
        "features": "ವೈಶಿಷ್ಟ್ಯಗಳು",
        "how-it-works": "ಕಾರ್ಯವಿಧಾನ",
        "faq": "FAQ ಗಳು",
        "contact": "ಸಂಪರ್ಕ",
        "login": "ಲಾಗಿನ್",
        "getStarted": "ಪ್ರಾರಂಭಿಸಿ",
        "logout": "ಲಾಗ್ ಔಟ್"
      },
      "landing": {
        "title1": "ನಿಮ್ಮ AICTE ಅಂಕಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        "title2": "ಸೊಗಸಾದ ರೀತಿಯಲ್ಲಿ.",
        "subtitle": "ಎಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ತಮ್ಮ 100-ಪಾಯಿಂಟ್ AICTE ಚಟುವಟಿಕೆಯನ್ನು ನಿರ್ವಹಿಸಲು ಅತ್ಯಂತ ಸುಂದರವಾದ ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ವೇದಿಕೆ.",
        "startJourney": "ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ",
        "viewDemo": "ಡೆಮೊ ವೀಕ್ಷಿಸಿ",
        "featuresTitle": "ನಮ್ಮ ವೇದಿಕೆಯನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?",
        "howItWorksTitle": "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
