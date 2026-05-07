import {
  ArchiveXIcon,
  BellRingIcon,
  CheckCircle2Icon,
  InboxIcon,
  PhoneCallIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react"

export const leadInboxUser = {
  name: "Pejman A",
  email: "pej.afra1987@gmail.com",
  avatar: "/brand/reala.png",
}

export const leadInboxNav = [
  {
    title: "New Leads",
    icon: <InboxIcon />,
    count: 18,
  },
  {
    title: "Call Queue",
    icon: <PhoneCallIcon />,
    count: 7,
  },
  {
    title: "Follow-ups",
    icon: <BellRingIcon />,
    count: 12,
  },
  {
    title: "Qualified",
    icon: <CheckCircle2Icon />,
    count: 24,
  },
  {
    title: "Sent",
    icon: <SendIcon />,
    count: 9,
  },
  {
    title: "Archived",
    icon: <ArchiveXIcon />,
    count: 41,
  },
  {
    title: "Trash",
    icon: <Trash2Icon />,
    count: 3,
  },
]

export const leadInboxLeads = [
  {
    name: "Maya Collins",
    source: "Website valuation form",
    subject: "Seller lead - Kitsilano townhouse",
    time: "09:34 AM",
    teaser:
      "Asked for a pricing opinion and a callback after 2 PM. Mentions they are comparing agents this week.",
    status: "Hot",
  },
  {
    name: "Daniel Reza",
    source: "Missed call",
    subject: "Buyer inquiry - Mount Pleasant condo",
    time: "10:12 AM",
    teaser:
      "Left voicemail about two active listings and wants strata docs before booking a showing.",
    status: "Call",
  },
  {
    name: "Sarah Nguyen",
    source: "Instagram DM",
    subject: "Relocation intake - North Vancouver",
    time: "Yesterday",
    teaser:
      "Moving from Toronto in June. Budget is flexible if school catchment and commute fit.",
    status: "New",
  },
  {
    name: "Oliver Brooks",
    source: "Open house scan",
    subject: "Follow-up - 188 Keefer Place",
    time: "Yesterday",
    teaser:
      "Liked the floor plan, hesitated on parking. Needs lender intro and next showing slots.",
    status: "Follow-up",
  },
  {
    name: "Priya Shah",
    source: "Agent referral",
    subject: "Pre-listing - Burnaby duplex",
    time: "Mon",
    teaser:
      "Referral says the client expects a premium photo and video package before launch.",
    status: "Qualified",
  },
  {
    name: "Anthony Miller",
    source: "Portal lead",
    subject: "Buyer lead - Downtown one-bedroom",
    time: "Mon",
    teaser:
      "Downloaded buyer guide and clicked three listing alerts in the last hour.",
    status: "Hot",
  },
]

export const leadInboxSummary = [
  ["Unassigned leads", "18"],
  ["Calls due today", "7"],
  ["Median first response", "4m"],
  ["Qualified this week", "24"],
] as const

export const selectedLead = {
  name: "Maya Collins",
  type: "Seller lead",
  address: "Kitsilano townhouse - Vancouver, BC",
  phone: "(604) 555-0148",
  email: "maya.collins@example.com",
  nextStep: "Call after 2 PM, then send valuation prep checklist.",
  timeline: [
    ["09:34 AM", "Submitted valuation request from website"],
    ["09:35 AM", "Auto-reply sent with seller guide"],
    ["09:41 AM", "Matched to Kitsilano farming campaign"],
    ["10:02 AM", "Assigned to operations call queue"],
  ],
} as const

export const selectedLeadMessages = [
  {
    author: "lead",
    name: "Maya Collins",
    body: "Hi, I filled out the valuation form. We are starting to compare agents and want a realistic number before we decide whether to list this spring.",
    time: "09:34 AM",
  },
  {
    author: "alex",
    name: "Alex AI",
    body: "Thanks Maya. I can help prep the estimate. Are there any major upgrades since 2021, and would you prefer a quick call after 2 PM today?",
    time: "09:35 AM",
  },
  {
    author: "lead",
    name: "Maya Collins",
    body: "After 2 PM works. Kitchen was redone last year, and we added a small office downstairs.",
    time: "09:41 AM",
  },
  {
    author: "agent",
    name: "You",
    body: "Great, I will call after 2 PM and send a short prep checklist before we talk.",
    time: "10:02 AM",
  },
] as const

export const selectedLeadSuggestions = [
  "Send valuation prep checklist",
  "Ask about ideal listing date",
  "Schedule 15-minute call",
] as const
