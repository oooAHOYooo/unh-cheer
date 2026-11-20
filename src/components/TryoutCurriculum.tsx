import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  ChevronRight, 
  BookOpen, 
  Award, 
  Info, 
  HeartHandshake, 
  UserCheck, 
  Play,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Clip } from '../types/cheer';

interface TryoutCurriculumProps {
  onSelectClip?: (clip: Clip) => void;
  clips?: Clip[];
}

interface CurriculumCategory {
  id: string;
  title: string;
  subtitle: string;
  level: 'Required' | 'Recommended' | 'Bonus';
  items: {
    name: string;
    description: string;
    coachTip: string;
    mustHave: boolean;
  }[];
}

const CURRICULUM_DATA: CurriculumCategory[] = [
  {
    id: 'tumbling',
    title: '1. Tumbling Skills',
    subtitle: 'Mat and hard surface execution with proper form and landing control',
    level: 'Required',
    items: [
      {
        name: 'Standing Back Tuck',
        description: 'Standing set with explosive vertical jump, tight hollow tuck, and stick landing with chest tall.',
        coachTip: 'Set straight up toward the rafters. Keep your eyes on the horizon—do not throw your head backward early.',
        mustHave: true
      },
      {
        name: 'Standing Back Handspring (or 2 BHS)',
        description: 'Aggressive sit, strong shoulder push through handstand, and quick snap down to feet.',
        coachTip: 'Keep your arms locked by your ears and rebound immediately out of the landing.',
        mustHave: true
      },
      {
        name: 'Running Pass: Round-Off Back Handspring Back Tuck',
        description: 'High-speed entry into hurdle, long reach round-off, snapping handspring into a high back tuck.',
        coachTip: 'Drive speed out of the round-off rebound into the handspring; height comes from the block off your hands.',
        mustHave: true
      },
      {
        name: 'Running Layout or Full Twist (Bonus / Advanced)',
        description: 'Hollow body layout or 360-degree rotation full twist initiated at peak apex height.',
        coachTip: 'Wait until your hips reach the top before wrapping your twist.',
        mustHave: false
      }
    ]
  },
  {
    id: 'stunts',
    title: '2. Stunting & Body Positions',
    subtitle: 'Evaluated by position (Flyer, Main Base, Side Base, Backspot)',
    level: 'Required',
    items: [
      {
        name: 'Flyer: Extension to Liberty (Lib)',
        description: 'Drive weight straight up from prep, lock standing knee and hip, free leg tucked sharp at knee.',
        coachTip: 'Squeeze core and lock ankle straight. Trust your bases and pull up your own bodyweight.',
        mustHave: true
      },
      {
        name: 'Flyer: Heel Stretch & Arabesque Flexibility',
        description: 'Holding body line balance with pointed toes, squared shoulders, and sharp motion release.',
        coachTip: 'Flexibility must be matched by core strength. Squeeze your base leg quad tightly.',
        mustHave: true
      },
      {
        name: 'Bases: Extension Lockout & Pop Dismounts',
        description: 'Dip with legs, drive upward through heels, full arm lockout above shoulders, secure catch on cradle.',
        coachTip: 'Keep your eyes on the flyer’s feet. Never look down; catch high and absorb with your knees.',
        mustHave: true
      },
      {
        name: 'Backspots: Call Timing & Ankle Lock',
        description: 'Clear, loud 8-count vocal cadence, lifting weight off ankles, protecting head and neck on cradle.',
        coachTip: 'A vocal backspot who commands the stunt group stands out immediately at tryouts.',
        mustHave: true
      }
    ]
  },
  {
    id: 'jumps',
    title: '3. Jumps & Motions',
    subtitle: 'Sharp collegiate arm placement, jump height, and flexibility',
    level: 'Required',
    items: [
      {
        name: 'Toe Touch (Single & Double)',
        description: 'High chest, hyperextended knees, pointed toes rotated back with hips rolled under.',
        coachTip: 'Do not drop your chest forward to reach your toes. Bring your legs up to your hands.',
        mustHave: true
      },
      {
        name: 'Front Hurdler & Pike Jump',
        description: 'Left and right front hurdlers with straight lead leg; pike jump with parallel legs and flat back.',
        coachTip: 'Point your toes through the entire rotation and stick your landing with feet together.',
        mustHave: true
      },
      {
        name: 'Motion Sharpness & Levels',
        description: 'High V, Low V, T, Touchdown, Punch, and Clasp executed on exact 8-counts without broken wrists.',
        coachTip: 'Wrists flat, big knuckles facing the front. Make every motion snap on count.',
        mustHave: true
      }
    ]
  },
  {
    id: 'gameday',
    title: '4. Game Day & Fight Song',
    subtitle: 'Sideline energy, crowd engagement, voice projection, and Charger pride',
    level: 'Required',
    items: [
      {
        name: 'UNH Fight Song Routine',
        description: 'Traditional 32-count cheer routine performed at DellaCamera Stadium football and basketball games.',
        coachTip: 'Smile, sharp counts, and genuine collegiate athletic energy.',
        mustHave: true
      },
      {
        name: 'Vocal Projection & Sideline Chant',
        description: 'Deep diaphragm voice (not high pitched/screaming) calling chants with crowd responsiveness.',
        coachTip: 'Call counts loud from your stomach so 5,000 fans in the bleachers can chant with you.',
        mustHave: true
      }
    ]
  },
  {
    id: 'appearance',
    title: '5. Tryout Day Attire & Checklist',
    subtitle: 'Professional athletic presentation, attitude, and paperwork',
    level: 'Required',
    items: [
      {
        name: 'Official Tryout Uniform Attire',
        description: 'Solid Navy or Black athletic sports bra / tank, black fitted cheer spandex shorts, white cheer sneakers.',
        coachTip: 'Hair pulled back slick in a high ponytail with a clean ribbon/bow. Game-day clean athletic makeup.',
        mustHave: true
      },
      {
        name: 'Coachability & Positive Attitude',
        description: 'Ability to take corrections from Coach Alexis Vano immediately on the next repetition without frustration.',
        coachTip: 'We look for teammates who cheer each other on when someone lands a new flip.',
        mustHave: true
      },
      {
        name: 'Athletic Clearance & Academic Standing',
        description: 'Completed medical waiver, physical examination clearance, and minimum collegiate GPA standing.',
        coachTip: 'Bring printed athletic training clearance forms to registration on day one.',
        mustHave: true
      }
    ]
  }
];

