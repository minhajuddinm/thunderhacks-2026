/**
 * Central content module for ThunderHacks II (Fall 2026).
 * All user-facing marketing copy lives here so every section renders one source of truth.
 * Copy avoids decorative em-dashes per brand guidelines (commas/periods/hyphen ranges only).
 */

export const EVENT = {
  name: "ThunderHacks II",
  subtitle: "Algoma University's Flagship Hackathon, Fall 2026 Edition",
  tagline: "3 Days. 2 Campuses. 1 Competition.",
  datesLabel: "October 14-16, 2026",
  hoursLabel: "9:00 AM to 8:00 PM daily",
  /** Countdown target: Oct 14, 2026, 9:00 AM ET (EDT, UTC-4). */
  startsAtISO: "2026-10-14T09:00:00-04:00",
  registerUrl: "https://thunderhacks.devpost.com",
  campuses: [
    { name: "Brampton Campus", region: "GTA" },
    { name: "Sault Ste. Marie Campus", region: "Northern Ontario" },
  ],
  metaTitle: "ThunderHacks II | Fall 2026 | Algoma University Hackathon",
  metaDescription:
    "ThunderHacks II is Algoma University's flagship hackathon, running October 14-16, 2026 across two campuses: Brampton (GTA) and Sault Ste. Marie (Northern Ontario). 3 Days. 2 Campuses. 1 Competition.",
} as const

export const ABOUT = {
  heading: "The Second Edition, Scaled Up",
  intro:
    "ThunderHacks II is the bigger, bolder second edition of Algoma University's flagship hackathon. What began as a single-campus, single-day competition returns as a three-day event running simultaneously across two campuses.",
  blocks: [
    {
      title: "Open Across Two Campuses",
      body: "Open to Algoma University students at both the Brampton and Sault Ste. Marie campuses, plus Sault College students at the Sault Ste. Marie campus.",
    },
    {
      title: "A Three-Day Daytime Format",
      body: "A three-day daytime hackathon running 9:00 AM to 8:00 PM each day. Build during the day, rest at night, and come back sharp.",
    },
    {
      title: "Built for 50 to 60 Hackers",
      body: "We are projecting 50 to 60 participants across both campuses, bringing together builders from Northern Ontario and the GTA.",
    },
    {
      title: "One Unified Competition",
      body: "Judging is combined across both campuses into one unified competition, with virtual coordination on the final day so every team competes on equal footing.",
    },
  ],
} as const

export const RECAP = {
  heading: "Where It All Started",
  subheading: "The Inaugural ThunderHacks, March 2026",
  intro:
    "The first ThunderHacks brought 36 participants across 12 teams together for a single-day competition at our Brampton campus. It set the standard we are building on this fall.",
  stats: [
    { value: "36", label: "Participants" },
    { value: "12", label: "Teams" },
    { value: "1", label: "Day" },
    { value: "Brampton", label: "Campus" },
  ],
  winners: [
    {
      place: "1st Place",
      members: ["Bidhan Thapa", "Harris Adedeji", "Pratikshya Thapa", "Vikas Saahil"],
    },
    {
      place: "2nd Place",
      members: ["Joel Saji Varghese", "Niya Jose"],
    },
    {
      place: "3rd Place",
      members: ["Masir Javed", "Raafay Sheikh", "Tarang Rana", "Rachit Ranabhat"],
    },
  ],
  pastSponsors: [
    { name: "Shield Identity" },
    { name: "Digital Move" },
    { name: "Food Quotient" },
  ],
} as const

export const PRIZES = {
  poolLabel: "$3,000 in main prizes, plus additional sponsor track prizes",
  main: [
    { place: "1st Place", amount: "$1,250", description: "Grand prize for the best project overall." },
    { place: "2nd Place", amount: "$1,000", description: "Runner-up for outstanding innovation." },
    { place: "3rd Place", amount: "$750", description: "Third place for exceptional work." },
  ],
  sponsorTrack: [
    {
      tier: "Gold Sponsor Track",
      amount: "$750",
      description: "Awarded to the winner of each Gold-sponsored problem statement.",
    },
    {
      tier: "Silver Sponsor Track",
      amount: "$500",
      description: "Awarded to the winner of each Silver-sponsored problem statement.",
    },
  ],
} as const

export type SponsorTier = {
  name: string
  price: string
  highlight?: string
  featured?: boolean
  inherits?: string
  benefits: string[]
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: "Bronze",
    price: "$1,000",
    benefits: [
      "Logo on event website and registration page",
      "Logo on event T-shirts and printed materials",
      "Logo on screens at both campuses during the event",
      "Recognition in opening and closing ceremonies",
      "Thank-you posts on ALCOMS social media (Instagram, LinkedIn)",
      "Option to distribute swag to participants",
    ],
  },
  {
    name: "Silver",
    price: "$2,000",
    inherits: "Everything in Bronze, plus",
    benefits: [
      "Sponsored problem statement (dedicated challenge track, named prize category)",
      "$500 sponsor track prize awarded in your name",
      "Seat on the combined judging panel for your track",
      "Host a workshop or tech talk (in person at one campus, streamed to the other)",
      "Access to participant resume book (opt-in)",
      "Larger logo placement across all materials",
      "Verbal recognition at ceremonies at both campuses",
    ],
  },
  {
    name: "Gold",
    price: "$3,000",
    highlight: "Title Sponsor",
    featured: true,
    inherits: "Everything in Silver, plus",
    benefits: [
      "First pick of problem statement theme",
      "$750 sponsor track prize awarded in your name",
      'Event co-branding: "ThunderHacks II, presented in partnership with [Your Company]"',
      "Speaking slot at opening ceremony (broadcast to both campuses)",
      "Recruiting table at both campuses",
      "Top logo placement on website header, materials, and stage backdrop",
      "Priority access to participant resume book",
      "Sponsor spotlight post and feature in post-event recap",
      "Priority consideration for title sponsorship of the next edition",
    ],
  },
]

export const SPONSOR_NOTE =
  "Multiple sponsors welcome at each tier. Custom and in-kind sponsorship also available."

export const CONTACT = {
  org: "ALCOMS",
  orgFull: "Algoma University Computer Science Society",
  email: "alcoms@algomau.ca",
  linkedin: "https://www.linkedin.com/company/alcom-au",
  website: "https://alcoms.ca",
} as const
