export type Language = 'en' | 'hi' | 'ur';

export interface TranslationDictionary {
  // Header
  app_title: string;
  search_placeholder: string;
  notifications: string;
  mark_all_read: string;
  no_notifications: string;
  accessibility_options: string;
  text_scaling: string;
  high_contrast: string;
  high_contrast_desc: string;
  language: string;

  // Sidebar
  nav_dashboard: string;
  nav_documents: string;
  nav_schemes: string;
  nav_eligibility: string;
  nav_applications: string;
  nav_notifications: string;
  nav_saved: string;
  nav_support: string;
  nav_settings: string;
  view_profile: string;
  log_out: string;

  // Dashboard Page
  welcome_back: string;
  ai_assistant_sub: string;
  new_application: string;
  popular_schemes: string;
  popular_schemes_sub: string;
  view_all_schemes: string;
  view_all: string;

  // Ingestion Area
  upload_title_default: string;
  upload_title_uploading: string;
  upload_title_success: string;
  upload_sub_default: string;
  upload_sub_limit: string;
  browse_files: string;
  processing: string;
  tap_to_browse: string;

  // Status strings
  status_active: string;
  status_in_progress: string;
  status_not_applied: string;
  status_not_eligible: string;
  status_pending: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    app_title: 'Civic-AI',
    search_placeholder: 'Search schemes, documents, services...',
    notifications: 'Notifications',
    mark_all_read: 'Mark all read',
    no_notifications: 'No notifications',
    accessibility_options: 'Accessibility Options',
    text_scaling: 'Text Scaling',
    high_contrast: 'High Contrast Mode',
    high_contrast_desc: 'Increases overall contrast limits globally across surfaces.',
    language: 'Language',

    nav_dashboard: 'Dashboard',
    nav_documents: 'My Documents',
    nav_schemes: 'Schemes',
    nav_eligibility: 'Eligibility Check',
    nav_applications: 'Applications',
    nav_notifications: 'Notifications',
    nav_saved: 'Saved',
    nav_support: 'Help & Support',
    nav_settings: 'Settings',
    view_profile: 'View Profile',
    log_out: 'Log Out',

    welcome_back: 'Welcome back',
    ai_assistant_sub: 'Your AI assistant for government schemes and services.',
    new_application: 'New Application',
    popular_schemes: 'Popular Schemes',
    popular_schemes_sub: 'Check your eligibility and application status',
    view_all_schemes: 'View all schemes',
    view_all: 'View all',

    upload_title_default: 'Upload documents to get started',
    upload_title_uploading: 'Analyzing Document with AI...',
    upload_title_success: 'Document Parsing Initiated',
    upload_sub_default: 'Drag & drop your documents here or click to browse',
    upload_sub_limit: 'PDF, JPG, PNG up to 10MB each',
    browse_files: 'Browse Files',
    processing: 'Processing',
    tap_to_browse: 'Tap to browse',

