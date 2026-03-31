export type ViewerRole = "MEMBER" | "ADMIN";
export type ViewerAccountStatus = "ACTIVE" | "BLOCKED";
export type ViewerProfileStatus = "PENDING" | "APPROVED" | "REJECTED" | null;
export type InterestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CONTACT_SHARED";

export interface SessionViewer {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
  role: ViewerRole;
  accountStatus: ViewerAccountStatus;
  profileStatus: ViewerProfileStatus;
  profileComplete: boolean;
  gender: "Male" | "Female" | null;
  city: string | null;
  selectedInterests: string[];
}

export interface ProfileCard {
  userId: string;
  profileId: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female";
  city: string;
  state: string;
  occupation: string;
  education: string;
  annualIncome: string;
  height: string;
  caste: string;
  maritalStatus: string;
  religion: string;
  star: string;
  diet: string;
  smoking: string;
  drinking: string;
  about: string;
  interests: string[];
  profilePhotoUrl: string | null;
  profileStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ProfileDetail extends ProfileCard {
  dateOfBirth: string;
  email: string | null;
  phone: string | null;
  community: string;
  subCaste: string;
  gothram: string;
  raasi: string;
  country: string;
  residencyStatus: string;
  employedIn: string;
  familyStatus: string;
  familyType: string;
  fatherOccupation: string;
  motherOccupation: string;
  brothers: number | null;
  sisters: number | null;
  weightKg: number | null;
  bodyType: string;
  complexion: string;
  physicalStatus: string;
  hobbies: string;
  partnerAgeFrom: number | null;
  partnerAgeTo: number | null;
  partnerHeight: string;
  partnerMaritalStatus: string;
  partnerEducation: string;
  partnerOccupation: string;
  partnerIncome: string;
  partnerLocation: string;
  partnerExpectations: string;
  horoscopeImageUrl: string | null;
  canViewContact: boolean;
}

export interface DashboardData {
  viewer: SessionViewer;
  profile: ProfileDetail;
  counts: {
    interestsSent: number;
    interestsReceived: number;
    mutualMatches: number;
    pendingProfileReview: number;
  };
  interestedInYou: InterestItem[];
  recentMatches: ProfileCard[];
}

export interface InterestItem {
  id: string;
  direction: "sent" | "received";
  status: InterestStatus;
  createdAt: string;
  contactSharedAt: string | null;
  counterpart: ProfileCard;
  contactDetails: {
    email: string | null;
    phone: string | null;
  } | null;
}

export interface AdminUserItem {
  userId: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string | null;
  gender: "Male" | "Female";
  city: string;
  occupation: string;
  createdAt: string;
  accountStatus: ViewerAccountStatus;
  profileStatus: "PENDING" | "APPROVED" | "REJECTED";
  interestCount: number;
}

export interface AdminInterestItem {
  id: string;
  status: InterestStatus;
  createdAt: string;
  contactSharedAt: string | null;
  fromUser: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface SupportTicketItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reportedProfileReference: string;
  reason: "FAKE_PROFILE" | "INAPPROPRIATE_BEHAVIOR" | "HARASSMENT" | "SCAM" | "OTHER";
  details: string;
  status: "OPEN" | "REVIEWED" | "RESOLVED";
  createdAt: string;
  reporterName: string;
  reportedName: string | null;
}

export interface AdminDashboardData {
  viewer: SessionViewer;
  stats: {
    totalUsers: number;
    pendingProfiles: number;
    pendingInterests: number;
    sharedContacts: number;
    openTickets: number;
    openReports: number;
  };
  users: AdminUserItem[];
  interests: AdminInterestItem[];
  tickets: SupportTicketItem[];
  reports: ReportItem[];
}
