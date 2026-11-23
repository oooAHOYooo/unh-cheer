import { Clip, CheerEvent } from '../types/cheer';

export const INITIAL_CLIPS: Clip[] = [
  {
    id: 'interview-1',
    title: 'UNH Cheer Athlete Interview - Part 1 (Color Graded / Uncut)',
    skillCategory: 'Interviews',
    folder: 'Interviews',
    athletes: ['New Haven Cheer Athletes', 'Coach Alexis Vano'],
    thumbnailUrl: '/thumbnails/interview_1.jpg',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_1.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_1.mp4',
    fileSize: '190.7 MB',
    duration: '2:11',
    aspectRatio: '16:9',
    status: 'coach_approved',
    coachFeedback: 'Full uncut master export. Color graded and ready for download/clipping.',
    dateRecorded: '2026-11-23',
    captionDraft: 'Behind the scenes with the University of New Haven Cheerleaders! Part 1 full interview. 💙⚡️ #UNHCheer #ChargerPride #CollegeCheer',
    tags: ['Interview', 'Full Master', 'Color Graded', 'Raw Footage']
  },
  {
    id: 'interview-2',
    title: 'UNH Cheer Athlete Interview - Part 2 (Color Graded / Uncut)',
    skillCategory: 'Interviews',
    folder: 'Interviews',
    athletes: ['New Haven Cheer Athletes'],
    thumbnailUrl: '/thumbnails/interview_2.jpg',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_2.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_2.mp4',
    fileSize: '136.9 MB',
    duration: '1:34',
    aspectRatio: '16:9',
    status: 'coach_approved',
    coachFeedback: 'Full uncut interview reel. Great athlete perspectives on team culture and training.',
    dateRecorded: '2026-11-23',
    captionDraft: 'Inside look at what it takes to be a Charger cheerleader! Part 2 interview export. ⚡️ #UNHCheer #ChargerNation',
    tags: ['Interview', 'Full Master', 'Color Graded', 'Athletes']
  },
  {
    id: 'interview-3',
    title: 'UNH Cheer Athlete Interview - Part 3 (Color Graded / Uncut)',
    skillCategory: 'Interviews',
    folder: 'Interviews',
    athletes: ['New Haven Cheer Athletes'],
    thumbnailUrl: '/thumbnails/interview_3.jpg',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_3.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_3.mp4',
    fileSize: '76.5 MB',
    duration: '0:53',
    aspectRatio: '16:9',
    status: 'coach_approved',
    coachFeedback: 'Color graded interview wrap. Sound and picture verified.',
    dateRecorded: '2026-11-23',
    captionDraft: 'Wrapping up our interview series with UNH Cheer! Download full high-res cut below. 💙💛 #UNHCheer',
    tags: ['Interview', 'Full Master', 'Color Graded']
  },
  {
    id: 'interview-4',
    title: 'UNH Cheer Athlete Interview - Part 4 (Color Graded / Uncut)',
    skillCategory: 'Interviews',
    folder: 'Interviews',
    athletes: ['New Haven Cheer Athletes'],
    thumbnailUrl: '/thumbnails/interview_4.jpg',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_4.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_4.mp4',
    fileSize: '71.1 MB',
    duration: '0:49',
    aspectRatio: '16:9',
    status: 'coach_approved',
    coachFeedback: 'Color graded uncut athlete interview reel. Ready for download/viewing.',
    dateRecorded: '2026-11-23',
    captionDraft: 'UNH Cheer interview series Part 4! Athlete stories, preparation, and team goals. ⚡️ #UNHCheer #ChargerNation',
    tags: ['Interview', 'Full Master', 'Color Graded', 'Athletes']
  }
];

export const INITIAL_EVENTS: CheerEvent[] = [
  {
    id: 'evt-1',
    title: 'Chargers Football Game Day vs Southern Conn',
    type: 'game_day',
    date: '2026-11-21',
    time: '1:00 PM',
    location: 'Ralph F. DellaCamera Stadium',
    description: 'Pregame fan tunnel, sideline cheer performance, and halftime routine.'
  },
  {
    id: 'evt-2',
    title: 'Nationals Routine Cleaning & Choreography',
    type: 'practice',
    date: '2026-11-23',
    time: '6:30 PM - 8:30 PM',
    location: 'Charger Gymnasium',
    description: 'Video review session with Coach Alexis Vano and pyramid timing work.'
  },
  {
    id: 'evt-3',
    title: 'Charger Cheer Winter Showcase',
    type: 'competition',
    date: '2026-12-05',
    time: '5:00 PM',
    location: 'Beckerman Recreation Center',
    description: 'Exhibition showcase for campus community, family, and recruits.'
  }
];