    status_active: 'Active',
    status_in_progress: 'In Progress',
    status_not_applied: 'Not Applied',
    status_not_eligible: 'Not Eligible',
    status_pending: 'Pending',
  },
  hi: {
    app_title: 'Civic-AI (नागरिक एआई)',
    search_placeholder: 'योजनाएँ, दस्तावेज़ एवं नागरिक सेवाएँ खोजें...',
    notifications: 'सूचनाएँ (Notifications)',
    mark_all_read: 'सभी पढ़ा हुआ चिह्नित करें',
    no_notifications: 'कोई नई सूचना नहीं है',
    accessibility_options: 'सुगम्यता एवं भाषा विकल्प',
    text_scaling: 'फ़ॉन्ट का आकार (Text Scaling)',
    high_contrast: 'उच्च कंट्रास्ट मोड (High Contrast)',
    high_contrast_desc: 'संपूर्ण वेबसाइट पर स्पष्टता और कंट्रास्ट बढ़ाता है।',
    language: 'भाषा (Language)',

    nav_dashboard: 'डैशबोर्ड',
    nav_documents: 'मेरे दस्तावेज़',
    nav_schemes: 'सरकारी योजनाएँ',
    nav_eligibility: 'पात्रता जाँच',
    nav_applications: 'आवेदन स्थिति',
    nav_notifications: 'सूचनाएँ',
    nav_saved: 'सहेजे गए',
    nav_support: 'सहायता एवं समर्थन',
    nav_settings: 'सेटिंग्स',
    view_profile: 'प्रोफ़ाइल देखें',
    log_out: 'लॉग आउट करें',

    welcome_back: 'सादर अभिनंदन',
    ai_assistant_sub: 'सरकारी योजनाओं एवं नागरिक सेवाओं के लिए आपका व्यक्तिगत AI सहायक।',
    new_application: 'नया आवेदन करें',
    popular_schemes: 'प्रमुख सरकारी योजनाएँ',
    popular_schemes_sub: 'अपनी पात्रता और आवेदन की स्थिति जाँचें',
    view_all_schemes: 'सभी योजनाएँ देखें',
    view_all: 'सभी देखें',

    upload_title_default: 'प्रारंभ करने के लिए दस्तावेज़ अपलोड करें',
    upload_title_uploading: 'AI द्वारा दस्तावेज़ का विश्लेषण किया जा रहा है...',
    upload_title_success: 'दस्तावेज़ विश्लेषण सफल',
    upload_sub_default: 'अपने दस्तावेज़ यहाँ खींच कर छोड़ें या खोजने के लिए क्लिक करें',
    upload_sub_limit: 'PDF, JPG, PNG (अधिकतम 10MB प्रति फ़ाइल)',
    browse_files: 'फ़ाइलें चुनें',
    processing: 'प्रक्रिया चालू है',
    tap_to_browse: 'खोजने के लिए टैप करें',

    status_active: 'सक्रिय',
    status_in_progress: 'प्रक्रिया में',
    status_not_applied: 'आवेदन नहीं किया',
    status_not_eligible: 'पात्र नहीं',
    status_pending: 'लंबित',
  },
  ur: {
    app_title: 'Civic-AI (سیوک اے آئی)',
    search_placeholder: 'اسکیمیں، دستاویزات اور شہری خدمات تلاش کریں...',
    notifications: 'اطلاعات و پیغامات',
    mark_all_read: 'سب کو پڑھا ہوا نشان زد کریں',
    no_notifications: 'کوئی نئی اطلاع نہیں ہے',
    accessibility_options: 'آسانی اور زبان کے اختیارات',
    text_scaling: 'حروف کا سائز (Text Scaling)',
    high_contrast: 'ہائی کنٹراسٹ موڈ (High Contrast)',
    high_contrast_desc: 'پوری ویب سائٹ پر حروف اور رنگوں کا تضاد بڑھاتا ہے۔',
    language: 'زبان (Language)',

    nav_dashboard: 'ڈیش بورڈ',
    nav_documents: 'میرے دستاویزات',
    nav_schemes: 'حکومتی اسکیمیں',
    nav_eligibility: 'اہلیت کی جانچ',
    nav_applications: 'درخواستوں کی صورتحال',
    nav_notifications: 'اطلاعات و پیغامات',
    nav_saved: 'محفوظ کردہ',
    nav_support: 'معاونت و رہنمائی',
    nav_settings: 'ترتیبات',
    view_profile: 'پروفائل دیکھیں',
    log_out: 'لاگ آؤٹ کریں',

    welcome_back: 'خوش آمدید',
    ai_assistant_sub: 'حکومتی اسکیموں اور شہری خدمات کے لیے آپ کا ذاتی AI معاون۔',
    new_application: 'نئی درخواست دیں',
    popular_schemes: 'مقبول حکومتی اسکیمیں',
    popular_schemes_sub: 'اپنی اہلیت اور درخواست کی موجودہ صورتحال چیک کریں',
    view_all_schemes: 'تمام اسکیمیں دیکھیں',
    view_all: 'تمام دیکھیں',

    upload_title_default: 'آغاز کے لیے دستاویزات اپلوڈ کریں',
    upload_title_uploading: 'AI کے ذریعہ دستاویز کا تجزیہ جاری ہے...',
    upload_title_success: 'دستاویز کامیابی کے ساتھ اپلوڈ ہو گیا',
    upload_sub_default: 'اپنے دستاویزات یہاں ڈراپ کریں یا منتخب کرنے کے لیے کلک کریں',
    upload_sub_limit: 'PDF، JPG، PNG (زیادہ سے زیادہ 10MB فی فائل)',
    browse_files: 'فائلیں منتخب کریں',
    processing: 'جانچ جاری ہے',
    tap_to_browse: 'منتخب کرنے کے لیے ٹیپ کریں',

    status_active: 'فعال',
    status_in_progress: 'زیرِ عمل',
    status_not_applied: 'درخواست نہیں دی',
    status_not_eligible: 'نااہل',
    status_pending: 'زیرِ التواء',
  }
};

