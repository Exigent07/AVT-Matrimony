export const MARITAL_STATUS_OPTIONS = [
  "Never Married",
  "Divorced",
  "Widowed",
] as const;

export const ANNUAL_INCOME_OPTIONS = [
  "Below ₹3 Lakhs",
  "₹3-5 Lakhs",
  "₹5-7 Lakhs",
  "₹8-10 Lakhs",
  "₹10-15 Lakhs",
  "₹15-18 Lakhs",
  "₹18-22 Lakhs",
  "₹22-30 Lakhs",
  "₹30+ Lakhs",
] as const;

export const FAMILY_STATUS_OPTIONS = [
  "Middle Class",
  "Upper Middle Class",
  "Affluent",
] as const;

export const FAMILY_TYPE_OPTIONS = [
  "Nuclear Family",
  "Joint Family",
] as const;

export const EMPLOYED_IN_OPTIONS = [
  "Private Company",
  "Government / Public Sector",
  "Business / Self Employed",
  "Defense / Civil Services",
  "Not Working",
] as const;

export const RESIDENCY_STATUS_OPTIONS = [
  "Citizen",
  "Permanent Resident",
  "Work Permit",
  "Student Visa",
] as const;

export const DIET_OPTIONS = [
  "Vegetarian",
  "Eggetarian",
  "Non Vegetarian",
  "Vegan",
] as const;

export const HABIT_FREQUENCY_OPTIONS = [
  "Never",
  "Occasionally",
  "Regularly",
] as const;

export const BODY_TYPE_OPTIONS = [
  "Slim",
  "Average",
  "Athletic",
  "Heavy",
] as const;

export const COMPLEXION_OPTIONS = [
  "Fair",
  "Wheatish",
  "Dusky",
] as const;

export const PHYSICAL_STATUS_OPTIONS = [
  "Normal",
  "Differently Abled",
] as const;

type OptionList = readonly string[];

function normalizeLookupKey(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createOptionNormalizer<T extends OptionList>(
  options: T,
  aliases: Record<string, T[number]> = {},
) {
  const optionMap = new Map(
    options.map((option) => [normalizeLookupKey(option), option] as const),
  );

  return (value: string | null | undefined) => {
    if (!value) {
      return null;
    }

    const normalizedKey = normalizeLookupKey(value);

    if (!normalizedKey || normalizedKey === "not specified" || normalizedKey === "not provided") {
      return null;
    }

    return optionMap.get(normalizedKey) ?? aliases[normalizedKey] ?? null;
  };
}

export function isProfileOption<T extends OptionList>(
  value: string,
  options: T,
): value is T[number] {
  return options.includes(value as T[number]);
}

export const normalizeMaritalStatus = createOptionNormalizer(MARITAL_STATUS_OPTIONS, {
  unmarried: "Never Married",
  single: "Never Married",
});

export const normalizeAnnualIncome = createOptionNormalizer(ANNUAL_INCOME_OPTIONS, {
  "below 3 lakhs": "Below ₹3 Lakhs",
  "under ₹3 lakhs": "Below ₹3 Lakhs",
  "under 3 lakhs": "Below ₹3 Lakhs",
  "₹3 5 lakhs": "₹3-5 Lakhs",
  "3 5 lakhs": "₹3-5 Lakhs",
  "₹5 7 lakhs": "₹5-7 Lakhs",
  "5 7 lakhs": "₹5-7 Lakhs",
  "₹8 10 lakhs": "₹8-10 Lakhs",
  "8 10 lakhs": "₹8-10 Lakhs",
  "₹10 15 lakhs": "₹10-15 Lakhs",
  "10 15 lakhs": "₹10-15 Lakhs",
  "₹15 18 lakhs": "₹15-18 Lakhs",
  "15 18 lakhs": "₹15-18 Lakhs",
  "₹18 22 lakhs": "₹18-22 Lakhs",
  "18 22 lakhs": "₹18-22 Lakhs",
  "₹22 30 lakhs": "₹22-30 Lakhs",
  "22 30 lakhs": "₹22-30 Lakhs",
  "above ₹30 lakhs": "₹30+ Lakhs",
  "above 30 lakhs": "₹30+ Lakhs",
  "30 lakhs+": "₹30+ Lakhs",
});

export const normalizeFamilyStatus = createOptionNormalizer(FAMILY_STATUS_OPTIONS, {
  "upper middle class family": "Upper Middle Class",
});

export const normalizeFamilyType = createOptionNormalizer(FAMILY_TYPE_OPTIONS, {
  nuclear: "Nuclear Family",
  joint: "Joint Family",
});

export const normalizeEmployedIn = createOptionNormalizer(EMPLOYED_IN_OPTIONS, {
  private: "Private Company",
  govt: "Government / Public Sector",
  government: "Government / Public Sector",
  "public sector": "Government / Public Sector",
  business: "Business / Self Employed",
  selfemployed: "Business / Self Employed",
  defense: "Defense / Civil Services",
  "civil services": "Defense / Civil Services",
});

export const normalizeResidencyStatus = createOptionNormalizer(RESIDENCY_STATUS_OPTIONS, {
  citizen: "Citizen",
  pr: "Permanent Resident",
  "permanent residency": "Permanent Resident",
  "work visa": "Work Permit",
  student: "Student Visa",
});

export const normalizeDiet = createOptionNormalizer(DIET_OPTIONS, {
  veg: "Vegetarian",
  vegetarian: "Vegetarian",
  eggetarian: "Eggetarian",
  eggitarian: "Eggetarian",
  "non veg": "Non Vegetarian",
  "non vegetarian": "Non Vegetarian",
});

export const normalizeHabitFrequency = createOptionNormalizer(HABIT_FREQUENCY_OPTIONS, {
  no: "Never",
  none: "Never",
  "does not smoke": "Never",
  "non smoker": "Never",
  "doesn't smoke": "Never",
  "does not drink": "Never",
  "non drinker": "Never",
  "doesn't drink": "Never",
  occasional: "Occasionally",
  socially: "Occasionally",
  social: "Occasionally",
  regular: "Regularly",
  yes: "Regularly",
});

export const normalizeBodyType = createOptionNormalizer(BODY_TYPE_OPTIONS);
export const normalizeComplexion = createOptionNormalizer(COMPLEXION_OPTIONS);
export const normalizePhysicalStatus = createOptionNormalizer(PHYSICAL_STATUS_OPTIONS, {
  normal: "Normal",
  disabled: "Differently Abled",
});

export function getAvailableProfileOptions<T extends OptionList>(
  options: T,
  values: Array<string | null | undefined>,
  normalizer?: (value: string | null | undefined) => string | null,
) {
  const normalizedValues = new Set(
    values
      .map((value) => (normalizer ? normalizer(value) : value?.trim() || null))
      .filter((value): value is string => Boolean(value)),
  );

  return options.filter((option) => normalizedValues.has(option));
}
