import { Clip, CheerEvent } from '../types/cheer';

export const INITIAL_CLIPS: Clip[] = [
  {
    id: 'interview-1',
    title: 'UNH Cheer Athlete Interview - Part 1 (Color Graded / Uncut)',
    skillCategory: 'Interviews',
    folder: 'Interviews',
    athletes: ['New Haven Cheer Athletes', 'Coach Alexis Vano'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_1.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_1.mp4',
    fileSize: '190.7 MB',
    duration: 'Full Master',
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
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_2.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_2.mp4',
    fileSize: '136.9 MB',
    duration: 'Full Master',
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
    thumbnailUrl: 'https://images.unsplash.com/photo-1508215885820-468079233ce9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://storage.googleapis.com/ag-photography/2026%20-%20ECM%20-%20BUCKET/2026%20-%20UNH%20-%20EXPORTS/Interviews/Interviews_3.mp4',
    bucketKey: '2026 - ECM - BUCKET/2026 - UNH - EXPORTS/Interviews/Interviews_3.mp4',
    fileSize: '76.5 MB',
    duration: 'Full Master',
    aspectRatio: '16:9',
    status: 'coach_approved',
    coachFeedback: 'Color graded interview wrap. Sound and picture verified.',
    dateRecorded: '2026-11-23',
    captionDraft: 'Wrapping up our interview series with UNH Cheer! Download full high-res cut below. 💙💛 #UNHCheer',
    tags: ['Interview', 'Full Master', 'Color Graded']
  },
  {
    id: 'clip-1',
    title: 'Standing Back Tuck - Clean Landing Drill',
    skillCategory: 'Tumbling & Flips',
    folder: 'Tumbling & Flips',
    athletes: ['Darby Brown (Captain)'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    fileSize: '24.2 MB',
    duration: '0:12',
    aspectRatio: '9:16',
    status: 'coach_approved',
    coachFeedback: 'Solid chest height on takeoff and clean stick on the landing mat. Approved for social reel.',
    dateRecorded: '2026-11-18',
    captionDraft: 'Dialing in the standing tucks at practice! ⚡️💙 #UNHCheer #ChargerPride #NewHavenChargers #Tumbling',
    bucketKey: 'tumbling/darby-standing-tuck.mp4'
  },
  {
    id: 'clip-2',
    title: 'Coed Extension to Liberty Drill',
    skillCategory: 'Stunts & Partner',
    folder: 'Stunts & Partner',
    athletes: ['Anthony Graziosa (Base)', 'Leila Lake (Flyer)'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1508215885820-468079233ce9?auto=format&fit=crop&w=800&q=80',
    fileSize: '31.5 MB',
    duration: '0:18',
    aspectRatio: '9:16',
    status: 'needs_review',
    coachFeedback: 'Hold the lockout at the top count for one more beat before the dismount.',
    dateRecorded: '2026-11-19',
    captionDraft: 'Coed stunt reps before game day! Anthony & Leila locking in the extension. 💙💛 #UNHCheer #StuntSquad',
    bucketKey: 'stunts/anthony-leila-liberty.mp4'
  },
  {
    id: 'clip-3',
    title: 'Game Day Fight Song & Megaphone Routine',
    skillCategory: 'Game Day & Chants',
    folder: 'Game Day & Chants',
    athletes: ['New Haven Cheer Squad'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    fileSize: '42.8 MB',
    duration: '0:25',
    aspectRatio: '16:9',
    status: 'ready_to_post',
    coachFeedback: 'Sharp motions and loud crowd engagement on the sideline.',
    dateRecorded: '2026-11-15',
    captionDraft: 'Nothing beats Saturday game day at DellaCamera Stadium! Charger pride in full effect! ⚡️🏈 #UNHCheer #ChargerNation',
    bucketKey: 'gameday/sideline-fight-song.mp4'
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
