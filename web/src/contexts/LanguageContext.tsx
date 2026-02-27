"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'ta';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
    en: {
        // Profile
        'profile.title': 'Profile',
        'profile.subtitle': 'Manage your account settings and preferences',
        'profile.role': 'Senior Farmer',
        'profile.location': 'Pune, Maharashtra',
        'profile.edit': 'Edit Profile',

        // Sections
        'section.account': 'Account Settings',
        'section.preferences': 'App Preferences',
        'section.farm': 'Farm Details',
        'section.support': 'Support & Help',

        // Settings
        'setting.language': 'Language',
        'setting.language.desc': 'Select your preferred language',
        'setting.theme': 'Theme',
        'setting.theme.desc': 'Toggle dark/light mode',
        'setting.notifications': 'Notifications',
        'setting.notifications.desc': 'Manage app alerts',
        'setting.units': 'Units',
        'setting.units.desc': 'Metric vs Imperial',

        // Farm
        'farm.name': 'Farm Name',
        'farm.size': 'Farm Size',
        'farm.crops': 'Primary Crops',
        'farm.soil': 'Soil Type',

        // Actions
        'action.logout': 'Log Out',
        'action.save': 'Save Changes',
        'action.cancel': 'Cancel',

        // Nav
        'nav.dashboard': 'Dashboard',
        'nav.home': 'Home',
        'nav.trends': 'Data Trends',
        'nav.control': 'Control',
        'nav.advisor': 'Smart Advisor',
        'nav.profile': 'Profile',

        // App
        'app.subtitle': 'Smart Irrigation',
        'app.member_since': 'Member since',

        // Dashboard
        'dash.overview': 'Farm Overview',
        'dash.overview.desc': 'Real-time monitoring of your greenhouse conditions. System is operating at optimal efficiency.',
        'dash.temp': 'Temperature',
        'dash.soil_moisture': 'Soil Moisture',
        'dash.humidity': 'Humidity',

        'dash.soil_monitor': 'Soil Monitor',
        'dash.optimal': 'Optimal',

        'dash.crop_health': 'Crop Health',
        'dash.current_crop': 'Current Crop',
        'dash.active': 'Active',
        'dash.growth': 'Growth',
        'dash.health': 'Health',
        'dash.good': 'Good',
        'dash.harvest_in': 'Harvest in',
        'dash.days': 'days',

        'dash.tank_level': 'Tank Level',

        'dash.smart_valve': 'Smart Valve',
        'dash.zone': 'Zone',
        'dash.on': 'ON',
        'dash.off': 'OFF',
        'dash.active_since': 'Active since',
        'dash.last_active': 'Last active',
        'dash.ago': 'ago',

        'dash.weather': 'Weather',

        'dash.irrigation_log': 'Irrigation Log',
        'dash.valve_on': 'Valve ON',
        'dash.valve_off': 'Valve OFF',
        'dash.auto': 'AUTO',
        'dash.manual': 'MANUAL',

        'dash.activity': 'Activity',
        'dash.see_all': 'See All',
        'dash.alert.temp': 'Temperature Alert',
        'dash.alert.temp.msg': 'Temperature rising above 30°C',
        'dash.alert.irrigation': 'Irrigation Complete',
        'dash.alert.irrigation.msg': 'Zone A watering finished',
        'dash.alert.tank': 'Tank Refilled',
        'dash.alert.tank.msg': 'Water level at 85%',
        'dash.alert.morning': 'Morning Cycle',
        'dash.alert.morning.msg': 'Automated irrigation started',
        'dash.optimal_level': 'Optimal level detected',

        // Data Trends
        'trends.title': 'Performance Trends',
        'trends.desc': 'Real-time data visualization across key metrics',
        'trends.moisture': 'Moisture',
        'trends.temp': 'Temp',
        'trends.humidity': 'Humidity',
        'trends.water_lvl': 'Water Lvl',
        'trends.avg_moisture': 'Avg Moisture',
        'trends.avg_temp': 'Avg Temp',
        'trends.water_used': 'Water Used',
        'trends.system_health': 'System Health',
        'trends.recent_logs': 'Recent Data Logs',
        'trends.view_all': 'View All',
        'trends.forecast': '3-Day Forecast',
        'trends.this_week': 'this week',

        // Control
        'control.title': 'Control Center',
        'control.system_operational': 'System Operational',
        'control.zone': 'Zone',
        'control.active': 'ACTIVE',
        'control.offline': 'OFFLINE',
        'control.system_running': 'System Running',
        'control.tap_to_start': 'Tap to Start',
        'control.mode': 'Control Mode',
        'control.auto': 'AUTOMATIC',
        'control.manual': 'MANUAL',
        'control.ai_opt': 'AI Optimization Active',
        'control.ai_desc': 'System is adjusting flow based on soil data.',
        'control.emergency_stop': 'EMERGENCY STOP',
        'control.live_metrics': 'Live Metrics',
    },
    hi: {
        // Profile
        'profile.title': 'प्रोफ़ाइल',
        'profile.subtitle': 'अपनी खाता सेटिंग और प्राथमिकताएं प्रबंधित करें',
        'profile.role': 'वरिष्ठ किसान',
        'profile.location': 'पुणे, महाराष्ट्र',
        'profile.edit': 'प्रोफ़ाइल संपादित करें',

        // Sections
        'section.account': 'खाता सेटिंग्स',
        'section.preferences': 'ऐप प्राथमिकताएं',
        'section.farm': 'खेत का विवरण',
        'section.support': 'सहायता और मदद',

        // Settings
        'setting.language': 'भाषा',
        'setting.language.desc': 'अपनी पसंदीदा भाषा चुनें',
        'setting.theme': 'थीम',
        'setting.theme.desc': 'डार्क/लाइट मोड टॉगल करें',
        'setting.notifications': 'सूचनाएं',
        'setting.notifications.desc': 'ऐप अलर्ट प्रबंधित करें',
        'setting.units': 'इकाइयाँ',
        'setting.units.desc': 'मीट्रिक बनाम इंपीरियल',

        // Farm
        'farm.name': 'खेत का नाम',
        'farm.size': 'खेत का आकार',
        'farm.crops': 'मुख्य फसलें',
        'farm.soil': 'मिट्टी का प्रकार',

        // Actions
        'action.logout': 'लॉग आउट',
        'action.save': 'परिवर्तन सहेजें',
        'action.cancel': 'रद्द करें',

        // Nav
        'nav.dashboard': 'डैशबोर्ड',
        'nav.home': 'होम',
        'nav.trends': 'डेटा रुझान',
        'nav.control': 'नियंत्रण',
        'nav.advisor': 'स्मार्ट सलाहकार',
        'nav.profile': 'प्रोफ़ाइल',

        // App
        'app.subtitle': 'स्मार्ट सिंचाई',
        'app.member_since': 'सदस्यता वर्ष',

        // Dashboard
        'dash.overview': 'खेत का अवलोकन',
        'dash.overview.desc': 'आपके ग्रीनहाउस की स्थिति की वास्तविक समय की निगरानी। सिस्टम इष्टतम दक्षता पर काम कर रहा है।',
        'dash.temp': 'तापमान',
        'dash.soil_moisture': 'मिट्टी की नमी',
        'dash.humidity': 'नमी',

        'dash.soil_monitor': 'मिट्टी की निगरानी',
        'dash.optimal': 'इष्टतम',

        'dash.crop_health': 'फसल स्वास्थ्य',
        'dash.current_crop': 'वर्तमान फसल',
        'dash.active': 'सक्रिय',
        'dash.growth': 'विकास',
        'dash.health': 'स्वास्थ्य',
        'dash.good': 'अच्छा',
        'dash.harvest_in': 'कटाई में',
        'dash.days': 'दिन',

        'dash.tank_level': 'टैंक स्तर',

        'dash.smart_valve': 'स्मार्ट वाल्व',
        'dash.zone': 'ज़ोन',
        'dash.on': 'चालू',
        'dash.off': 'बंद',
        'dash.active_since': 'सक्रिय समय',
        'dash.last_active': 'अंतिम सक्रिय',
        'dash.ago': 'पहले',

        'dash.weather': 'मौसम',

        'dash.irrigation_log': 'सिंचाई लॉग',
        'dash.valve_on': 'वाल्व चालू',
        'dash.valve_off': 'वाल्व बंद',
        'dash.auto': 'स्वचालित',
        'dash.manual': 'मैनुअल',

        'dash.activity': 'गतिविधि',
        'dash.see_all': 'सभी देखें',
        'dash.alert.temp': 'तापमान चेतावनी',
        'dash.alert.temp.msg': 'तापमान 30°C से ऊपर बढ़ रहा है',
        'dash.alert.irrigation': 'सिंचाई पूर्ण',
        'dash.alert.irrigation.msg': 'ज़ोन A की सिंचाई समाप्त',
        'dash.alert.tank': 'टैंक भरा गया',
        'dash.alert.tank.msg': 'जल स्तर 85% पर',
        'dash.alert.morning': 'सुबह का चक्र',
        'dash.alert.morning.msg': 'स्वचालित सिंचाई शुरू हुई',
        'dash.optimal_level': 'इष्टतम स्तर का पता चला',

        // Data Trends
        'trends.title': 'प्रदर्शन रुझान',
        'trends.desc': 'प्रमुख मेट्रिक्स में रीयल-टाइम डेटा विज़ुअलाइज़ेशन',
        'trends.moisture': 'नमी',
        'trends.temp': 'तापमान',
        'trends.humidity': 'आर्द्रता',
        'trends.water_lvl': 'जल स्तर',
        'trends.avg_moisture': 'औसत नमी',
        'trends.avg_temp': 'औसत तापमान',
        'trends.water_used': 'पानी का उपयोग',
        'trends.system_health': 'सिस्टम स्वास्थ्य',
        'trends.recent_logs': 'हालिया डेटा लॉग',
        'trends.view_all': 'सभी देखें',
        'trends.forecast': '3-दिवसीय पूर्वानुमान',
        'trends.this_week': 'इस सप्ताह',

        // Control
        'control.title': 'नियंत्रण केंद्र',
        'control.system_operational': 'सिस्टम चालू',
        'control.zone': 'ज़ोन',
        'control.active': 'सक्रिय',
        'control.offline': 'ऑफ़लाइन',
        'control.system_running': 'सिस्टम चल रहा है',
        'control.tap_to_start': 'शुरू करने के लिए टैप करें',
        'control.mode': 'नियंत्रण मोड',
        'control.auto': 'स्वचालित',
        'control.manual': 'मैनुअल',
        'control.ai_opt': 'AI अनुकूलन सक्रिय',
        'control.ai_desc': 'सिस्टम मिट्टी के डेटा के आधार पर प्रवाह को समायोजित कर रहा है।',
        'control.emergency_stop': 'आपातकालीन रोक',
        'control.live_metrics': 'लाइव मेट्रिक्स',
    },
    mr: {
        // Profile
        'profile.title': 'प्रोफाइल',
        'profile.subtitle': 'तुमची खाते सेटिंग्ज आणि प्राधान्ये व्यवस्थापित करा',
        'profile.role': 'जेष्ठ शेतकरी',
        'profile.location': 'पुणे, महाराष्ट्र',
        'profile.edit': 'प्रोफाइल संपादित करा',

        // Sections
        'section.account': 'खाते सेटिंग्ज',
        'section.preferences': 'अॅप प्राधान्ये',
        'section.farm': 'शेताचा तपशील',
        'section.support': 'समर्थन आणि मदत',

        // Settings
        'setting.language': 'भाषा',
        'setting.language.desc': 'तुमची पसंतीची भाषा निवडा',
        'setting.theme': 'थीम',
        'setting.theme.desc': 'डार्क/लाईट मोड बदला',
        'setting.notifications': 'सूचना',
        'setting.notifications.desc': 'अॅप अलर्ट व्यवस्थापित करा',
        'setting.units': 'एकके',
        'setting.units.desc': 'मेट्रिक वि इंपिरियल',

        // Farm
        'farm.name': 'शेताचे नाव',
        'farm.size': 'शेताचा आकार',
        'farm.crops': 'मुख्य पिके',
        'farm.soil': 'मातीचा प्रकार',

        // Actions
        'action.logout': 'बाहेर पडा',
        'action.save': 'बदल जतन करा',
        'action.cancel': 'रद्द करा',

        // Nav
        'nav.dashboard': 'डॅशबोर्ड',
        'nav.home': 'होम',
        'nav.trends': 'डेटा ट्रेंड',
        'nav.control': 'नियंत्रण',
        'nav.advisor': 'स्मार्ट सल्लागार',
        'nav.profile': 'प्रोफाइल',

        // App
        'app.subtitle': 'स्मार्ट सिंचन',
        'app.member_since': 'सदस्यता वर्ष',

        // Dashboard
        'dash.overview': 'शेताचा आढावा',
        'dash.overview.desc': 'तुमच्या ग्रीनहाऊसच्या स्थितीचे रिअल-टाइम निरीक्षण. प्रणाली इष्टतम कार्यक्षमतेने कार्यरत आहे.',
        'dash.temp': 'तापमान',
        'dash.soil_moisture': 'मातीची आर्द्रता',
        'dash.humidity': 'आर्द्रता',

        'dash.soil_monitor': 'माती निरीक्षण',
        'dash.optimal': 'इष्टतम',

        'dash.crop_health': 'पीक आरोग्य',
        'dash.current_crop': 'सध्याचे पीक',
        'dash.active': 'सक्रिय',
        'dash.growth': 'वाढ',
        'dash.health': 'आरोग्य',
        'dash.good': 'चांगले',
        'dash.harvest_in': 'कापणी',
        'dash.days': 'दिवसात',

        'dash.tank_level': 'टाकी पातळी',

        'dash.smart_valve': 'स्मार्ट व्हॉल्व्ह',
        'dash.zone': 'झोन',
        'dash.on': 'चालू',
        'dash.off': 'बंद',
        'dash.active_since': 'पासून सक्रिय',
        'dash.last_active': 'शेवटचे सक्रिय',
        'dash.ago': 'पूर्वी',

        'dash.weather': 'हवामान',

        'dash.irrigation_log': 'सिंचन लॉग',
        'dash.valve_on': 'व्हॉल्व्ह चालू',
        'dash.valve_off': 'व्हॉल्व्ह बंद',
        'dash.auto': 'स्वयंचलित',
        'dash.manual': 'मॅन्युअल',

        'dash.activity': 'क्रियाकलाप',
        'dash.see_all': 'सर्व पहा',
        'dash.alert.temp': 'तापमान इशारा',
        'dash.alert.temp.msg': 'तापमान 30°C च्या वर जात आहे',
        'dash.alert.irrigation': 'सिंचन पूर्ण',
        'dash.alert.irrigation.msg': 'झोन A चे पाणी देणे पूर्ण झाले',
        'dash.alert.tank': 'टाकी भरली',
        'dash.alert.tank.msg': 'पाण्याची पातळी 85% वर',
        'dash.alert.morning': 'सकाळचे चक्र',
        'dash.alert.morning.msg': 'स्वयंचलित सिंचन सुरू झाले',
        'dash.optimal_level': 'इष्टतम पातळी आढळली',

        // Data Trends
        'trends.title': 'कामगिरी ट्रेंड',
        'trends.desc': 'मुख्य मेट्रिक्सवर रिअल-टाइम डेटा व्हिज्युअलायझेशन',
        'trends.moisture': 'आर्द्रता',
        'trends.temp': 'तापमान',
        'trends.humidity': 'आर्द्रता',
        'trends.water_lvl': 'पाणी पातळी',
        'trends.avg_moisture': 'सरासरी आर्द्रता',
        'trends.avg_temp': 'सरासरी तापमान',
        'trends.water_used': 'पाणी वापरले',
        'trends.system_health': 'सिस्टम आरोग्य',
        'trends.recent_logs': 'अलीकडील डेटा लॉग',
        'trends.view_all': 'सर्व पहा',
        'trends.forecast': '3-दिवसीय अंदाज',
        'trends.this_week': 'या आठवड्यात',

        // Control
        'control.title': 'नियंत्रण केंद्र',
        'control.system_operational': 'सिस्टम कार्यरत',
        'control.zone': 'झोन',
        'control.active': 'सक्रिय',
        'control.offline': 'ऑफलाइन',
        'control.system_running': 'सिस्टम चालू आहे',
        'control.tap_to_start': 'सुरू करण्यासाठी टॅप करा',
        'control.mode': 'नियंत्रण मोड',
        'control.auto': 'स्वयंचलित',
        'control.manual': 'मॅन्युअल',
        'control.ai_opt': 'AI ऑप्टिमायझेशन सक्रिय',
        'control.ai_desc': 'सिस्टम मातीच्या डेटावर आधारित प्रवाह समायोजित करत आहे.',
        'control.emergency_stop': 'आपत्कालीन थांबा',
        'control.live_metrics': 'थेट मेट्रिक्स',
    },
    ta: {
        // Profile
        'profile.title': 'சுயவிவரம்',
        'profile.subtitle': 'உங்கள் கணக்கு அமைப்புகளையும் விருப்பங்களையும் நிர்வகிக்கவும்',
        'profile.role': 'மூத்த விவசாயி',
        'profile.location': 'புனே, மகாராஷ்டிரா',
        'profile.edit': 'சுயவிவரத்தைத் திருத்து',

        // Sections
        'section.account': 'கணக்கு அமைப்புகள்',
        'section.preferences': 'பயன்பாட்டு விருப்பங்கள்',
        'section.farm': 'பண்ணை விவரங்கள்',
        'section.support': 'ஆதரவு & உதவி',

        // Settings
        'setting.language': 'மொழி',
        'setting.language.desc': 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்',
        'setting.theme': 'தீம்',
        'setting.theme.desc': 'டார்க்/லைட் மோட்',
        'setting.notifications': 'அறிவிப்புகள்',
        'setting.notifications.desc': 'பயன்பாட்டு விழிப்பூட்டல்களை நிர்வகிக்கவும்',
        'setting.units': 'அலகுகள்',
        'setting.units.desc': 'மெட்ரிக் vs இம்பீரியல்',

        // Farm
        'farm.name': 'பண்ணை பெயர்',
        'farm.size': 'பண்ணை அளவு',
        'farm.crops': 'முதன்மை பயிர்கள்',
        'farm.soil': 'மண் வகை',

        // Actions
        'action.logout': 'வெளியேறு',
        'action.save': 'மாற்றங்களைச் சேமி',
        'action.cancel': 'ரத்துசெய்',

        // Nav
        'nav.dashboard': 'டாஷ்போர்டு',
        'nav.home': 'முகப்பு',
        'nav.trends': 'தரவு போக்குகள்',
        'nav.control': 'கட்டுப்பாடு',
        'nav.advisor': 'ஸ்மார்ட் ஆலோசகர்',
        'nav.profile': 'சுயவிவரம்',

        // App
        'app.subtitle': 'ஸ்மார்ட் நீர்ப்பாசனம்',
        'app.member_since': 'உறுப்பினர் ஆண்டு',

        // Dashboard
        'dash.overview': 'பண்ணை கண்ணோட்டம்',
        'dash.overview.desc': 'உங்கள் பசுமைக்குடில் நிலைகளின் நிகழ்நேர கண்காணிப்பு. அமைப்பு உகந்த செயல்திறனில் இயங்குகிறது.',
        'dash.temp': 'வெப்பநிலை',
        'dash.soil_moisture': 'மண் ஈரப்பதம்',
        'dash.humidity': 'ஈரப்பதம்',

        'dash.soil_monitor': 'மண் கண்காணிப்பு',
        'dash.optimal': 'உகந்தது',

        'dash.crop_health': 'பயிர் ஆரோக்கியம்',
        'dash.current_crop': 'தற்போதைய பயிர்',
        'dash.active': 'செயலில்',
        'dash.growth': 'வளர்ச்சி',
        'dash.health': 'ஆரோக்கியம்',
        'dash.good': 'நன்று',
        'dash.harvest_in': 'அறுவடை',
        'dash.days': 'நாட்களில்',

        'dash.tank_level': 'தொட்டி நிலை',

        'dash.smart_valve': 'ஸ்மார்ட் வால்வு',
        'dash.zone': 'மண்டலம்',
        'dash.on': 'ஆன்',
        'dash.off': 'ஆஃப்',
        'dash.active_since': 'செயலில் உள்ளது',
        'dash.last_active': 'கடைசியாக செயலில்',
        'dash.ago': 'முன்பு',

        'dash.weather': 'வானிலை',

        'dash.irrigation_log': 'நீர்ப்பாசன பதிவு',
        'dash.valve_on': 'வால்வு ஆன்',
        'dash.valve_off': 'வால்வு ஆஃப்',
        'dash.auto': 'தானியங்கி',
        'dash.manual': 'கையேடு',

        'dash.activity': 'செயல்பாடு',
        'dash.see_all': 'அனைத்தையும் பார்',
        'dash.alert.temp': 'வெப்பநிலை எச்சரிக்கை',
        'dash.alert.temp.msg': 'வெப்பநிலை 30°C க்கு மேல் உயர்கிறது',
        'dash.alert.irrigation': 'நீர்ப்பாசனம் முடிந்தது',
        'dash.alert.irrigation.msg': 'மண்டலம் A நீர்ப்பாசனம் முடிந்தது',
        'dash.alert.tank': 'தொட்டி நிரப்பப்பட்டது',
        'dash.alert.tank.msg': 'நீர் நிலை 85% இல்',
        'dash.alert.morning': 'காலை சுழற்சி',
        'dash.alert.morning.msg': 'தானியங்கி நீர்ப்பாசனம் தொடங்கியது',
        'dash.optimal_level': 'உகந்த நிலை கண்டறியப்பட்டது',

        // Data Trends
        'trends.title': 'செயல்திறன் போக்குகள்',
        'trends.desc': 'முக்கிய அளவீடுகளில் நிகழ்நேர தரவு காட்சிப்படுத்தல்',
        'trends.moisture': 'ஈரப்பதம்',
        'trends.temp': 'வெப்பநிலை',
        'trends.humidity': 'ஈரப்பதம்',
        'trends.water_lvl': 'நீர் நிலை',
        'trends.avg_moisture': 'சராசரி ஈரப்பதம்',
        'trends.avg_temp': 'சராசரி வெப்பநிலை',
        'trends.water_used': 'நீர் பயன்படுத்தப்பட்டது',
        'trends.system_health': 'அமைப்பு ஆரோக்கியம்',
        'trends.recent_logs': 'சமீபத்திய தரவு பதிவுகள்',
        'trends.view_all': 'அனைத்தையும் பார்',
        'trends.forecast': '3-நாள் முன்னறிவிப்பு',
        'trends.this_week': 'இந்த வாரம்',

        // Control
        'control.title': 'கட்டுப்பாட்டு மையம்',
        'control.system_operational': 'அமைப்பு இயங்குகிறது',
        'control.zone': 'மண்டலம்',
        'control.active': 'செயலில்',
        'control.offline': 'ஆஃப்லைன்',
        'control.system_running': 'அமைப்பு இயங்குகிறது',
        'control.tap_to_start': 'தொடங்க தட்டவும்',
        'control.mode': 'கட்டுப்பாட்டு முறை',
        'control.auto': 'தானியங்கி',
        'control.manual': 'கையேடு',
        'control.ai_opt': 'AI மேம்படுத்தல் செயலில்',
        'control.ai_desc': 'மண் தரவுகளின் அடிப்படையில் அமைப்பு ஓட்டத்தை சரிசெய்கிறது.',
        'control.emergency_stop': 'அவசர நிறுத்தம்',
        'control.live_metrics': 'நேரடி அளவீடுகள்',
    },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load language from local storage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('app-language') as Language;
        if (savedLang && ['en', 'hi', 'mr', 'ta'].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
    };

    const t = (key: string) => {
        return translations[language][key as keyof typeof translations['en']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
