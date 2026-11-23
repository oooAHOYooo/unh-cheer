export type SkillCategory = 
  | 'Interviews'
  | 'Tumbling & Flips'
  | 'Stunts & Partner'
  | 'Pyramids'
  | 'Basket Tosses'
  | 'Game Day & Chants';

export type ReviewStatus = 
  | 'needs_review'
  | 'coach_approved'
  | 'revision_requested'
  | 'ready_to_post';

export interface Clip {
  id: string;
  title: string;
  skillCategory: SkillCategory;
  folder?: string; // e.g. "Interviews", "Tumbling", "Game Day"
  athletes: string[];
  thumbnailUrl: string;
  videoUrl?: string; // Direct bucket mp4 link
  bucketKey?: string;
  fileSize?: string; // e.g. "190.7 MB"
  duration?: string;
  aspectRatio: '9:16' | '16:9';
  status: ReviewStatus;
  coachFeedback?: string;
  dateRecorded: string;
  captionDraft?: string;
  tags?: string[];
}

export type EventType = 'game_day' | 'practice' | 'competition' | 'content_drop';

export interface CheerEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  location?: string;
  description?: string;
}