export function translateScheme(scheme: { title: string; tagline: string; status: string }, lang: Language) {
  if (lang === 'en') {
    return scheme;
  }

  if (lang === 'hi') {
    const hiSchemes: Record<string, { title: string; tagline: string }> = {
      'PM-Kisan Samman Nidhi': {
        title: 'प्रधानमंत्री किसान सम्मान निधि',
        tagline: 'किसान वित्तीय एवं कृषि सहायता'
      },
      'Ayushman Bharat Card': {
        title: 'आयुष्मान भारत स्वास्थ्य कार्ड',
        tagline: 'मुफ्त स्वास्थ्य सुरक्षा एवं चिकित्सा बीमा'
      },
      'National Pension Scheme': {
        title: 'राष्ट्रीय पेंशन योजना (NPS)',
        tagline: 'वरिष्ठ नागरिक सामाजिक एवं पेंशन सुरक्षा'
      },
      'Pradhan Mantri Awas Yojana': {
        title: 'प्रधानमंत्री आवास योजना (PMAY)',
        tagline: 'किफ़ायती आवास एवं घर निर्माण सहायता'
      },
      'PM Ujjwala Yojana': {
        title: 'प्रधानमंत्री उज्ज्वला योजना',
        tagline: 'स्वच्छ रसोई गैस (LPG) कनेक्शन'
      },
      'Atal Pension Yojana': {
        title: 'अटल पेंशन योजना',
        tagline: 'असंगठित क्षेत्र के लिए गारंटीड पेंशन'
      }
    };

    const translatedTitle = hiSchemes[scheme.title]?.title || scheme.title;
    const translatedTagline = hiSchemes[scheme.title]?.tagline || scheme.tagline;

    let translatedStatus = scheme.status;
    if (scheme.status === 'Active') translatedStatus = 'सक्रिय';
    else if (scheme.status === 'In Progress') translatedStatus = 'प्रक्रिया में';
    else if (scheme.status === 'Not Applied') translatedStatus = 'आवेदन नहीं किया';
    else if (scheme.status === 'Not Eligible') translatedStatus = 'पात्र नहीं';
    else if (scheme.status === 'Pending') translatedStatus = 'लंबित';

    return {
      ...scheme,
      title: translatedTitle,
      tagline: translatedTagline,
      status: translatedStatus as any
    };
  }

  if (lang === 'ur') {
    const urSchemes: Record<string, { title: string; tagline: string }> = {
      'PM-Kisan Samman Nidhi': {
        title: 'پی ایم کسان سمان ندھی',
        tagline: 'کسانوں کے لیے مالی اور زرعی امداد'
      },
      'Ayushman Bharat Card': {
        title: 'آیوشمان بھارت ہیلتھ کارڈ',
        tagline: 'مفت طبی تحفظ اور ہیلتھ انشورنس'
      },
      'National Pension Scheme': {
        title: 'نیشنل پنشن اسکیم (NPS)',
        tagline: 'سینئر شہریوں کا سماجی اور پنشن تحفظ'
      },
      'Pradhan Mantri Awas Yojana': {
        title: 'پردھان منتری آواس یوجنا (PMAY)',
        tagline: 'سستے مکانات اور گھر کی تعمیر کے لیے امداد'
      },
      'PM Ujjwala Yojana': {
        title: 'پردھان منتری اُجّولا یوجنا',
        tagline: 'صاف اور مفت ایل پی جی (LPG) گیس کنکشن'
      },
      'Atal Pension Yojana': {
        title: 'اٹل پنشن یوجنا',
        tagline: 'غیر منظم شعبے کے لیے گارنٹی شدہ پنشن'
      }
    };

    const translatedTitle = urSchemes[scheme.title]?.title || scheme.title;
    const translatedTagline = urSchemes[scheme.title]?.tagline || scheme.tagline;

    let translatedStatus = scheme.status;
    if (scheme.status === 'Active') translatedStatus = 'فعال';
    else if (scheme.status === 'In Progress') translatedStatus = 'زیرِ عمل';
    else if (scheme.status === 'Not Applied') translatedStatus = 'درخواست نہیں دی';
    else if (scheme.status === 'Not Eligible') translatedStatus = 'نااہل';
    else if (scheme.status === 'Pending') translatedStatus = 'زیرِ التواء';

    return {
      ...scheme,
      title: translatedTitle,
      tagline: translatedTagline,
      status: translatedStatus as any
    };
  }

  return scheme;
}
