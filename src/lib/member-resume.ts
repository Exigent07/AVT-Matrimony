export type MemberResumeIconName = "search" | "user" | "heart" | "file" | "help";

export interface MemberResumeCopy {
  en: string;
  ta: string;
}

export interface MemberResumeEntry {
  href: string;
  icon: MemberResumeIconName;
  title: MemberResumeCopy;
  detail?: MemberResumeCopy;
  updatedAt: string;
}

function getStorageKey(viewerId: string) {
  return `avt:member-resume:${viewerId}`;
}

function isMemberResumeCopy(value: unknown): value is MemberResumeCopy {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as MemberResumeCopy).en === "string"
    && typeof (value as MemberResumeCopy).ta === "string";
}

function isMemberResumeEntry(value: unknown): value is MemberResumeEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as MemberResumeEntry;

  return typeof entry.href === "string"
    && typeof entry.icon === "string"
    && isMemberResumeCopy(entry.title)
    && typeof entry.updatedAt === "string"
    && (entry.detail === undefined || isMemberResumeCopy(entry.detail));
}

export function readMemberResume(viewerId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(viewerId));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return isMemberResumeEntry(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeMemberResume(viewerId: string, entry: MemberResumeEntry) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(viewerId), JSON.stringify(entry));
}
