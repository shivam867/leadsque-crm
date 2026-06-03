// ─── Re-export everything from dummy.ts so lead-detail and the rest
// of the app share one source of truth. No duplication, no mismatch.
export type {
  Lead,
  LeadStatus,
  LeadScore,
  LeadPriority,
  ActivityType,
  ActivityItem,
  CallLog,
  FollowUp,
  CounselingNote,
  ObjectionEntry,
  LeadIntelligence,
} from "@/data/dummy";