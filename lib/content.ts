/**
 * Central content module for ThunderHacks II (Fall 2026).
 * Every page reads from here so there is one source of truth for copy,
 * figures and dates. Copy uses commas, periods and hyphen ranges only.
 */

export const EVENT = {
  name: "ThunderHacks II",
  edition: "II",
  presentedBy: "Powered by OLG",
  subtitle: "Algoma University's flagship hackathon",
  tagline: "Two campuses. One competition.",
  datesLabel: "October 14-16, 2026",
  hoursLabel: "Daytime format, venue closes each evening after dinner",
  /** Countdown target: Oct 14, 2026, 2:00 PM ET (EDT, UTC-4). */
  startsAtISO: "2026-10-14T14:00:00-04:00",
  countdownLabel: "Ready to bring the thunder in",
  registerUrl: "https://thunderhacks.devpost.com",
  registrationOpensLabel: "Registration is open",
  campuses: [
    {
      key: "brampton",
      name: "Brampton",
      full: "Brampton Campus",
      region: "Greater Toronto Area",
      blurb:
        "The GTA campus, and where the first ThunderHacks ran in March 2026.",
    },
    {
      key: "sault",
      name: "Sault Ste. Marie",
      full: "Sault Ste. Marie Campus",
      region: "Northern Ontario",
      blurb:
        "Algoma's home campus, open to Algoma and Sault College students.",
    },
  ],
  metaTitle: "ThunderHacks II | October 14-16, 2026 | Algoma University",
  metaDescription:
    "ThunderHacks II is Algoma University's flagship hackathon, running October 14-16, 2026 on two campuses at once: Brampton and Sault Ste. Marie. Powered by OLG.",
} as const

/** Single-page sections, in document order. The nav and the scroll spy both read this. */
export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "prizes", label: "Prizes" },
  { id: "sponsors", label: "Sponsors" },
  { id: "event", label: "Event" },
  { id: "faq", label: "FAQ" },
] as const

/**
 * Photos from the first ThunderHacks. Drop files in /public/images/recap and add
 * them here. Until then each entry renders as a sized slot so the layout does
 * not move when the real images land.
 */
export type Photo = { src: string; alt: string; wide?: boolean }

/** Photos from the first ThunderHacks, March 2026, Brampton. */
export const RECAP_PHOTOS: Photo[] = [
  {
    src: "/images/recap/th1-winners.jpg",
    alt: "A winning team holding an oversized prize cheque in front of the hackathon winners screen at ThunderHacks, March 2026",
    wide: true,
  },
  {
    src: "/images/recap/th1-team.jpg",
    alt: "The ALCOMS organising team with faculty in front of the sponsor thank-you screen at ThunderHacks, March 2026",
  },
  {
    src: "/images/recap/th1-presenting.jpg",
    alt: "Three hackers presenting their project at the podium at ThunderHacks, March 2026",
  },
  {
    src: "/images/recap/th1-judging.jpg",
    alt: "A team pitching to the judging panel at ThunderHacks, March 2026",
  },
  {
    src: "/images/recap/th1-vr.jpg",
    alt: "A participant trying a VR headset at ThunderHacks, March 2026",
  },
]

export const TICKER = [
  "October 14-16, 2026",
  "$5,000 in prizes",
  "Brampton and Sault Ste. Marie",
  "Powered by OLG",
  "Free entry, food and wifi",
  "Teams up to four",
  "Registration is open",
] as const

export const ABOUT = {
  heading: "One competition, running in two places",
  intro:
    "ThunderHacks II is the second edition of Algoma University's flagship hackathon. The first ran on one campus. This one runs across two at the same time, with judging combined into a single competition so every team is measured against the same bar.",
  blocks: [
    {
      title: "Who can enter",
      body: "Algoma University students at both campuses, plus Sault College students at the Sault Ste. Marie campus.",
    },
    {
      title: "How it runs",
      body: "Three days, daytime hours. Build during the day, go home at night, come back sharp. The venue closes each evening after dinner.",
    },
    {
      title: "How big",
      body: "We are planning for 50 to 60 hackers across the two campuses.",
    },
    {
      title: "How it is judged",
      body: "Both campuses stream to each other, and submissions are judged together on the final day by one panel.",
    },
  ],
} as const

