export type SkillCategory = 
  | 'Tumbling & Flips'
  | 'Stunts & Partner'
  | 'Pyramids'
  | 'Basket Tosses'
  | 'Jumps & Motions'
  | 'Game Day & Chants'
  | 'Halftime Routines'
  | 'Conditioning & Drills';

export type ReviewStatus = 
  | 'needs_review'
  | 'coach_approved'
  | 'revision_requested'
  | 'ready_to_post'
  | 'posted';

export type SocialPlatform = 
  | 'Instagram Reel'
  | 'TikTok'
  | 'YouTube Shorts'
  | 'Instagram Story'
  | 'X (Twitter)';

export interface Clip {
  id: string;
  title: string;
  skillCategory: SkillCategory;
  athletes: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  targetPlatforms: SocialPlatform[];
  status: ReviewStatus;
  coachFeedback?: string;
  coachRating?: number; // 1 to 5
  tags: string[];
  aspectRatio: '9:16' | '16:9' | '1:1';
  dateRecorded: string;
  captionDraft?: string;
  bucketKey?: string;
  views?: number;
}

export type EventType = 'practice' | 'game_day' | 'competition' | 'social_drop' | 'team_meeting';

export interface CheerEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  description?: string;
  linkedClipIds?: string[];
}

export interface BucketConfig {
  provider: 's3' | 'r2' | 'supabase' | 'netlify-blobs' | 'custom';
  bucketName: string;
  publicUrlPrefix: string;
  region?: string;
}
