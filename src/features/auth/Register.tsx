"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { DateControl, InputControl, PasswordControl, SelectControl } from "@/components/shared/FormControls";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  ANNUAL_INCOME_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  isProfileOption,
} from "@/lib/constants/profile-options";
import { RequestError, requestJson } from "@/lib/client-request";
import { isAdult, normalizePhone } from "@/lib/profile-utils";
import { translateDisplayValue } from "@/lib/translate-display";
import { useLanguage } from "@/providers/LanguageProvider";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,72}$/;
const NAME_RULE = /^[\p{L}][\p{L} .'-]{1,79}$/u;
const HUMAN_TEXT_RULE = /^[\p{L}\p{N}&/.,'()\- ]+$/u;

const INITIAL_FORM_DATA = {
  profileFor: "",
  fullName: "",
  gender: "",
  dateOfBirth: "",
  community: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  height: "",
  maritalStatus: "",
  education: "",
  occupation: "",
  income: "",
  city: "",
  state: "",
  caste: "",
};

const STEP_FIELDS = {
  1: ["profileFor", "fullName", "gender", "dateOfBirth", "community"],
  2: ["email", "phone", "password", "confirmPassword"],
  3: [
    "height",
    "maritalStatus",
    "education",
    "occupation",
    "income",
    "city",
    "state",
    "caste",
  ],
} as const;

const PROGRESS_FIELDS = {
  1: ["profileFor", "fullName", "gender", "dateOfBirth"],
  2: ["email", "phone", "password", "confirmPassword"],
  3: ["height", "maritalStatus", "education", "occupation", "city", "state", "caste"],
} as const;

const PROGRESS_STEP_KEYS = [1, 2, 3] as const;

type RegisterFormData = typeof INITIAL_FORM_DATA;
type RegisterFieldKey = keyof RegisterFormData;
type RegisterErrors = Partial<Record<RegisterFieldKey, string>>;

const FIELD_STEP: Record<RegisterFieldKey, 1 | 2 | 3> = {
  profileFor: 1,
  fullName: 1,
  gender: 1,
  dateOfBirth: 1,
  community: 1,
  email: 2,
  phone: 2,
  password: 2,
  confirmPassword: 2,
  height: 3,
  maritalStatus: 3,
  education: 3,
  occupation: 3,
  income: 3,
  city: 3,
  state: 3,
  caste: 3,
};

function buildHeightOptions() {
  return Array.from({ length: 16 }, (_, index) => {
    const cm = 150 + index * 2;
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}" (${cm} cm)`;
  });
}

function hasMeaningfulText(value: string, minimumLength = 2) {
  return value.trim().length >= minimumLength;
}

function hasValidHumanText(value: string) {
  return HUMAN_TEXT_RULE.test(value.trim());
}

function hasFullNameParts(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter((part) => /[\p{L}]/u.test(part)).length >= 2;
}

function sanitizePhoneInput(value: string) {
  return normalizePhone(value).slice(0, 10);
}

export function Register() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterErrors>({});
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);

  const heightOptions = useMemo(() => buildHeightOptions(), []);
  const stepLabels =
    language === "ta"
      ? ["அடிப்படை விவரங்கள்", "கணக்கு விவரங்கள்", "சுயவிவரச் சுருக்கம்"]
      : ["Basic details", "Account details", "Profile summary"];
  const stepDescriptions =
    language === "ta"
      ? [
          "இந்த சுயவிவரம் யாருக்காக என்பதைச் சொல்லி அடிப்படை விவரங்களைச் சேர்க்கவும்.",
          "தொடர்பு விவரங்களும் வலுவான கடவுச்சொல்லும் கொண்டு கணக்கை பாதுகாக்கவும்.",
          "அங்கீகாரத்திற்கும் அடுத்த கட்ட நிறைவு பணிகளுக்கும் அடித்தளத்தை அமைக்கவும்.",
        ]
      : [
          "Tell us who this profile is for and capture the member essentials.",
          "Secure the account with contact details and a stronger password.",
          "Set up the first profile snapshot before moving into full completion.",
        ];
  const stepFocusItems =
    language === "ta"
      ? [
          [
            "சுயவிவரம் யாருக்காக என்பதைத் தேர்ந்தெடுக்கவும்",
            "பெயர், பாலினம், மற்றும் பிறந்த தேதியைச் சேர்க்கவும்",
            "சமூக அல்லது குடும்ப பின்னணியை வழங்கவும்",
          ],
          [
            "மின்னஞ்சலும் கைபேசி எண்ணையும் உறுதிப்படுத்தவும்",
            "வலுவான கடவுச்சொல்லை உருவாக்கவும்",
            "பாதுகாப்பான உள்நுழைவு அடித்தளத்தை அமைக்கவும்",
          ],
          [
            "உயரமும் திருமண நிலையும் நிரப்பவும்",
            "கல்வி, தொழில், மற்றும் வருமானத்தைச் சேர்க்கவும்",
            "நகர், மாநிலம், மற்றும் சாதி விவரங்களை முடிக்கவும்",
          ],
        ]
      : [
          [
            "Choose who this profile is being created for",
            "Add name, gender, and date of birth",
            "Provide community or family context",
          ],
          [
            "Confirm email and mobile details",
            "Create a stronger password",
            "Set up a secure sign-in foundation",
          ],
          [
            "Complete height and marital status",
            "Add education, occupation, and income",
            "Finish city, state, and caste details",
          ],
        ];
  const copy =
    language === "ta"
      ? {
          createProfile: "உங்கள் சுயவிவரத்தை உருவாக்குங்கள்",
          heroTitle: "தொடக்கம் முதலே நம்பகத்தன்மை தரும் சுயவிவரத்தை அமைக்கவும்.",
          heroDescription:
            "முதலில் மிகவும் முக்கியமான உறுப்பினர் விவரங்களைப் பெறுகிறோம். அதன் பிறகு படங்கள், ஜாதகம், விருப்பங்கள், மற்றும் விரிவான விவரங்களை நீங்கள் பாதுகாப்பாகச் சேர்க்கலாம்.",
          reviewReadyTitle: "பரிசீலனைக்கு தயார் அமைப்பு",
          reviewReadyPoints: [
            "மூன்று படிகளில் தெளிவான பதிவு",
            "வலுவான கடவுச்சொல் மற்றும் சரியான உள்ளீடு சரிபார்ப்பு",
            "பதிவுக்குப் பின் முழு சுயவிவர நிறைவு வழிகாட்டல்",
          ],
          guideLabel: "வழிநடத்தப்பட்ட பதிவு",
          introDescription:
            "அத்தியாவசியங்களை முதலில் முடிக்கவும். கணக்கு உருவான பிறகு, உங்கள் சுயவிவர நிறைவு பட்டையுடன் மீதமுள்ள விவரங்களை நாங்கள் வழிநடத்துவோம்.",
          passwordTitle: "கடவுச்சொல் தேவைகள்",
          passwordHint:
            "8-72 எழுத்துகள், குறைந்தது ஒரு பெரிய எழுத்து, ஒரு சிறிய எழுத்து, ஒரு எண், மற்றும் ஒரு சிறப்பு குறி வேண்டும்.",
          summaryTitle: "அடுத்து என்ன நடக்கும்?",
          summaryDescription:
            "கணக்கு உருவானதும், சுயவிவரப் படம், ஜாதக முன்னோட்டம், விருப்பங்கள், மற்றும் விரிவான இணைவர் எதிர்பார்ப்புகளைச் சேர்க்கலாம்.",
          continue: "தொடரவும்",
          create: "சுயவிவரம் உருவாக்கவும்",
          creating: "சுயவிவரம் உருவாக்கப்படுகிறது",
          success: "உங்கள் சுயவிவரம் உருவாக்கப்பட்டது.",
          fallbackError: "உங்கள் சுயவிவரத்தை உருவாக்க முடியவில்லை.",
          completeStep: "இந்த படியின் தேவையான புலங்களைச் சரிசெய்யவும்.",
          profileForPlaceholder: "இந்த சுயவிவரம் யாருக்காக?",
          fullNamePlaceholder: "எ.கா. ப்ரியா லட்சுமி",
          genderPlaceholder: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
          datePlaceholder: "பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்",
          maritalPlaceholder: "திருமண நிலையைத் தேர்ந்தெடுக்கவும்",
          heightPlaceholder: "உயரத்தைத் தேர்ந்தெடுக்கவும்",
          selectPlaceholder: "தேர்ந்தெடுக்கவும்",
          emailPlaceholder: "பெயர்@உதாரணம்.com",
          communityHint: "தமிழ் சமூகம் அல்லது குடும்ப பின்னணி",
          phoneHint: "10 இலக்க கைபேசி எண்",
          passwordPlaceholder: "வலுவான கடவுச்சொல்லை உருவாக்கவும்",
          confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
          educationPlaceholder: "எ.கா. பி.டெக் / எம்.பி.ஏ",
          occupationPlaceholder: "எ.கா. மென்பொருள் பொறியாளர்",
          incomeHint: "சரியான தேடல் மற்றும் வடிகட்டலுக்காக அருகிலான வருமான வரம்பைத் தேர்ந்தெடுக்கவும்",
          incomePlaceholder: "வருடாந்திர வருமானத்தைத் தேர்ந்தெடுக்கவும்",
          cityPlaceholder: "எ.கா. சென்னை",
          statePlaceholder: "எ.கா. தமிழ்நாடு",
          castePlaceholder: "எ.கா. ஐயர்",
          secureAccount: "பாதுகாப்பான கணக்கு",
          signInCardTitle: "ஏற்கனவே கணக்கு தொடங்கியுள்ளீர்களா?",
          signInCardDescription:
            "டாஷ்போர்டை அணுக, சுயவிவரத்தைத் தொடர்ந்து நிரப்ப, மற்றும் உறுப்பினர் செயல்பாட்டைப் பார்க்க உள்நுழையவும்.",
          signInCardAction: "உள்நுழையவும்",
          mobileSignInPrompt: "ஏற்கனவே கணக்கு உள்ளதா?",
          mobileSignInLink: "உள்நுழையவும்",
          backToHome: t("register.back.to.home"),
          backToPrevious: t("register.back.to.previous"),
        }
      : {
          createProfile: "Create your profile",
          heroTitle: "Build a profile that feels trustworthy from the start.",
          heroDescription:
            "We collect the right member essentials first, then guide you into photos, horoscope, preferences, and richer profile details after account creation.",
          reviewReadyTitle: "Review-ready setup",
          reviewReadyPoints: [
            "Three guided steps with clearer validation",
            "Stronger password and cleaner input checks",
            "Post-signup onboarding to finish the full profile properly",
          ],
          guideLabel: "Guided registration",
          introDescription:
            "Complete the essentials first. Once your account is created, we will guide the remaining profile work with a proper completion bar and onboarding checklist.",
          passwordTitle: "Password requirements",
          passwordHint:
            "Use 8-72 characters with at least one uppercase letter, one lowercase letter, one number, and one symbol.",
          summaryTitle: "What happens next?",
          summaryDescription:
            "After signup, you will be guided to add your profile photo, horoscope preview, interests, and more detailed partner expectations.",
          continue: "Continue",
          create: "Create profile",
          creating: "Creating profile",
          success: "Your profile has been created.",
          fallbackError: "Unable to create your profile.",
          completeStep: "Please correct the required fields in this step.",
          profileForPlaceholder: "Who is this profile for?",
          fullNamePlaceholder: "e.g. Priya Lakshmi",
          genderPlaceholder: "Select gender",
          datePlaceholder: "Select date",
          maritalPlaceholder: "Select marital status",
          heightPlaceholder: "Select height",
          selectPlaceholder: "Select",
          emailPlaceholder: "name@example.com",
          communityHint: "Tamil community or family background",
          phoneHint: "10-digit mobile number",
          passwordPlaceholder: "Create a strong password",
          confirmPasswordPlaceholder: "Re-enter your password",
          educationPlaceholder: "e.g. B.Tech / MBA",
          occupationPlaceholder: "e.g. Software Engineer",
          incomeHint: "Choose the closest income range for cleaner search and filtering.",
          incomePlaceholder: "Select annual income",
          cityPlaceholder: "e.g. Chennai",
          statePlaceholder: "e.g. Tamil Nadu",
          castePlaceholder: "e.g. Iyer",
          secureAccount: "Secure account",
          signInCardTitle: "Already started your account?",
          signInCardDescription:
            "Sign in to access your dashboard, continue profile setup, and review your member activity.",
          signInCardAction: "Sign in",
          mobileSignInPrompt: "Already have an account?",
          mobileSignInLink: "Sign in",
          backToHome: t("register.back.to.home"),
          backToPrevious: t("register.back.to.previous"),
        };

  const stepCompletionRatios = PROGRESS_STEP_KEYS.map((stepKey) => {
      const fieldKeys = PROGRESS_FIELDS[stepKey];
      const completedCount = fieldKeys.filter(
        (fieldKey) => !validateField(fieldKey, formData),
      ).length;

      return completedCount / fieldKeys.length;
    });
  const progressPercentage = Math.round(
    (stepCompletionRatios.reduce((total, ratio) => total + ratio, 0) /
      stepCompletionRatios.length) *
      100,
  );

  function validateField(
    key: RegisterFieldKey,
    values: RegisterFormData,
  ): string | undefined {
    const value = values[key].trim();

    switch (key) {
      case "profileFor":
        return value
          ? undefined
          : language === "ta"
            ? "இந்த சுயவிவரம் யாருக்காக என்பதைத் தேர்ந்தெடுக்கவும்."
            : "Select who this profile is for.";
      case "fullName":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "முழுப் பெயரை உள்ளிடவும்." : "Enter your full name.";
        }
        if (!NAME_RULE.test(value)) {
          return language === "ta"
            ? "பெயரில் எழுத்துகள், இடைவெளி, மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, spaces, and common punctuation for your name.";
        }
        if (!hasFullNameParts(value)) {
          return language === "ta"
            ? "முதல் பெயரும் கடைசி பெயரும் உள்ள முழுப் பெயரை உள்ளிடவும்."
            : "Enter your first and last name.";
        }
        return undefined;
      case "gender":
        return value
          ? undefined
          : language === "ta"
            ? "பாலினத்தைத் தேர்ந்தெடுக்கவும்."
            : "Select your gender.";
      case "dateOfBirth":
        if (!value) {
          return language === "ta" ? "பிறந்த தேதியைத் தேர்ந்தெடுக்கவும்." : "Select your date of birth.";
        }
        if (!isAdult(value)) {
          return language === "ta"
            ? "பதிவுசெய்ய குறைந்தது 18 வயது இருக்க வேண்டும்."
            : "You must be at least 18 years old to register.";
        }
        return undefined;
      case "community":
        if (!value) {
          return undefined;
        }
        return value.length > 80
          ? language === "ta"
            ? "இதை 80 எழுத்துகளுக்குள் வைத்திருக்கவும்."
            : "Keep this under 80 characters."
          : undefined;
      case "email":
        if (!value) {
          return language === "ta"
            ? "மின்னஞ்சல் முகவரியை உள்ளிடவும்."
            : "Enter your email address.";
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? undefined
          : language === "ta"
            ? "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்."
            : "Enter a valid email address.";
      case "phone":
        return normalizePhone(value).length === 10
          ? undefined
          : language === "ta"
            ? "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்."
            : "Enter a valid 10-digit phone number.";
      case "password":
        if (!value) {
          return language === "ta" ? "கடவுச்சொல்லை உள்ளிடவும்." : "Enter a password.";
        }
        return PASSWORD_RULE.test(value)
          ? undefined
          : language === "ta"
            ? "8-72 எழுத்துகள், பெரிய எழுத்து, சிறிய எழுத்து, எண், மற்றும் சிறப்பு குறி அவசியம்."
            : "Use 8-72 characters with uppercase, lowercase, number, and symbol.";
      case "confirmPassword":
        if (!value) {
          return language === "ta"
            ? "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்."
            : "Confirm your password.";
        }
        return values.password === value
          ? undefined
          : language === "ta"
            ? "கடவுச்சொற்கள் பொருந்தவில்லை."
            : "Passwords do not match.";
      case "height":
        return value
          ? undefined
          : language === "ta"
            ? "உயரத்தைத் தேர்ந்தெடுக்கவும்."
            : "Select your height.";
      case "maritalStatus":
        return isProfileOption(value, MARITAL_STATUS_OPTIONS)
          ? undefined
          : language === "ta"
            ? "திருமண நிலையைத் தேர்ந்தெடுக்கவும்."
            : "Select your marital status.";
      case "education":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "கல்வியை உள்ளிடவும்." : "Enter your education.";
        }
        return hasValidHumanText(value)
          ? undefined
          : language === "ta"
            ? "கல்வி புலத்தில் எழுத்துகள், எண்கள், மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, numbers, spaces, and common punctuation in education.";
      case "occupation":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "தொழிலை உள்ளிடவும்." : "Enter your occupation.";
        }
        return hasValidHumanText(value)
          ? undefined
          : language === "ta"
            ? "தொழில் புலத்தில் எழுத்துகள், எண்கள், மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, numbers, spaces, and common punctuation in occupation.";
      case "income":
        if (!value) {
          return undefined;
        }
        if (!isProfileOption(value, ANNUAL_INCOME_OPTIONS)) {
          return language === "ta"
            ? "சரியான வருடாந்திர வருமான வரம்பைத் தேர்ந்தெடுக்கவும்."
            : "Select a valid annual income range.";
        }
        return undefined;
      case "city":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "நகரத்தை உள்ளிடவும்." : "Enter your city.";
        }
        return hasValidHumanText(value)
          ? undefined
          : language === "ta"
            ? "நகரப் பெயரில் எழுத்துகள், எண்கள், மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, numbers, spaces, and common punctuation in the city field.";
      case "state":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "மாநிலத்தை உள்ளிடவும்." : "Enter your state.";
        }
        return hasValidHumanText(value)
          ? undefined
          : language === "ta"
            ? "மாநிலப் பெயரில் எழுத்துகள், எண்கள், மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, numbers, spaces, and common punctuation in the state field.";
      case "caste":
        if (!hasMeaningfulText(value)) {
          return language === "ta" ? "சாதியை உள்ளிடவும்." : "Enter your caste.";
        }
        return hasValidHumanText(value)
          ? undefined
          : language === "ta"
            ? "சாதி புலத்தில் எழுத்துகள், எண்கள், மற்றும் பொதுவான குறியீடுகள் மட்டும் பயன்படுத்தவும்."
            : "Use letters, numbers, spaces, and common punctuation in the caste field.";
      default:
        return undefined;
    }
  }

  function setErrorsForFields(
    nextErrors: RegisterErrors,
    fieldKeys: readonly RegisterFieldKey[],
  ) {
    setFieldErrors((current) => {
      const updated = { ...current };

      fieldKeys.forEach((fieldKey) => {
        delete updated[fieldKey];
      });

      return { ...updated, ...nextErrors };
    });
  }

  function validateFields(fieldKeys: readonly RegisterFieldKey[]) {
    const nextErrors: RegisterErrors = {};

    fieldKeys.forEach((fieldKey) => {
      const message = validateField(fieldKey, formData);

      if (message) {
        nextErrors[fieldKey] = message;
      }
    });

    setErrorsForFields(nextErrors, fieldKeys);

    return nextErrors;
  }

  function validateCurrentStep() {
    const fieldKeys = STEP_FIELDS[step] as readonly RegisterFieldKey[];
    const nextErrors = validateFields(fieldKeys);
    const firstError = Object.values(nextErrors)[0];

    if (firstError) {
      toast.error(firstError || copy.completeStep);
      return false;
    }

    return true;
  }

  function updateField<K extends RegisterFieldKey>(key: K, value: RegisterFormData[K]) {
    const nextValues = { ...formData, [key]: value };
    setFormData(nextValues);

    if (fieldErrors[key] || key === "password" || key === "confirmPassword") {
      const keysToRefresh =
        key === "password" || key === "confirmPassword"
          ? (["password", "confirmPassword"] as const)
          : ([key] as const);
      const nextErrors: RegisterErrors = {};

      keysToRefresh.forEach((fieldKey) => {
        const message = validateField(fieldKey, nextValues);

        if (message) {
          nextErrors[fieldKey] = message;
        }
      });

      setErrorsForFields(nextErrors, keysToRefresh);
    }
  }

  async function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (step < 3) {
      setStep((current) => (current + 1) as 2 | 3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    try {
      await requestJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success(copy.success);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError && error.fieldErrors) {
        const nextErrors = error.fieldErrors as RegisterErrors;
        setFieldErrors(nextErrors);

        const firstField = Object.keys(nextErrors)[0] as RegisterFieldKey | undefined;
        const firstMessage = firstField ? nextErrors[firstField] : undefined;

        if (firstField) {
          setStep(FIELD_STEP[firstField]);
        }

        toast.error(firstMessage ?? error.message);
      } else {
        toast.error(error instanceof Error ? error.message : copy.fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell px-4 py-8 sm:px-6 sm:py-10">
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => {
                if (step === 1) {
                  router.push("/");
                  return;
                }
                setStep((current) => (current - 1) as 1 | 2);
              }}
              className="btn-nav-back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{step === 1 ? copy.backToHome : copy.backToPrevious}</span>
            </button>
          </motion.div>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="hidden lg:flex lg:flex-col">
              <div className="hero-surface flex h-full flex-col p-6 xl:p-7">
                <span className="eyebrow-pill self-start">{copy.createProfile}</span>
                <div className="mt-5">
                  <h1 className="max-w-lg text-5xl text-slate-900 xl:text-[4rem]">
                    {copy.heroTitle}
                  </h1>
                </div>

                <div className="panel-muted mt-6 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="section-label">
                      {language === "ta" ? `படி ${step} / 3` : `Step ${step} of 3`}
                    </span>
                    <span className="tag-pill">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#B91C1C] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(185,28,28,0.2)]">
                      {step}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-xl text-slate-900">
                        {stepLabels[step - 1]}
                      </div>
                      <div className="mt-3 grid gap-2">
                        {stepFocusItems[step - 1].map((item) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <div className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B91C1C]" />
                            <p className="text-sm leading-6 text-slate-600">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <div className="panel-muted flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.08] text-[#B91C1C]">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {copy.signInCardTitle}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {copy.signInCardDescription}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/login"
                        className="btn-ghost shrink-0 px-4 py-2.5 text-sm font-semibold"
                      >
                        {copy.signInCardAction}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {stepLabels.map((label, index) => {
                    const position = index + 1;
                    const active = position === step;

                    return (
                      <div
                        key={label}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                          active
                            ? "border-[#B91C1C]/18 bg-[#B91C1C]/[0.06] text-[#991B1B]"
                            : "border-[#B91C1C]/10 bg-white/80 text-slate-500"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                            active
                              ? "bg-[#B91C1C] text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {position}
                        </span>
                        <span className="font-medium">{label}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel-surface flex h-full flex-col p-6 sm:p-8 md:p-10"
              >
                <div className="section-label">{copy.guideLabel}</div>
                <h1 className="mt-3 font-display text-4xl text-slate-900">
                  {t("register.title")}
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {copy.introDescription}
                </p>

                <div className="mt-7">
                  <div className="progress-track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      className="progress-fill"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {stepLabels.map((label, index) => {
                      const position = index + 1;
                      const active = position === step;
                      const complete = position < step;

                      return (
                        <div
                          key={label}
                          className={`rounded-xl border px-2 py-2.5 text-center sm:px-4 sm:py-3.5 sm:text-left ${
                            active
                              ? "border-[#B91C1C]/16 bg-[#B91C1C]/[0.05]"
                              : "border-slate-200/80 bg-slate-50/70"
                          }`}
                        >
                          <div
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold sm:h-8 sm:w-8 sm:text-xs ${
                              complete
                                ? "bg-emerald-600 text-white"
                                : active
                                  ? "bg-[#B91C1C] text-white"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {complete ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : position}
                          </div>
                          <div className="mt-2 text-[11px] font-semibold leading-[1.2] text-slate-700 sm:text-[13px] sm:leading-normal">
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleContinue} className="mt-7 space-y-5">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <Field label={t("register.profile.for")} error={fieldErrors.profileFor}>
                          <SelectControl
                            value={formData.profileFor}
                            onChange={(event) => updateField("profileFor", event.target.value)}
                            aria-invalid={Boolean(fieldErrors.profileFor)}
                            required
                          >
                            <option value="">{copy.profileForPlaceholder}</option>
                            <option value="self">{t("register.self")}</option>
                            <option value="son">{t("register.son")}</option>
                            <option value="daughter">{t("register.daughter")}</option>
                            <option value="brother">{t("register.brother")}</option>
                            <option value="sister">{t("register.sister")}</option>
                            <option value="friend">{t("register.friend")}</option>
                            <option value="relative">{t("register.relative")}</option>
                          </SelectControl>
                        </Field>

                        <Field label={t("register.full.name")} error={fieldErrors.fullName}>
                          <InputControl
                            value={formData.fullName}
                            onChange={(event) => updateField("fullName", event.target.value)}
                            autoComplete="name"
                            aria-invalid={Boolean(fieldErrors.fullName)}
                            placeholder={copy.fullNamePlaceholder}
                            required
                          />
                        </Field>

                        <Field label={t("register.gender")} error={fieldErrors.gender}>
                          <SelectControl
                            value={formData.gender}
                            onChange={(event) => updateField("gender", event.target.value)}
                            aria-invalid={Boolean(fieldErrors.gender)}
                            required
                          >
                            <option value="">{copy.genderPlaceholder}</option>
                            <option value="male">{t("register.gender.male")}</option>
                            <option value="female">{t("register.gender.female")}</option>
                          </SelectControl>
                        </Field>

                        <Field label={t("register.dob")} error={fieldErrors.dateOfBirth}>
                          <DateControl
                            value={formData.dateOfBirth}
                            onChange={(event) => updateField("dateOfBirth", event.target.value)}
                            aria-invalid={Boolean(fieldErrors.dateOfBirth)}
                            placeholder={copy.datePlaceholder}
                            required
                          />
                        </Field>

                        <Field
                          label={t("register.community")}
                          error={fieldErrors.community}
                          hint={copy.communityHint}
                          className="sm:col-span-2"
                        >
                          <InputControl
                            value={formData.community}
                            onChange={(event) => updateField("community", event.target.value)}
                            aria-invalid={Boolean(fieldErrors.community)}
                            placeholder={copy.communityHint}
                          />
                        </Field>
                      </motion.div>
                    ) : null}

                    {step === 2 ? (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label={t("register.email")} error={fieldErrors.email}>
                            <InputControl
                              type="email"
                              value={formData.email}
                              onChange={(event) => updateField("email", event.target.value)}
                              autoComplete="email"
                              aria-invalid={Boolean(fieldErrors.email)}
                              placeholder={copy.emailPlaceholder}
                              required
                            />
                          </Field>

                          <Field
                            label={t("register.phone")}
                            error={fieldErrors.phone}
                            hint={copy.phoneHint}
                          >
                            <InputControl
                              type="tel"
                              value={formData.phone}
                              onChange={(event) =>
                                updateField("phone", sanitizePhoneInput(event.target.value))
                              }
                              autoComplete="tel"
                              aria-invalid={Boolean(fieldErrors.phone)}
                              placeholder={copy.phoneHint}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              required
                            />
                          </Field>

                          <Field label={t("register.password")} error={fieldErrors.password}>
                            <PasswordControl
                              value={formData.password}
                              onChange={(event) => updateField("password", event.target.value)}
                              autoComplete="new-password"
                              aria-invalid={Boolean(fieldErrors.password)}
                              placeholder={copy.passwordPlaceholder}
                              required
                            />
                          </Field>

                          <Field
                            label={t("register.confirm.password")}
                            error={fieldErrors.confirmPassword}
                          >
                            <PasswordControl
                              value={formData.confirmPassword}
                              onChange={(event) =>
                                updateField("confirmPassword", event.target.value)
                              }
                              autoComplete="new-password"
                              aria-invalid={Boolean(fieldErrors.confirmPassword)}
                              placeholder={copy.confirmPasswordPlaceholder}
                              required
                            />
                          </Field>
                        </div>

                        <div className="panel-muted flex items-start gap-3 p-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.08] text-[#B91C1C]">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {copy.passwordTitle}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-slate-500">
                              {copy.passwordHint}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}

                    {step === 3 ? (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label={t("register.height")} error={fieldErrors.height}>
                            <SelectControl
                              value={formData.height}
                              onChange={(event) => updateField("height", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.height)}
                              required
                            >
                              <option value="">{copy.heightPlaceholder}</option>
                              {heightOptions.map((height) => (
                                <option key={height} value={height}>
                                  {height}
                                </option>
                              ))}
                            </SelectControl>
                          </Field>

                          <Field
                            label={t("register.marital.status")}
                            error={fieldErrors.maritalStatus}
                          >
                            <SelectControl
                              value={formData.maritalStatus}
                              onChange={(event) =>
                                updateField("maritalStatus", event.target.value)
                              }
                              aria-invalid={Boolean(fieldErrors.maritalStatus)}
                              required
                            >
                              <option value="">{copy.maritalPlaceholder}</option>
                              {MARITAL_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {translateDisplayValue(status, language)}
                                </option>
                              ))}
                            </SelectControl>
                          </Field>

                          <Field label={t("register.education")} error={fieldErrors.education}>
                            <InputControl
                              value={formData.education}
                              onChange={(event) => updateField("education", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.education)}
                              placeholder={copy.educationPlaceholder}
                              required
                            />
                          </Field>

                          <Field label={t("register.occupation")} error={fieldErrors.occupation}>
                            <InputControl
                              value={formData.occupation}
                              onChange={(event) => updateField("occupation", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.occupation)}
                              placeholder={copy.occupationPlaceholder}
                              required
                            />
                          </Field>

                          <Field
                            label={t("register.annual.income")}
                            error={fieldErrors.income}
                            hint={copy.incomeHint}
                          >
                            <SelectControl
                              value={formData.income}
                              onChange={(event) =>
                                updateField("income", event.target.value)
                              }
                              aria-invalid={Boolean(fieldErrors.income)}
                            >
                              <option value="">{copy.incomePlaceholder}</option>
                              {ANNUAL_INCOME_OPTIONS.map((incomeRange) => (
                                <option key={incomeRange} value={incomeRange}>
                                  {translateDisplayValue(incomeRange, language)}
                                </option>
                              ))}
                            </SelectControl>
                          </Field>

                          <Field label={t("register.city")} error={fieldErrors.city}>
                            <InputControl
                              value={formData.city}
                              onChange={(event) => updateField("city", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.city)}
                              placeholder={copy.cityPlaceholder}
                              required
                            />
                          </Field>

                          <Field label={t("register.state")} error={fieldErrors.state}>
                            <InputControl
                              value={formData.state}
                              onChange={(event) => updateField("state", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.state)}
                              placeholder={copy.statePlaceholder}
                              required
                            />
                          </Field>

                          <Field label={t("register.caste")} error={fieldErrors.caste}>
                            <InputControl
                              value={formData.caste}
                              onChange={(event) => updateField("caste", event.target.value)}
                              aria-invalid={Boolean(fieldErrors.caste)}
                              placeholder={copy.castePlaceholder}
                              required
                            />
                          </Field>
                        </div>

                        <div className="panel-muted flex items-start gap-3 p-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.08] text-[#B91C1C]">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {copy.summaryTitle}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-slate-500">
                              {copy.summaryDescription}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <button disabled={isLoading} type="submit" className="btn-primary mt-2 w-full py-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{copy.creating}</span>
                      </>
                    ) : (
                      <span>{step === 3 ? copy.create : copy.continue}</span>
                    )}
                  </button>

                  <div className="text-center text-sm text-slate-500 lg:hidden">
                    {copy.mobileSignInPrompt}{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                    >
                      {copy.mobileSignInLink}
                    </Link>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-medium text-slate-600">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-[#B91C1C]">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
