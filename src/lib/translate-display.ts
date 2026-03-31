import type { Language } from "@/providers/LanguageProvider";

const TERM_TRANSLATIONS: Record<string, { en: string; ta: string }> = {
  accepted: { en: "Accepted", ta: "ஏற்கப்பட்டது" },
  active: { en: "Active", ta: "செயலில்" },
  "admin review": { en: "Admin Review", ta: "நிர்வாகி பரிசீலனை" },
  administrator: { en: "Administrator", ta: "நிர்வாகி" },
  approved: { en: "Approved", ta: "அங்கீகரிக்கப்பட்டது" },
  blocked: { en: "Blocked", ta: "தடைசெய்யப்பட்டது" },
  "browse only": { en: "Browse only", ta: "பார்வைக்கு மட்டும்" },
  cancel: { en: "Cancel", ta: "ரத்து செய்" },
  "contact shared": { en: "Contact Shared", ta: "தொடர்பு பகிரப்பட்டது" },
  closed: { en: "Closed", ta: "மூடப்பட்டது" },
  confirm: { en: "Confirm", ta: "உறுதிப்படுத்து" },
  dashboard: { en: "Dashboard", ta: "முகப்புப் பலகை" },
  deleting: { en: "Deleting...", ta: "நீக்குகிறது..." },
  declined: { en: "Declined", ta: "நிராகரிக்கப்பட்டது" },
  divorced: { en: "Divorced", ta: "விவாகரத்து" },
  female: { en: "Female", ta: "பெண்" },
  "fake profile": { en: "Fake Profile", ta: "போலி சுயவிவரம்" },
  harassment: { en: "Harassment", ta: "தொல்லை" },
  home: { en: "Home", ta: "முகப்பு" },
  "in progress": { en: "In Progress", ta: "செயல்பாட்டில்" },
  "inappropriate behavior": { en: "Inappropriate Behavior", ta: "ஒழுங்கற்ற நடத்தை" },
  male: { en: "Male", ta: "ஆண்" },
  member: { en: "Member", ta: "உறுப்பினர்" },
  "mutual match": { en: "Mutual Match", ta: "இருதரப்பு பொருத்தம்" },
  "needs attention": { en: "Needs Attention", ta: "கவனம் தேவை" },
  "never married": { en: "Never Married", ta: "திருமணம் ஆகாதவர்" },
  "not provided": { en: "Not provided", ta: "வழங்கப்படவில்லை" },
  "not specified": { en: "Not specified", ta: "குறிப்பிடப்படவில்லை" },
  open: { en: "Open", ta: "திறந்துள்ளது" },
  other: { en: "Other", ta: "மற்றவை" },
  pending: { en: "Pending", ta: "நிலுவையில்" },
  "profile complete": { en: "Profile Complete", ta: "சுயவிவரம் முழுமை" },
  rejected: { en: "Rejected", ta: "நிராகரிக்கப்பட்டது" },
  resolved: { en: "Resolved", ta: "தீர்க்கப்பட்டது" },
  reviewed: { en: "Reviewed", ta: "பரிசீலிக்கப்பட்டது" },
  scam: { en: "Suspected Scam", ta: "சந்தேகப்படும் மோசடி" },
  widowed: { en: "Widowed", ta: "விதவை / விதவன்" },
};

const INTEREST_CATEGORY_TRANSLATIONS: Record<string, string> = {
  "Creative & Arts": "படைப்பு மற்றும் கலை",
  "Sports & Fitness": "விளையாட்டு மற்றும் உடற்பயிற்சி",
  Hobbies: "விருப்ப செயல்கள்",
  "Food & Culture": "உணவு மற்றும் கலாசாரம்",
  Intellectual: "அறிவுப் பகுதி",
  Social: "சமூக சார்பு",
  "Nature & Adventure": "இயற்கை மற்றும் சாகசம்",
  "Spiritual & Wellness": "ஆன்மிகம் மற்றும் நலன்",
};

const INTEREST_LABEL_TRANSLATIONS: Record<string, string> = {
  Painting: "ஓவியம்",
  Theatre: "நாடகம்",
  Cinema: "சினிமா",
  Photography: "புகைப்படம்",
  Writing: "எழுத்து",
  Music: "இசை",
  Dance: "நடனம்",
  Singing: "பாடல்",
  Cricket: "கிரிக்கெட்",
  Football: "கால்பந்து",
  Badminton: "பேட்மிண்டன்",
  Tennis: "டென்னிஸ்",
  Swimming: "நீச்சல்",
  Yoga: "யோகா",
  Gym: "ஜிம்",
  Running: "ஓட்டம்",
  Reading: "வாசிப்பு",
  Cooking: "சமையல்",
  Gardening: "தோட்டப் பணி",
  Travelling: "பயணம்",
  Gaming: "விளையாட்டுகள்",
  Puzzles: "புதிர்கள்",
  "Board Games": "பலகை விளையாட்டுகள்",
  Coffee: "காப்பி",
  Baking: "பேக்கிங்",
  "Healthy Eating": "ஆரோக்கிய உணவு",
  "Cultural Events": "கலாசார நிகழ்வுகள்",
  "Classical Music": "செவ்வியல் இசை",
  "Traditional Arts": "பாரம்பரிய கலைகள்",
  "Regional Travel": "பிராந்தியப் பயணம்",
  Technology: "தொழில்நுட்பம்",
  Business: "வணிகம்",
  Science: "அறிவியல்",
  Philosophy: "தத்துவம்",
  "Current Affairs": "நடப்பு நிகழ்வுகள்",
  Learning: "கற்றல்",
  "Problem Solving": "சிக்கல் தீர்வு",
  Volunteering: "தன்னார்வ சேவை",
  Socialising: "சமூக கலந்துரையாடல்",
  "Public Speaking": "பொது பேச்சு",
  "Community Service": "சமூக சேவை",
  "Event Planning": "நிகழ்ச்சி திட்டமிடல்",
  Trekking: "மலை ஏற்றம்",
  Camping: "முகாம்",
  "Beach Activities": "கடற்கரை செயல்கள்",
  Wildlife: "வனவிலங்கு",
  "Nature Walks": "இயற்கை நடை",
  Cycling: "மிதிவண்டி",
  Meditation: "தியானம்",
  Spirituality: "ஆன்மிகம்",
  Prayer: "பிரார்த்தனை",
  Mindfulness: "மன ஒருமை",
  Wellness: "நலன்",
  Aromatherapy: "நறுமண சிகிச்சை",
};

export function humanizeLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function translateUiTerm(value: string, language: Language) {
  const normalized = value.toLowerCase().replaceAll("_", " ").trim();
  const translation = TERM_TRANSLATIONS[normalized];

  if (!translation) {
    return humanizeLabel(value);
  }

  return translation[language];
}

export function translateStatusLabel(value: string, language: Language) {
  return translateUiTerm(value, language);
}

export function translateInterestCategory(label: string, language: Language) {
  if (language === "en") {
    return label;
  }

  return INTEREST_CATEGORY_TRANSLATIONS[label] ?? label;
}

export function translateInterestLabel(label: string, language: Language) {
  if (language === "en") {
    return label;
  }

  return INTEREST_LABEL_TRANSLATIONS[label] ?? label;
}

export function translateDisplayValue(value: string, language: Language) {
  if (language === "en") {
    return value;
  }

  const normalized = value.toLowerCase().replaceAll("_", " ").trim();
  const translation = TERM_TRANSLATIONS[normalized];

  if (translation) {
    return translation.ta;
  }

  if (normalized === "india") {
    return "இந்தியா";
  }

  return value;
}
