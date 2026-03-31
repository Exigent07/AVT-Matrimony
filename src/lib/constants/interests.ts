export interface InterestOption {
  slug: string;
  label: string;
}

export interface InterestCategory {
  id: string;
  label: string;
  items: InterestOption[];
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: "creative-arts",
    label: "Creative & Arts",
    items: [
      { slug: "painting", label: "Painting" },
      { slug: "theatre", label: "Theatre" },
      { slug: "cinema", label: "Cinema" },
      { slug: "photography", label: "Photography" },
      { slug: "writing", label: "Writing" },
      { slug: "music", label: "Music" },
      { slug: "dance", label: "Dance" },
      { slug: "singing", label: "Singing" },
    ],
  },
  {
    id: "sports-fitness",
    label: "Sports & Fitness",
    items: [
      { slug: "cricket", label: "Cricket" },
      { slug: "football", label: "Football" },
      { slug: "badminton", label: "Badminton" },
      { slug: "tennis", label: "Tennis" },
      { slug: "swimming", label: "Swimming" },
      { slug: "yoga", label: "Yoga" },
      { slug: "gym", label: "Gym" },
      { slug: "running", label: "Running" },
    ],
  },
  {
    id: "hobbies",
    label: "Hobbies",
    items: [
      { slug: "reading", label: "Reading" },
      { slug: "cooking", label: "Cooking" },
      { slug: "gardening", label: "Gardening" },
      { slug: "travelling", label: "Travelling" },
      { slug: "gaming", label: "Gaming" },
      { slug: "puzzles", label: "Puzzles" },
      { slug: "board-games", label: "Board Games" },
      { slug: "coffee", label: "Coffee" },
    ],
  },
  {
    id: "food-culture",
    label: "Food & Culture",
    items: [
      { slug: "baking", label: "Baking" },
      { slug: "healthy-eating", label: "Healthy Eating" },
      { slug: "cultural-events", label: "Cultural Events" },
      { slug: "classical-music", label: "Classical Music" },
      { slug: "traditional-arts", label: "Traditional Arts" },
      { slug: "regional-travel", label: "Regional Travel" },
    ],
  },
  {
    id: "intellectual",
    label: "Intellectual",
    items: [
      { slug: "technology", label: "Technology" },
      { slug: "business", label: "Business" },
      { slug: "science", label: "Science" },
      { slug: "philosophy", label: "Philosophy" },
      { slug: "current-affairs", label: "Current Affairs" },
      { slug: "learning", label: "Learning" },
      { slug: "problem-solving", label: "Problem Solving" },
    ],
  },
  {
    id: "social",
    label: "Social",
    items: [
      { slug: "volunteering", label: "Volunteering" },
      { slug: "socialising", label: "Socialising" },
      { slug: "public-speaking", label: "Public Speaking" },
      { slug: "community-service", label: "Community Service" },
      { slug: "event-planning", label: "Event Planning" },
    ],
  },
  {
    id: "nature-adventure",
    label: "Nature & Adventure",
    items: [
      { slug: "trekking", label: "Trekking" },
      { slug: "camping", label: "Camping" },
      { slug: "beach-activities", label: "Beach Activities" },
      { slug: "wildlife", label: "Wildlife" },
      { slug: "nature-walks", label: "Nature Walks" },
      { slug: "cycling", label: "Cycling" },
    ],
  },
  {
    id: "wellness",
    label: "Spiritual & Wellness",
    items: [
      { slug: "meditation", label: "Meditation" },
      { slug: "spirituality", label: "Spirituality" },
      { slug: "prayer", label: "Prayer" },
      { slug: "mindfulness", label: "Mindfulness" },
      { slug: "wellness", label: "Wellness" },
      { slug: "aromatherapy", label: "Aromatherapy" },
    ],
  },
];

export const INTEREST_OPTIONS = INTEREST_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.label,
  })),
);

export const INTEREST_LABELS = new Set(INTEREST_OPTIONS.map((item) => item.label));
