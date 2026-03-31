import type {
  ProfileCompletionFieldKey,
  ProfileCompletionSectionKey,
  ProfileCompletionState,
} from "@/lib/profile-utils";

type UILanguage = "en" | "ta";

const FIELD_LABELS: Record<
  ProfileCompletionFieldKey,
  { en: string; ta: string }
> = {
  fullName: { en: "Full name", ta: "முழுப் பெயர்" },
  gender: { en: "Gender", ta: "பாலினம்" },
  dateOfBirth: { en: "Date of birth", ta: "பிறந்த தேதி" },
  height: { en: "Height", ta: "உயரம்" },
  maritalStatus: { en: "Marital status", ta: "திருமண நிலை" },
  profilePhotoUrl: { en: "Profile photo", ta: "சுயவிவரப் படம்" },
  community: { en: "Community", ta: "சமூகம்" },
  religion: { en: "Religion", ta: "மதம்" },
  caste: { en: "Caste", ta: "சாதி" },
  city: { en: "City", ta: "நகரம்" },
  state: { en: "State", ta: "மாநிலம்" },
  education: { en: "Education", ta: "கல்வி" },
  occupation: { en: "Occupation", ta: "தொழில்" },
  annualIncome: { en: "Annual income", ta: "வருடாந்திர வருமானம்" },
  about: { en: "About you", ta: "உங்களைப் பற்றி" },
  hobbies: { en: "Hobbies", ta: "விருப்ப செயல்கள்" },
  selectedInterests: { en: "Interests", ta: "விருப்பங்கள்" },
  partnerExpectations: { en: "Partner expectations", ta: "இணைவர் எதிர்பார்ப்புகள்" },
  email: { en: "Email", ta: "மின்னஞ்சல்" },
  phone: { en: "Phone", ta: "தொலைபேசி" },
  horoscopeImageUrl: { en: "Horoscope image", ta: "ஜாதக படம்" },
};

const SECTION_LABELS: Record<
  ProfileCompletionSectionKey,
  { en: string; ta: string }
> = {
  identity: { en: "Identity", ta: "அடையாளம்" },
  background: { en: "Background", ta: "பின்னணி" },
  career: { en: "Career", ta: "தொழில்" },
  story: { en: "Story", ta: "சுயவிவரக் கதை" },
  contact: { en: "Contact", ta: "தொடர்பு" },
};

export function getProfileCompletionFieldLabel(
  key: ProfileCompletionFieldKey,
  language: UILanguage,
) {
  return FIELD_LABELS[key][language];
}

export function getProfileCompletionSectionLabel(
  key: ProfileCompletionSectionKey,
  language: UILanguage,
) {
  return SECTION_LABELS[key][language];
}

export function getProfileCompletionChecklist(
  state: ProfileCompletionState,
  language: UILanguage,
  options?: {
    requiredOnly?: boolean;
    limit?: number;
  },
) {
  const items = state.items.filter(
    (item) =>
      !item.complete && (!options?.requiredOnly || item.required),
  );

  return items.slice(0, options?.limit ?? items.length).map((item) => ({
    ...item,
    label: getProfileCompletionFieldLabel(item.key, language),
    sectionLabel: getProfileCompletionSectionLabel(item.section, language),
  }));
}