export const TryoutCurriculum: React.FC<TryoutCurriculumProps> = ({ onSelectClip, clips }) => {
  const [activeCategory, setActiveCategory] = useState<string>('tumbling');
  
  // Interactive checklist state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('unh_cheer_tryout_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const toggleCheck = (itemKey: string) => {
    const updated = { ...checkedItems, [itemKey]: !checkedItems[itemKey] };
    setCheckedItems(updated);
    try {
      localStorage.setItem('unh_cheer_tryout_checklist', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate readiness score
  const allItems = CURRICULUM_DATA.flatMap(c => c.items);
  const totalCount = allItems.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const readinessPercent = Math.round((completedCount / totalCount) * 100);

  const currentCategory = CURRICULUM_DATA.find(c => c.id === activeCategory) || CURRICULUM_DATA[0];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-white border-l-4 border-[#002D62] p-5 rounded-md shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#002D62] bg-[#FFC72C] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Official Tryout Prep
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#002D62] uppercase tracking-wide">
                New Haven Chargers Cheerleading Curriculum
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Everything expected by Head Coach Alexis Vano for Varsity Cheer tryouts. Master these core tumbling skills, stunting mechanics, jumps, and game day chants so you arrive on the mats confident and ready.
            </p>
          </div>

          {/* Readiness Tracker Card */}
          <div className="bg-[#f0f4f9] border border-blue-200/80 p-3.5 rounded-md min-w-[240px] shrink-0">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold uppercase tracking-wider text-[#002D62] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#002D62]" />
                Tryout Readiness
              </span>
              <span className="font-black text-[#002D62] font-mono">
                {completedCount} / {totalCount} ({readinessPercent}%)
              </span>
            </div>
            
            {/* Progress Bar - No rounded pill, clean rectangle */}
            <div className="w-full h-2.5 bg-slate-200 rounded-xs overflow-hidden">
              <div 
                className="h-full bg-[#002D62] transition-all duration-300"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-500 mt-1.5">
              {readinessPercent >= 80 
                ? '⚡️ Coach Ready! You have mastered the core curriculum.' 
                : 'Check off skills below as you master them in practice.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Sidebar: Curriculum Sections (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white border border-slate-200 rounded-md p-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Curriculum Sections
            </h3>

            <div className="space-y-1">
              {CURRICULUM_DATA.map((cat) => {
                const isSelected = cat.id === activeCategory;
                const catItems = cat.items;
                const catDone = catItems.filter(item => checkedItems[`${cat.id}-${item.name}`]).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left p-2.5 rounded-sm text-xs font-bold transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#002D62] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{cat.title}</div>
                      <div className={`text-[10px] font-normal ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                        {catDone} of {catItems.length} skills ready
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#FFC72C]' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Coach Advice Card */}
          <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-[#002D62] uppercase tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#002D62]" />
              Coach Alexis Vano’s Advice
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              "At UNH Cheer tryouts, we value consistency and clean technique over reckless difficulty. A high, clean back tuck with a stuck landing will score higher than an under-rotated pass. Focus on tight form and bringing great energy to the gym!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#002D62]">
              <span className="font-semibold">Questions about tryouts?</span>
              <a 
                href="mailto:avano@newhaven.edu"
                className="underline hover:text-blue-900 font-bold"
              >
                avano@newhaven.edu
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Skill Cards & Interactive Checklist (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          
          {/* Section Header */}
          <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm border border-slate-200">
                {currentCategory.level} Curriculum
              </span>
              <h3 className="text-base font-black text-[#002D62] mt-1">
                {currentCategory.title}
              </h3>
              <p className="text-xs text-slate-500">
                {currentCategory.subtitle}
              </p>
            </div>
          </div>

          {/* Skill Cards List */}
          <div className="space-y-3">
            {currentCategory.items.map((item, idx) => {
              const itemKey = `${currentCategory.id}-${item.name}`;
              const isChecked = !!checkedItems[itemKey];

              return (
                <div 
                  key={idx}
                  className={`bg-white border rounded-md p-4 transition-all shadow-sm ${
                    isChecked 
                      ? 'border-emerald-300 bg-emerald-50/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleCheck(itemKey)}
                      className="mt-0.5 text-slate-400 hover:text-[#002D62] transition-colors shrink-0"
                      title={isChecked ? "Mark as not ready" : "Mark as mastered"}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Skill Details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                          {item.name}
                        </h4>
                        {item.mustHave ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-red-100 text-red-800 rounded-sm">
                            Required Standard
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-sm">
                            Bonus Difficulty
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Coach Tip Box */}
                      <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-sm text-xs text-slate-700 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#002D62] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#002D62]">Execution Tip: </span>
                          <span>{item.coachTip}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
