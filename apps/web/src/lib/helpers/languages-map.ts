export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
}

export const languagesList: LanguageItem[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];
