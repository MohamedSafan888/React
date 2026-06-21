import { createContext, useContext, useState, useEffect } from 'react'

const T = {
  en: {
    login:'Sign in', register:'Create account', logout:'Sign out',
    email:'Email address', password:'Password', confirmPassword:'Confirm password',
    firstName:'First name', lastName:'Last name', phone:'Phone number',
    role:'I am a', patient:'Patient', doctor:'Doctor',
    forgotPassword:'Forgot your password?', noAccount:"Don't have an account?", hasAccount:'Already have an account?',
    required:'This field is required', invalidEmail:'Enter a valid email address',
    passwordMin:'Password must be at least 8 characters', passwordMatch:'Passwords do not match',
    home:'Home', findDoctors:'Find doctors', myAppointments:'My appointments',
    dashboard:'Dashboard', profile:'Profile', settings:'Settings',
    loading:'Loading…', save:'Save changes', cancel:'Cancel', back:'Go back',
    search:'Search', noResults:'No results found',
    error:'Something went wrong. Please try again.', success:'Done!',
    welcomeBack:'Welcome back', welcomeNew:'Create your account',
    specialty:'Specialty', allSpecialties:'All specialties',
    sortBy:'Sort by', rating:'Rating', availability:'Availability',
    bookAppointment:'Book appointment', viewProfile:'View profile',
    upcomingAppointments:'Upcoming appointments', pastAppointments:'Past appointments',
    noAppointments:'No appointments yet', cancelAppointment:'Cancel',
    reschedule:'Reschedule', approved:'Approved', pending:'Pending',
    rejected:'Rejected', cancelled:'Cancelled', completed:'Completed',
    manageAvailability:'Manage availability', patients:'Patients',
    allUsers:'All users', approveUser:'Approve', blockUser:'Block',
    specialties:'Specialties', addSpecialty:'Add specialty',
    name:'Name', actions:'Actions', status:'Status',
    bio:'Bio', selectDate:'Select date', selectTime:'Select time',
    confirmBooking:'Confirm booking', bookingSuccess:'Appointment booked!',
    bookingError:'Could not book appointment', darkMode:'Dark mode', language:'Language',
  },
  ar: {
    login:'تسجيل الدخول', register:'إنشاء حساب', logout:'تسجيل الخروج',
    email:'البريد الإلكتروني', password:'كلمة المرور', confirmPassword:'تأكيد كلمة المرور',
    firstName:'الاسم الأول', lastName:'اسم العائلة', phone:'رقم الهاتف',
    role:'أنا', patient:'مريض', doctor:'طبيب',
    forgotPassword:'نسيت كلمة المرور؟', noAccount:'ليس لديك حساب؟', hasAccount:'لديك حساب بالفعل؟',
    required:'هذا الحقل مطلوب', invalidEmail:'أدخل بريدًا إلكترونيًا صحيحًا',
    passwordMin:'كلمة المرور يجب أن تكون 8 أحرف على الأقل', passwordMatch:'كلمتا المرور غير متطابقتين',
    home:'الرئيسية', findDoctors:'ابحث عن طبيب', myAppointments:'مواعيدي',
    dashboard:'لوحة التحكم', profile:'الملف الشخصي', settings:'الإعدادات',
    loading:'جارٍ التحميل…', save:'حفظ التغييرات', cancel:'إلغاء', back:'رجوع',
    search:'بحث', noResults:'لا توجد نتائج',
    error:'حدث خطأ ما. يرجى المحاولة مجددًا.', success:'تم!',
    welcomeBack:'مرحبًا بعودتك', welcomeNew:'أنشئ حسابك',
    specialty:'التخصص', allSpecialties:'كل التخصصات',
    sortBy:'ترتيب بـ', rating:'التقييم', availability:'الإتاحة',
    bookAppointment:'احجز موعد', viewProfile:'عرض الملف',
    upcomingAppointments:'المواعيد القادمة', pastAppointments:'المواعيد السابقة',
    noAppointments:'لا توجد مواعيد', cancelAppointment:'إلغاء',
    reschedule:'إعادة جدولة', approved:'مقبول', pending:'قيد الانتظار',
    rejected:'مرفوض', cancelled:'ملغي', completed:'مكتمل',
    manageAvailability:'إدارة المواعيد', patients:'المرضى',
    allUsers:'كل المستخدمين', approveUser:'موافقة', blockUser:'حظر',
    specialties:'التخصصات', addSpecialty:'إضافة تخصص',
    name:'الاسم', actions:'الإجراءات', status:'الحالة',
    bio:'نبذة', selectDate:'اختر التاريخ', selectTime:'اختر الوقت',
    confirmBooking:'تأكيد الحجز', bookingSuccess:'تم حجز الموعد!',
    bookingError:'تعذر حجز الموعد', darkMode:'الوضع المظلم', language:'اللغة',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    if (lang === 'ar' && !document.querySelector('link[href*="Cairo"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap'
      document.head.appendChild(link)
    }
  }, [lang, dir])

  const t = (key) => T[lang]?.[key] ?? T['en'][key] ?? key
  const toggleLang = () => setLang(p => p==='en'?'ar':'en')

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be inside <LanguageProvider>')
  return ctx
}
