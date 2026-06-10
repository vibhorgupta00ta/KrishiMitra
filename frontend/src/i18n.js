import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// The translations
const resources = {
  en: {
    translation: {
      "app_name": "KrishiMitra",
      
      // Navbar
      "nav_dashboard": "Dashboard",
      "nav_predict_crop": "Predict Crop",
      "nav_detect_disease": "Detect Disease",
      "hero_title": "Empowering Farmers with",
      "nav_login": "Login",
      "nav_profile": "Profile",
      "nav_logout": "Logout",
      
      // Home Page
      "home_title_1": "Smart Farming with",
      "home_subtitle": "Empowering farmers with AI-driven crop prediction and disease detection. Make data-driven decisions for a better yield.",
      "home_get_started": "Get Started",
      "home_learn_more": "Learn More",
      "home_crop_pred_title": "Crop Prediction",
      "home_crop_pred_desc": "Based on soil and weather data",
      "home_crop_pred_text": "Input N, P, K values, temperature, and humidity to find the best crop to plant.",
      "home_try_now": "Try Now",
      "home_disease_title": "Disease Detection",
      "home_disease_desc": "Upload a leaf image",
      "home_disease_text": "Instantly identify crop diseases and get expert recommendations for treatment.",
      "home_upload_image": "Upload Image",
      
      // Dashboard
      "dash_overview": "Farm Overview",
      "dash_hello": "Hello,",
      "dash_weather": "Weather Overview",
      "dash_weather_desc": "Real-time weather for",
      "dash_pred_msg": "Get personalized crop recommendations based on your soil.",
      "dash_pred_btn": "Go to Crop Predictor",
      "dash_temp": "Temperature",
      "dash_humidity": "Humidity",
      "dash_wind": "Wind Speed",
      "dash_farm_details": "My Farm Details",
      "dash_manage_crops": "Manage your registered land and crops",
      "dash_total_land": "Total Land Area",
      "dash_acres": "Acres",
      "dash_currently_planted": "Currently Planted Crops",
      "dash_suggested_crops": "Suggested Crops",
      "dash_based_on_history": "Based on your history and weather",
      "dash_no_suggestions": "No suggestions yet.",
      "dash_get_ai_suggestion": "Get AI Suggestion",

      "disease_title": "Crop Disease Detection (CNN)",
      "disease_subtitle": "Upload a picture of a diseased crop leaf, and our Convolutional Neural Network will identify the issue.",
      "disease_upload_title": "Upload Leaf Image",
      "disease_upload_desc": "Supported formats: JPG, PNG, JPEG",
      "disease_drag_drop": "Drag and drop an image here",
      "disease_or_click": "or click to browse",
      "disease_btn_clear": "Clear",
      "disease_btn_detect": "Detect Disease",
      "disease_btn_analyzing": "Analyzing...",
      "disease_result_title": "Analysis Result",
      "disease_analyzing_msg": "Running image through CNN model...",
      "disease_dummy_warn": "Note: The CNN model is not yet trained. This is a dummy prediction for demonstration.",
      "disease_detected": "Detected Condition",
      "disease_confidence": "AI Confidence:",
      "disease_waiting": "Upload an image and click Detect to see the results here.",
      "disease_err_not_image": "Please select a valid image file.",
      "disease_err_detect": "Failed to detect disease. Make sure the ML service is running.",
      
      // Crop Prediction Page
      "crop_pred_title": "AI Crop Predictor",
      "crop_pred_subtitle": "Enter your soil and weather details to get the best crop recommendation from our AI.",
      "crop_soil_env_data": "Soil & Environment Data",
      "crop_optional_msg": "Fill in what you know. Missing fields will be estimated based on your Farm Profile.",
      "crop_nitrogen": "Nitrogen (N)",
      "crop_phosphorus": "Phosphorus (P)",
      "crop_potassium": "Potassium (K)",
      "crop_temperature": "Temperature (°C)",
      "crop_humidity": "Humidity (%)",
      "crop_ph": "Soil pH",
      "crop_rainfall": "Rainfall (mm)",
      "crop_btn_analyzing": "Analyzing Data...",
      "crop_btn_predict": "Predict Best Crop",
      "crop_recommended": "Recommended Crop",
      "crop_tailored_msg": "This prediction is tailored specifically to your soil composition and local climate data.",
      "crop_waiting_msg": "Your AI prediction will appear here after analysis.",
      
      // Auth & Profile
      "auth_login_title": "Welcome back",
      "auth_login_subtitle": "Enter your email and password to login to your account",
      "auth_email": "Email",
      "auth_password": "Password",
      "auth_btn_login": "Login",
      "auth_btn_logging_in": "Logging in...",
      "auth_no_account": "Don't have an account?",
      "auth_signup": "Sign up",
      "auth_register_title": "Create an account",
      "auth_register_subtitle": "Enter your details below to join KrishiMitra",
      "auth_name": "Full Name",
      "auth_btn_register": "Sign up",
      "auth_btn_registering": "Creating account...",
      "auth_has_account": "Already have an account?",
      "prof_title": "Your Profile",
      "prof_subtitle": "View and update your personal information",
      "prof_upload_pic": "Upload New Picture",
      "auth_email_ro": "Email (Read Only)",
      "prof_contact": "Contact Number",
      "prof_save": "Save Profile",
      "prof_saving": "Saving Changes...",
      "prof_farm_details": "Farm Details",
      "prof_land_area": "Total Land Area (in Acres)",
      "prof_planted_crops": "Planted Crops (comma separated)",
      
      // Chatbot
      "chat_title": "KrishiMitra AI",
      "chat_subtitle": "Voice Assistant",
      "chat_placeholder": "Ask a question...",
      "chat_listening": "Listening...",
      "chat_tooltip_mic": "Speak your question"
    }
  },
  hi: {
    translation: {
      "app_name": "कृषिमित्र",
      
      // Navbar
      "nav_dashboard": "डैशबोर्ड",
      "nav_predict_crop": "फसल का अनुमान",
      "nav_detect_disease": "रोग की पहचान",
      "hero_title": "किसानों को सशक्त बनाना",
      "nav_login": "लॉग इन",
      "nav_profile": "प्रोफ़ाइल",
      "nav_logout": "लॉग आउट",
      
      // Home Page
      "home_title_1": "स्मार्ट खेती",
      "home_subtitle": "किसानों को AI-संचालित फसल भविष्यवाणी और रोग पहचान से सशक्त बनाना। बेहतर पैदावार के लिए डेटा-आधारित निर्णय लें।",
      "home_get_started": "शुरू करें",
      "home_learn_more": "और जानें",
      "home_crop_pred_title": "फसल की भविष्यवाणी",
      "home_crop_pred_desc": "मिट्टी और मौसम के आंकड़ों पर आधारित",
      "home_crop_pred_text": "सबसे अच्छी फसल जानने के लिए N, P, K मान, तापमान और आर्द्रता दर्ज करें।",
      "home_try_now": "अभी आज़माएं",
      "home_disease_title": "रोग पहचान",
      "home_disease_desc": "पत्ते की तस्वीर अपलोड करें",
      "home_disease_text": "फसल के रोगों की तुरंत पहचान करें और उपचार के लिए विशेषज्ञ सुझाव प्राप्त करें।",
      "home_upload_image": "तस्वीर अपलोड करें",
      
      // Dashboard
      "dash_overview": "खेत का अवलोकन",
      "dash_hello": "नमस्ते,",
      "dash_weather": "मौसम की जानकारी",
      "dash_weather_desc": "का वास्तविक समय का मौसम",
      "dash_temp": "तापमान",
      "dash_humidity": "नमी",
      "dash_wind": "हवा की गति",
      "dash_farm_details": "मेरे खेत का विवरण",
      "dash_pred_msg": "अपनी मिट्टी के आधार पर व्यक्तिगत फसल सिफारिशें प्राप्त करें।",
      "dash_pred_btn": "फसल सलाहकार पर जाएं",
      "dash_manage_crops": "अपनी पंजीकृत भूमि और फसलों का प्रबंधन करें",
      "dash_total_land": "कुल भूमि क्षेत्र",
      "dash_acres": "एकड़",
      "dash_currently_planted": "वर्तमान में बोई गई फसलें",
      "dash_suggested_crops": "सुझाई गई फसलें",
      "dash_based_on_history": "आपके इतिहास और मौसम के आधार पर",
      "dash_no_suggestions": "अभी तक कोई सुझाव नहीं।",
      "dash_get_ai_suggestion": "AI सुझाव प्राप्त करें",

      "disease_title": "फसल रोग की पहचान (CNN)",
      "disease_subtitle": "एक रोगग्रस्त फसल के पत्ते की तस्वीर अपलोड करें, और हमारा कनवल्शनल न्यूरल नेटवर्क समस्या की पहचान करेगा।",
      "disease_upload_title": "पत्ते की छवि अपलोड करें",
      "disease_upload_desc": "समर्थित प्रारूप: JPG, PNG, JPEG",
      "disease_drag_drop": "यहां एक छवि खींचें और छोड़ें",
      "disease_or_click": "या ब्राउज़ करने के लिए क्लिक करें",
      "disease_btn_clear": "साफ़ करें",
      "disease_btn_detect": "रोग पहचानें",
      "disease_btn_analyzing": "विश्लेषण किया जा रहा है...",
      "disease_result_title": "विश्लेषण परिणाम",
      "disease_analyzing_msg": "CNN मॉडल के माध्यम से छवि चलाई जा रही है...",
      "disease_dummy_warn": "नोट: CNN मॉडल अभी प्रशिक्षित नहीं है। यह प्रदर्शन के लिए एक डमी भविष्यवाणी है।",
      "disease_detected": "पहचानी गई स्थिति",
      "disease_confidence": "AI विश्वास:",
      "disease_waiting": "परिणाम यहां देखने के लिए एक छवि अपलोड करें और 'पहचानें' पर क्लिक करें।",
      "disease_err_not_image": "कृपया एक वैध छवि फ़ाइल चुनें।",
      "disease_err_detect": "रोग का पता लगाने में विफल। सुनिश्चित करें कि ML सेवा चल रही है।",
      
      // Crop Prediction Page
      "crop_pred_title": "AI फसल सलाहकार",
      "crop_pred_subtitle": "हमारे AI से सबसे अच्छी फसल का सुझाव पाने के लिए अपनी मिट्टी और मौसम का विवरण दर्ज करें।",
      "crop_soil_env_data": "मिट्टी और पर्यावरण डेटा",
      "crop_optional_msg": "जो जानकारी आपको पता है, वो भरें। बाकी का अनुमान आपकी फार्म प्रोफाइल के आधार पर लगाया जाएगा।",
      "crop_nitrogen": "नाइट्रोजन (N)",
      "crop_phosphorus": "फास्फोरस (P)",
      "crop_potassium": "पोटेशियम (K)",
      "crop_temperature": "तापमान (°C)",
      "crop_humidity": "नमी (%)",
      "crop_ph": "मिट्टी का pH",
      "crop_rainfall": "वर्षा (mm)",
      "crop_btn_analyzing": "डेटा का विश्लेषण हो रहा है...",
      "crop_btn_predict": "सर्वश्रेष्ठ फसल की भविष्यवाणी करें",
      "crop_recommended": "सुझाई गई फसल",
      "crop_tailored_msg": "यह भविष्यवाणी विशेष रूप से आपकी मिट्टी की संरचना और स्थानीय जलवायु डेटा के अनुरूप है।",
      "crop_waiting_msg": "विश्लेषण के बाद आपकी AI भविष्यवाणी यहाँ दिखाई देगी।",
      
      // Auth & Profile
      "auth_login_title": "वापसी पर स्वागत है",
      "auth_login_subtitle": "अपने खाते में लॉग इन करने के लिए अपना ईमेल और पासवर्ड दर्ज करें",
      "auth_email": "ईमेल",
      "auth_password": "पासवर्ड",
      "auth_btn_login": "लॉग इन",
      "auth_btn_logging_in": "लॉग इन हो रहा है...",
      "auth_no_account": "क्या आपके पास खाता नहीं है?",
      "auth_signup": "साइन अप करें",
      "auth_register_title": "खाता बनाएँ",
      "auth_register_subtitle": "कृषिमित्र से जुड़ने के लिए अपना विवरण नीचे दर्ज करें",
      "auth_name": "पूरा नाम",
      "auth_btn_register": "साइन अप करें",
      "auth_btn_registering": "खाता बन रहा है...",
      "auth_has_account": "क्या आपके पास पहले से खाता है?",
      "prof_title": "आपकी प्रोफ़ाइल",
      "prof_subtitle": "अपनी व्यक्तिगत जानकारी देखें और अपडेट करें",
      "prof_upload_pic": "नई तस्वीर अपलोड करें",
      "auth_name": "पूरा नाम",
      "auth_email_ro": "ईमेल (केवल पढ़ने के लिए)",
      "prof_contact": "संपर्क नंबर",
      "prof_save": "प्रोफ़ाइल सहेजें",
      "prof_saving": "सहेजा जा रहा है...",
      "prof_farm_details": "खेत का विवरण",
      "prof_land_area": "कुल भूमि क्षेत्र (एकड़ में)",
      "prof_planted_crops": "बोई गई फसलें (अल्पविराम से अलग करें)",
      
      // Chatbot
      "chat_title": "कृषिमित्र AI",
      "chat_subtitle": "आवाज़ सहायक",
      "chat_placeholder": "हिंदी में सवाल पूछें...",
      "chat_listening": "सुन रहा हूँ... (Listening...)",
      "chat_tooltip_mic": "बोल कर पूछें"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
