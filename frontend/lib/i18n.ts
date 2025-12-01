import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      learn: 'Learn',
      quiz: 'Quiz',
      aiAssistant: 'AI Assistant',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      profile: 'Profile',
      
      // Homepage
      heroTitle: 'Rights 360',
      heroSubtitle: 'Empowering everyone with knowledge of their legal rights and responsibilities through interactive learning and AI assistance.',
      getStarted: 'Get Started',
      
      // Features
      learnYourRights: 'Learn Your Rights',
      learnYourRightsDesc: 'Access simplified explanations of complex legal topics tailored to your needs.',
      interactiveQuizzes: 'Interactive Quizzes',
      interactiveQuizzesDesc: 'Test your knowledge with gamified quizzes and track your progress.',
      aiLegalAssistant: 'AI Legal Assistant',
      aiLegalAssistantDesc: 'Get instant answers to legal questions in simple, understandable language.',
      voiceNavigation: 'Voice Navigation',
      voiceNavigationDesc: 'Navigate and interact using voice commands for better accessibility.',
      multilingualSupport: 'Multilingual Support',
      multilingualSupportDesc: 'Available in English, Hindi, Tamil and other regional languages.',
      gamification: 'Gamification',
      gamificationDesc: 'Earn badges, streaks, and compete on leaderboards for motivation.',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      continueLearning: 'Continue Learning',
      quickActions: 'Quick Actions',
      badgesEarned: 'Badges Earned',
      progress: 'Progress',
      quizScore: 'Quiz Score',
      streak: 'Streak',
      rank: 'Rank',
      averageScore: 'Average score',
      daysInARow: 'Days in a row',
      globalRanking: 'Global ranking',
      completed: 'completed',
      review: 'Review',
      continue: 'Continue',
      askAiAssistant: 'Ask AI Assistant',
      takeRandomQuiz: 'Take Random Quiz',
      
      // Auth
      welcomeBackTitle: 'Welcome Back',
      signInSubtitle: 'Sign in to continue your legal learning journey',
      createAccountTitle: 'Create Account',
      signUpSubtitle: 'Join Rights 360 and start your legal learning journey',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      confirmPassword: 'Confirm Password',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      orContinueWith: 'Or continue with',
      google: 'Google',
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: 'डैशबोर्ड',
      learn: 'सीखें',
      quiz: 'क्विज़',
      aiAssistant: 'AI सहायक',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      signOut: 'साइन आउट',
      profile: 'प्रोफ़ाइल',
      
      // Homepage
      heroTitle: 'राइट्स 360',
      heroSubtitle: 'इंटरैक्टिव लर्निंग और AI सहायता के माध्यम से हर किसी को उनके कानूनी अधिकारों और जिम्मेदारियों के ज्ञान से सशक्त बनाना।',
      getStarted: 'शुरू करें',
      
      // Features
      learnYourRights: 'अपने अधिकार सीखें',
      learnYourRightsDesc: 'अपनी आवश्यकताओं के अनुरूप जटिल कानूनी विषयों के सरलीकृत स्पष्टीकरण तक पहुंचें।',
      interactiveQuizzes: 'इंटरैक्टिव क्विज़',
      interactiveQuizzesDesc: 'गेमिफाइड क्विज़ के साथ अपने ज्ञान का परीक्षण करें और अपनी प्रगति को ट्रैक करें।',
      aiLegalAssistant: 'AI कानूनी सहायक',
      aiLegalAssistantDesc: 'सरल, समझने योग्य भाषा में कानूनी प्रश्नों के तुरंत उत्तर प्राप्त करें।',
      
      // Dashboard
      welcomeBack: 'वापस स्वागत है',
      continueLearning: 'सीखना जारी रखें',
      quickActions: 'त्वरित कार्य',
      badgesEarned: 'अर्जित बैज',
      progress: 'प्रगति',
      quizScore: 'क्विज़ स्कोर',
      streak: 'लगातार',
      rank: 'रैंक',
    }
  },
  ta: {
    translation: {
      // Navigation
      dashboard: 'டாஷ்போர்டு',
      learn: 'கற்றுக்கொள்ளுங்கள்',
      quiz: 'வினாடி வினா',
      aiAssistant: 'AI உதவியாளர்',
      signIn: 'உள்நுழைய',
      signUp: 'பதிவு செய்யுங்கள்',
      signOut: 'வெளியேறு',
      profile: 'சுயவிவரம்',
      
      // Homepage
      heroTitle: 'ரைட்ஸ் 360',
      heroSubtitle: 'உலகளாவிய சட்ட அறிவு மற்றும் அதிகாரமளிப்பு தளம்',
      getStarted: 'தொடங்குங்கள்',
      
      // Features
      learnYourRights: 'உங்கள் உரிமைகளை அறியுங்கள்',
      learnYourRightsDesc: 'உங்கள் தேவைகளுக்கு ஏற்ற சிக்கலான சட்ட ஆதாரங்களின் எளிமையான விளக்கங்களை அணுகவும்.',
      interactiveQuizzes: 'இடைவினை வினாடி வினாக்கள்',
      interactiveQuizzesDesc: 'விளையாட்டு வினாடி வினாக்களுடன் உங்கள் அறிவை சோதித்து முன்னேற்றத்தை கண்காணிக்கவும்.',
    }
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