export const RECAP = {
  heading: "Where it started",
  subheading: "The first ThunderHacks, March 2026, Brampton",
  intro:
    "Thirty-six people, twelve teams, three days, one campus. ThunderHacks II is built on what that weekend proved.",
  stats: [
    { value: "36", label: "Hackers" },
    { value: "12", label: "Teams" },
    { value: "3", label: "Days" },
    { value: "1", label: "Campus" },
  ],
  winners: [
    {
      place: "1st",
      members: ["Bidhan Thapa", "Harris Adedeji", "Pratikshya Thapa", "Vikas Saahil"],
    },
    { place: "2nd", members: ["Joel Saji Varghese", "Niya Jose"] },
    {
      place: "3rd",
      members: ["Masir Javed", "Raafay Sheikh", "Tarang Rana", "Rachit Ranabhat"],
    },
  ],
  pastSponsors: ["Shield Identity", "Digital Move", "Food Quotient"],
} as const

export const PRIZES = {
  heading: "Prizes",
  poolLabel: "$5,000 total",
  intro:
    "Three overall placements, a prize on each sponsored challenge track, and a prize for the game jam.",
  main: [
    {
      place: "1st",
      amount: "$1,750",
      description: "Best project overall, judged across both campuses.",
    },
    {
      place: "2nd",
      amount: "$750",
      description: "Runner-up.",
    },
    {
      place: "3rd",
      amount: "$500",
      description: "Third place.",
    },
  ],
  sponsorTrack: [
    {
      tier: "Gold track",
      sponsor: "OLG",
      amount: "$1,000",
      description: "Awarded to the best submission against OLG's challenge.",
    },
    {
      tier: "Silver track",
      sponsor: "Canadian Bank Note",
      amount: "$500",
      description:
        "Awarded to the best submission against the Canadian Bank Note challenge.",
    },
  ],
  gameJam: {
    heading: "Game jam",
    tier: "Algoma game jam",
    amount: "$500",
    description: "Awarded to the winners of the Algoma game jam.",
  },
} as const

export type Sponsor = {
  name: string
  tier: "Gold" | "Silver" | "Bronze"
  tierLabel: string
  logo: string | null
  /**
   * True when the supplied asset is the reverse (white) version of the mark.
   * Those sit directly on the dark page. Everything else gets a white plate,
   * because these are the standard positive logos and recolouring a sponsor's
   * mark is not ours to do.
   */
  onDark?: boolean
  blurb: string
  url?: string
}

export const SPONSORS: Sponsor[] = [
  {
    name: "OLG",
    tier: "Gold",
    tierLabel: "Gold, title sponsor",
    logo: "/images/sponsors/olg.png",
    onDark: true,
    url: "https://about.olg.ca/",
    blurb:
      "Title sponsor of ThunderHacks II, setting a challenge track and joining the judging panel.",
  },
  {
    name: "Canadian Bank Note",
    tier: "Silver",
    tierLabel: "Silver",
    logo: "/images/sponsors/cbn.png",
    url: "https://www.cbnco.com/",
    blurb:
      "Silver sponsor, running a challenge track, a workshop, and sitting on the judging panel.",
  },
  {
    name: "Pollard Banknote",
    tier: "Bronze",
    tierLabel: "Bronze",
    logo: "/images/sponsors/pollard.png",
    url: "https://www.pollardbanknote.com/",
    blurb: "Bronze sponsor.",
  },
  {
    name: "Gateway Casinos",
    tier: "Bronze",
    tierLabel: "Bronze",
    logo: "/images/sponsors/gateway.png",
    url: "https://www.gatewaycasinos.com/",
    blurb: "Bronze sponsor.",
  },
  {
    name: "Algoma University",
    tier: "Bronze",
    tierLabel: "Bronze",
    logo: "/images/sponsors/algoma-cst.png",
    url: "https://algomau.ca/",
    blurb:
      "Bronze sponsor, through the Faculty of Computer Science and Technology, which also backs the game jam prize.",
  },
  {
    name: "Digital Move",
    tier: "Bronze",
    tierLabel: "Bronze",
    logo: "/images/sponsors/digital-move.png",
    url: "https://digital-move.com/",
    blurb: "Bronze sponsor.",
  },
  {
    name: "Shield Identity",
    tier: "Bronze",
    tierLabel: "Bronze",
    logo: "/images/sponsors/shield-identity.png",
    url: "https://shield-identity.com/",
    blurb: "Bronze sponsor.",
  },
]

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
      "Logo on the event website and registration page",
      "Logo on event shirts and printed materials",
      "Logo on screens at both campuses during the event",
      "Named in the opening and closing ceremonies",
      "Thank-you posts on ALCOMS social media",
      "Option to hand out swag to participants",
    ],
  },
  {
    name: "Silver",
    price: "$2,000",
    inherits: "Everything in Bronze, plus",
    benefits: [
      "Your own challenge track with a named prize category",
      "$500 track prize awarded in your name",
      "A seat on the judging panel for your track",
      "Host a workshop at one campus, streamed to the other",
      "Access to the participant resume book, opt-in",
      "Larger logo placement across all materials",
    ],
  },
  {
    name: "Gold",
    price: "$3,000",
    highlight: "Title sponsor",
    featured: true,
    inherits: "Everything in Silver, plus",
    benefits: [
      "First pick of challenge theme",
      "$1,000 track prize awarded in your name",
      "Event co-branding as the title sponsor",
      "Speaking slot at the opening ceremony, broadcast to both campuses",
      "A recruiting table at both campuses",
      "Top logo placement on the site, materials and stage backdrop",
      "Priority access to the participant resume book",
      "First refusal on title sponsorship of the next edition",
    ],
  },
]

