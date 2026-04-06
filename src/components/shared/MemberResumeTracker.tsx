"use client";

import { useEffect } from "react";
import { writeMemberResume, type MemberResumeEntry } from "@/lib/member-resume";

interface MemberResumeTrackerProps {
  viewerId: string;
  entry: MemberResumeEntry | null;
}

export function MemberResumeTracker({ viewerId, entry }: MemberResumeTrackerProps) {
  useEffect(() => {
    if (!entry) {
      return;
    }

    writeMemberResume(viewerId, entry);
  }, [entry, viewerId]);

  return null;
}
