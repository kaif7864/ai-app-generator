import React, { createContext, useContext, useState } from 'react';

const translations: any = {
  en: {
    welcome: "Welcome Back",
    save: "Save to DB",
    import: "Upload & Store",
    email: "Email Address",
    password: "Password"
  },
  hi: {
    welcome: "वापस स्वागत है",
    save: "डेटाबेस में सहेजें",
    import: "अपलोड और स्टोर",
    email: "ईमेल पता",
    password: "पासवर्ड"
  }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState('en');

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