export const SPONSOR_NOTE =
  "Multiple sponsors are welcome at each tier. Custom and in-kind sponsorship is also available."

export type ScheduleItem = { time: string; title: string; detail?: string }
export type ScheduleDay = {
  key: string
  date: string
  weekday: string
  label: string
  items: ScheduleItem[]
}

export const SCHEDULE_NOTE =
  "This is the preliminary plan. Exact times are still being confirmed and will be posted here before the event."

export const SCHEDULE: ScheduleDay[] = [
  {
    key: "day-1",
    date: "October 14",
    weekday: "Wednesday",
    label: "Opening",
    items: [
      { time: "4:00 PM", title: "Opening ceremony", detail: "Broadcast to both campuses." },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Hacking begins" },
    ],
  },
  {
    key: "day-2",
    date: "October 15",
    weekday: "Thursday",
    label: "Build day",
    items: [
      { time: "Morning", title: "Breakfast" },
      { time: "Morning", title: "Workshop one" },
      { time: "Midday", title: "Lunch" },
      { time: "Afternoon", title: "Workshop two" },
      { time: "Afternoon", title: "Gaming competition" },
      { time: "Evening", title: "Dinner" },
    ],
  },
  {
    key: "day-3",
    date: "October 16",
    weekday: "Friday",
    label: "Judging",
    items: [
      { time: "Morning", title: "Breakfast" },
      { time: "Morning", title: "Submissions close" },
      { time: "Midday", title: "Presentations and judging", detail: "One panel, both campuses." },
      { time: "Afternoon", title: "Closing ceremony and prizes" },
      { time: "Afternoon", title: "Lunch" },
    ],
  },
]

export type Faq = { q: string; a: string }

export const FAQS: Faq[] = [
  {
    q: "Who can take part?",
    a: "Algoma University students at either campus, and Sault College students at the Sault Ste. Marie campus. Every skill level is welcome, including people who have never been to a hackathon.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Entry, food and wifi are all covered.",
  },
  {
    q: "Do I need a team?",
    a: "No. Come on your own and we will help you find a team at the opening ceremony, or bring up to three others and enter together.",
  },
  {
    q: "How big can a team be?",
    a: "Up to four people. Teams have to be from the same campus.",
  },
  {
    q: "Is food provided?",
    a: "Yes. Dinner on the first day, breakfast, lunch and dinner on the second, breakfast and lunch on the third.",
  },
  {
    q: "Is there wifi?",
    a: "Yes, on both campuses, for the whole event.",
  },
  {
    q: "Do I have to stay overnight?",
    a: "No. This is a daytime event. The venue closes each evening after dinner and opens again the next morning.",
  },
  {
    q: "What should I bring?",
    a: "Your laptop and charger, student ID, headphones, a water bottle, and anything you need to be comfortable for a long day. Bring the vibes.",
  },
  {
    q: "Can I start building before the event?",
    a: "No. Everything you submit has to be built during the event. Open-source libraries, frameworks and public APIs are all fine.",
  },
  {
    q: "How is it judged?",
    a: "Submissions from both campuses go to one panel on the final day. Sponsored challenge tracks are judged by that sponsor alongside the overall placements.",
  },
  {
    q: "What if I am at the other campus?",
    a: "Both campuses run the same schedule and stream to each other, so opening, workshops and closing are shared. You compete against everyone, not just your own campus.",
  },
  {
    q: "How do I sign up?",
    a: "Register on this site, then create a team or join one from your dashboard. You can also register alone and find a team later.",
  },
]

export const CONTACT = {
  org: "ALCOMS",
  orgFull: "Algoma University Computer Science Society",
  email: "alcoms@algomau.ca",
  linkedin: "https://www.linkedin.com/company/alcom-au",
  website: "https://alcoms.ca",
} as const
