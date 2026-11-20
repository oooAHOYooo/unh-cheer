export type SkillCategory = 
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
  athletes: string[];
  thumbnailUrl: string;
  videoUrl?: string; // Optional bucket mp4 link
  bucketKey?: string;
  duration?: string;
  aspectRatio: '9:16' | '16:9';
  status: ReviewStatus;
  coachFeedback?: string;
  dateRecorded: string;
  captionDraft?: string;
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
