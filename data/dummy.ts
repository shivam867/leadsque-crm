// ================================================================
// LEADFLOW CRM — DUMMY DATA (IAS Coaching Academy Edition)
// ================================================================

export type LeadStatus = "New"|"Contacted"|"Interested"|"Follow-up"|"Qualified"|"Won"|"Lost"|"Spam";
export type LeadScore  = "Hot"|"Medium"|"Cold";
export interface ConversationMessage {
  sender: "rep" | "client";
  name: string;
  time: string;
  text: string;
}

export interface ActivityItem {
  time: string;
  type: "call"|"note"|"status"|"followup"|"email";
  text: string;
}

export interface AISummary {
  sentiment: "Positive"|"Neutral"|"Negative";
  intent: string;
  nextAction: string;
  bestTimeToCall: string;
  dealProbability: number;
  keyPoints: string[];
  summary: string;
  languagePreference: string;
  competitorIntel: string;
  handlingObjections:string;
  suggestedOpeningLine:string;

}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  service: string;
  status: LeadStatus;
  score: LeadScore;
  assignedTo: string;
  city: string;
  priority: "High"|"Medium"|"Low";
  createdAt: string;
  followUpDate: string;
  notes: string;
  activity: ActivityItem[];
  conversation: ConversationMessage[];
  aiSummary: AISummary;
}

export interface SalesRep {
  id: string; name: string; avatar: string;
  role: "rep"|"manager"|"director"; team: string;
  leadsAssigned: number; callsToday: number;
  conversionRate: number; wonThisMonth: number;
}

// ── SALES REPS ──────────────────────────────────────────────────
export const salesReps: SalesRep[] = [
  { id:"rep-1", name:"Aanya Sharma",  avatar:"AS", role:"rep", team:"Alpha", leadsAssigned:28, callsToday:18, conversionRate:34, wonThisMonth:8  },
  { id:"rep-2", name:"Rohan Mehta",   avatar:"RM", role:"rep", team:"Alpha", leadsAssigned:31, callsToday:22, conversionRate:28, wonThisMonth:9  },
  { id:"rep-3", name:"Priya Nair",    avatar:"PN", role:"rep", team:"Beta",  leadsAssigned:19, callsToday:14, conversionRate:41, wonThisMonth:8  },
  { id:"rep-4", name:"Kabir Singh",   avatar:"KS", role:"rep", team:"Beta",  leadsAssigned:27, callsToday:20, conversionRate:22, wonThisMonth:6  },
  { id:"rep-5", name:"Meera Iyer",    avatar:"MI", role:"rep", team:"Gamma", leadsAssigned:22, callsToday:16, conversionRate:36, wonThisMonth:8  },
  { id:"rep-6", name:"Aryan Gupta",   avatar:"AG", role:"rep", team:"Alpha", leadsAssigned:18, callsToday:12, conversionRate:31, wonThisMonth:6  },
  { id:"rep-7", name:"Divya Reddy",   avatar:"DR", role:"rep", team:"Gamma", leadsAssigned:21, callsToday:15, conversionRate:38, wonThisMonth:7  },
];

export const managers: SalesRep[] = [
  { id:"mgr-1", name:"Vikram Bose",  avatar:"VB", role:"manager", team:"Alpha", leadsAssigned:73, callsToday:52, conversionRate:31, wonThisMonth:23 },
  { id:"mgr-2", name:"Sunita Rao",   avatar:"SR", role:"manager", team:"Beta",  leadsAssigned:46, callsToday:34, conversionRate:33, wonThisMonth:14 },
  { id:"mgr-3", name:"Amit Khanna",  avatar:"AK", role:"manager", team:"Gamma", leadsAssigned:43, callsToday:31, conversionRate:37, wonThisMonth:15 },
];

// ── LEADS ────────────────────────────────────────────────────────
export const leads: Lead[] = [
  // ── L-1001 — Deepak Verma ──
  {
    id:"L-1001", name:"Deepak Verma", phone:"+91 98100 11234",
    email:"deepak.verma@gmail.com", source:"Website", service:"Prelims Pro Batch",
    status:"Interested", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Delhi", priority:"High", createdAt:"2025-05-20", followUpDate:"2025-05-28",
    notes:"Very interested in Prelims Pro Batch. Appeared in UPSC 2024, scored well in GS but weak in CSAT. Offer early bird discount on follow-up. Working professional, prefers evening batches.",
    activity:[
      { time:"10:30 AM · 20 May", type:"call",     text:"First call placed — student answered on 2nd ring" },
      { time:"10:35 AM · 20 May", type:"note",     text:"Interested in Prelims batch, asked about evening timings and study material" },
      { time:"10:40 AM · 20 May", type:"status",   text:"Status updated: New → Interested" },
      { time:"11:00 AM · 22 May", type:"call",     text:"Follow-up call — discussed fee structure, slight hesitation on budget" },
      { time:"11:15 AM · 22 May", type:"note",     text:"Sent brochure and fee structure on WhatsApp" },
      { time:"9:00 AM  · 25 May", type:"followup", text:"Reminder set: call back with early bird discount offer" },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya", time:"10:30 AM", text:"Hello Deepak ji, main Aanya bol rahi hoon Pinnacle IAS se. Aapne humare website pe enquiry form bhara tha — kya abhi 5 minute baat kar sakte hain?" },
      { sender:"client", name:"Deepak", time:"10:31 AM", text:"Haan haan, bolo. Maine kal website dekhi thi, kaafi accha laga course structure." },
      { sender:"rep",    name:"Aanya", time:"10:31 AM", text:"Great! Toh Deepak ji, aap UPSC ki preparation kar rahe hain? Kaunsa attempt hoga aapka?" },
      { sender:"client", name:"Deepak", time:"10:32 AM", text:"Yeh second attempt hoga. 2024 mein Prelims clear hua tha lekin Mains mein nahi gaya. GS theek tha, optional mein thoda kamzor raha." },
      { sender:"rep",    name:"Aanya", time:"10:33 AM", text:"Bilkul samajh aata hai! Aur working professional bhi hain kya? Evening batch consider kar rahe hain?" },
      { sender:"client", name:"Deepak", time:"10:34 AM", text:"Haan, IT mein job hai. Evening 6-9 ya weekend batch perfect rahega." },
      { sender:"rep",    name:"Aanya", time:"10:35 AM", text:"Perfect! Humara Prelims Pro Batch weekdays 7-9 PM aur Saturday test series hai. Fee ₹45,000 for full year with printed notes, mock tests, sab kuch." },
      { sender:"client", name:"Deepak", time:"10:36 AM", text:"Hmmm, thoda soch ke batata hoon. Budget abhi thoda tight hai." },
      { sender:"rep",    name:"Aanya", time:"10:37 AM", text:"Koi baat nahi, I understand. Main brochure aur fee structure WhatsApp karta hoon. Friday ko call karein — early bird discount bhi discuss kar sakte hain." },
      { sender:"client", name:"Deepak", time:"10:37 AM", text:"Theek hai, Friday 11 baje ke baad call karo." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Second attempt aspirant — needs Prelims coaching with evening timing",
      nextAction:"Call Friday 11 AM with early bird discount. Highlight evening batch and test series.",
      bestTimeToCall:"Friday 11:00 AM – 1:00 PM",
      dealProbability:72,
      keyPoints:[
        "2nd attempt — Prelims cleared in 2024, Mains was the gap",
        "Working professional — needs evening/weekend batch",
        "Budget concern is seasonal, not structural",
        "Decision maker himself — no parental approval needed",
      ],
      summary:"Deepak is a warm lead with a clear need. He's a working professional on his second UPSC attempt. Budget concern is temporary. High close probability if contacted Friday with a discount offer.",
      languagePreference:"Hindi-English (comfortable with both, casual code-switching)",
      competitorIntel:"No competitor named directly. As an IT professional he has likely browsed StudyIQ and Unacademy online — stress our structured offline-style evening batch and personal faculty access over app-based learning.",
      handlingObjections:"If budget objection: offer early-bird discount + 2-installment split. If time concern: emphasise 7-9 PM slot + recorded backup sessions so no class is ever missed.",
      suggestedOpeningLine:"Deepak ji, Aanya here from Pinnacle — just calling with the early-bird offer I promised. Five minutes to lock in your evening-batch seat?",
    },
  },

  // ── L-1002 — Sneha Kulkarni ──
  {
    id:"L-1002", name:"Sneha Kulkarni", phone:"+91 99200 22345",
    email:"sneha.k@outlook.com", source:"Referral", service:"UPSC Full Course",
    status:"Qualified", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Mumbai", priority:"High", createdAt:"2025-05-19", followUpDate:"2025-05-27",
    notes:"Fresh graduate, full-time aspirant. Parent referred — father is a retired IPS officer. Interested in UPSC Full Course with Optional subject (Sociology). Needs hostel accommodation info.",
    activity:[
      { time:"9:00 AM · 19 May", type:"call",   text:"Introductory call — very focused, asked detailed curriculum questions" },
      { time:"9:45 AM · 19 May", type:"status", text:"Status: Contacted → Qualified" },
      { time:"2:00 PM · 21 May", type:"email",  text:"Sent full course brochure and faculty profiles" },
      { time:"4:30 PM · 23 May", type:"call",   text:"30-min call — discussed Sociology optional, faculty, test series schedule" },
      { time:"5:00 PM · 23 May", type:"note",   text:"Father will also join next call. Hostel list sent separately." },
    ],
    conversation:[
      { sender:"rep",    name:"Rohan", time:"9:00 AM", text:"Good morning Sneha ji! Main Rohan Mehta bol raha hoon Pinnacle IAS se. Uncle ji ne aapka reference diya tha — aap UPSC full-time preparation kar rahi hain?" },
      { sender:"client", name:"Sneha", time:"9:01 AM", text:"Yes Rohan, I was expecting your call. Papa ne bataya tha. I've just completed my graduation and want to go full-time for UPSC." },
      { sender:"rep",    name:"Rohan", time:"9:02 AM", text:"Perfect! Optional subject kya soch rahi hain? Aur Delhi shift karoge ya Mumbai se online?" },
      { sender:"client", name:"Sneha", time:"9:03 AM", text:"Sociology optional lena chahti hoon. Delhi shift karna padega — so hostel options bhi chahiye. Is that something you can help with?" },
      { sender:"rep",    name:"Rohan", time:"9:05 AM", text:"Haan bilkul! Hum partner hostels ki list dete hain. Aur humari Sociology faculty — Dr. Preeti Sinha — IFS topper rahi hain, bahut accha padhati hain." },
      { sender:"client", name:"Sneha", time:"9:06 AM", text:"That's encouraging. Papa bhi ek baar baat karna chahenge before we finalize." },
      { sender:"rep",    name:"Rohan", time:"9:07 AM", text:"Bilkul, please! Weekend call schedule karte hain jisme uncle ji bhi join kar sakein." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Full-time UPSC aspirant — Sociology optional, Delhi relocation",
      nextAction:"Schedule call with father over the weekend. Send hostel partner list.",
      bestTimeToCall:"Weekdays 9:00 AM – 11:00 AM",
      dealProbability:85,
      keyPoints:[
        "Fresh graduate — full-time aspirant, high commitment",
        "Father (retired IPS) is co-decision maker — schedule joint call",
        "Sociology optional — strong match with our faculty",
        "Hostel information sent — reducing friction",
      ],
      summary:"Sneha is essentially a closed deal pending parent approval. Father is a retired IPS officer — this is a high-trust referral. Joint call with father is the only remaining step.",
      languagePreference:"English-Hindi (prefers English, switches to Hindi for comfort with family topics)",
      competitorIntel:"Father is a retired IPS officer — he may compare us against established names like Vajiram or Drishti. Lead with Dr. Preeti Sinha's credentials and our Sociology result track record. Avoid discounting — it signals lower quality to this profile.",
      handlingObjections:"If father questions faculty credibility: share Dr. Sinha's rank list and published results. If Delhi safety or hostel quality is raised: offer a virtual hostel tour link. If fee is questioned: emphasise structured mentorship unavailable at app-based platforms.",
      suggestedOpeningLine:"Good morning Sneha! Rohan here — I've blocked a slot this weekend for a call with you and uncle ji. Shall I send a calendar invite for Saturday 11 AM?",
    },
  },

  // ── L-1003 — Arjun Pillai ──
  {
    id:"L-1003", name:"Arjun Pillai", phone:"+91 97300 33456",
    email:"arjun.pillai@yahoo.com", source:"Cold Call", service:"State PCS Batch",
    status:"Follow-up", score:"Medium", assignedTo:"Aanya Sharma",
    city:"Kochi", priority:"Medium", createdAt:"2025-05-18", followUpDate:"2025-05-29",
    notes:"Kerala PSC aspirant. Interested in State PCS batch but needs online mode as he's in Kochi. Also wants to check if Hindi medium is available. Budget: ₹20,000-25,000 max.",
    activity:[
      { time:"3:00 PM · 18 May", type:"call",     text:"Cold call answered — showed initial interest in online PCS batch" },
      { time:"3:15 PM · 18 May", type:"note",     text:"Needs online mode, budget ₹20-25k, Hindi/Malayalam medium preferred" },
      { time:"3:20 PM · 18 May", type:"status",   text:"Status: Contacted → Follow-up" },
      { time:"10:00 AM · 24 May", type:"call",    text:"Follow-up call — asked about live classes vs recorded" },
      { time:"10:30 AM · 24 May", type:"followup",text:"Reminder: call back May 29 with online batch demo link" },
    ],
    conversation:[
      { sender:"rep",    name:"Priya",  time:"3:00 PM", text:"Hello Arjun ji? Main Priya Nair bol rahi hoon Pinnacle IAS se. Kya 2 minute mein baat kar sakte hain?" },
      { sender:"client", name:"Arjun",  time:"3:01 PM", text:"Haan bolo." },
      { sender:"rep",    name:"Priya",  time:"3:01 PM", text:"Arjun ji, aap civil services ki taiyaari kar rahe hain? Humara State PCS batch bahut popular hai Kerala PSC ke liye bhi." },
      { sender:"client", name:"Arjun",  time:"3:02 PM", text:"Haan, Kerala PSC ka soch raha hoon. Lekin main Kochi mein hoon — online option hai?" },
      { sender:"rep",    name:"Priya",  time:"3:03 PM", text:"Bilkul! Full online live + recorded access dono hain. Budget kya hai aapka?" },
      { sender:"client", name:"Arjun",  time:"3:04 PM", text:"₹20,000 ke andar chahiye. Aur Hindi medium mein classes hain?" },
      { sender:"rep",    name:"Priya",  time:"3:05 PM", text:"State PCS batch English + Hindi dono mein hai. Fee ₹22,000 hai full batch ke liye, lekin main manager se ek baar confirm karke aapko EMI option bhi bata sakti hoon." },
      { sender:"client", name:"Arjun",  time:"3:05 PM", text:"Theek hai, bata dena. Thursday ko call karo." },
    ],
    aiSummary:{
      sentiment:"Neutral",
      intent:"Kerala PSC aspirant — online mode, budget-conscious",
      nextAction:"Share online demo access link. Confirm EMI option from manager.",
      bestTimeToCall:"Evenings 6:00 PM – 8:00 PM",
      dealProbability:42,
      keyPoints:[
        "Kerala PSC target — location constraint (Kochi)",
        "Online live+recorded batch is available — good match",
        "Budget ₹20-25k — slightly below listed price",
        "EMI option could close the gap",
      ],
      summary:"Arjun has a clear need but is price-sensitive. Online batch is a perfect fit. EMI option would likely close the deal. Keep follow-up warm with a demo link.",
      languagePreference:"Hindi + Malayalam (prefers Hindi for formal study content, Malayalam in casual conversation)",
      competitorIntel:"Kerala PSC aspirants commonly use local institutes like Kerala PSC Helper or Yodhakkal. Counter by highlighting our structured pan-India content, live Q&A access, and recorded sessions — advantages local players cannot match.",
      handlingObjections:"If price gap (₹2k above budget): offer 3-installment EMI with no added cost. If medium concern: confirm Hindi medium availability with a sample recorded lecture. If local vs. online trust gap: share Kerala PSC result testimonials from online students.",
      suggestedOpeningLine:"Arjun ji, Priya here from Pinnacle — I've got the EMI breakdown ready and a demo link for the online batch. Two minutes to walk you through it?",
    },
  },

  // ── L-1004 — Fatima Sheikh ──
  {
    id:"L-1004", name:"Fatima Sheikh", phone:"+91 96400 44567",
    email:"fatima.sheikh@corp.in", source:"Instagram Ad", service:"Prelims Pro Batch",
    status:"New", score:"Medium", assignedTo:"Aanya Sharma",
    city:"Hyderabad", priority:"Medium", createdAt:"2025-05-22", followUpDate:"2025-05-28",
    notes:"Inbound from Instagram ad. Engineering grad, 2nd year job, planning to leave job for UPSC. Has not been contacted yet.",
    activity:[
      { time:"8:00 AM · 22 May", type:"note", text:"Lead captured via Instagram ad — filled enquiry form" },
      { time:"8:05 AM · 22 May", type:"note", text:"Auto-assigned to Kabir Singh (round-robin)" },
    ],
    conversation:[],
    aiSummary:{
      sentiment:"Neutral",
      intent:"Inbound interest — engineering grad planning UPSC transition",
      nextAction:"First call not made yet. Contact ASAP — inbound leads go cold in 24 hrs.",
      bestTimeToCall:"Weekdays 10:00 AM – 12:00 PM",
      dealProbability:35,
      keyPoints:[
        "Inbound from Instagram ad — warm intent signal",
        "Engineering background — may need guidance on optional selection",
        "No conversation yet",
        "Contact within 24hrs for best conversion",
      ],
      summary:"Fatima submitted a form via Instagram — inbound signal indicates some intent. No contact made yet. Immediate outreach required.",
      languagePreference:"English + Telugu (Hyderabad profile — likely comfortable in both; open with English)",
      competitorIntel:"Instagram-discovered leads in Hyderabad frequently compare with Byju's Exam Prep and Unacademy Plus. Highlight our faculty-led personal feedback model vs. their algorithmic content delivery.",
      handlingObjections:"If job-leaving anxiety is raised: validate the concern, share structured 6-month transition plan for working professionals. If 'I'm still deciding' hesitation: offer a free orientation session with no commitment.",
      suggestedOpeningLine:"Hi Fatima! Calling from Pinnacle IAS — you checked out our Prelims Pro batch on Instagram. Would love to understand your UPSC plan and see if we're the right fit. Five minutes?",
    },
  },

  // ── L-1005 — Rahul Saxena ──
  {
    id:"L-1005", name:"Rahul Saxena", phone:"+91 95500 55678",
    email:"r.saxena@gmail.com", source:"Seminar",
    service:"UPSC Full Course",
    status:"Won", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Pune", priority:"High", createdAt:"2025-05-10", followUpDate:"",
    notes:"Closed! Attended free seminar in Pune. Quick decision maker. Enrolled in full course. Upsell Test Series add-on in 3 months.",
    activity:[
      { time:"11:00 AM · 12 May", type:"call",   text:"Post-seminar follow-up call — very positive response" },
      { time:"2:00 PM  · 13 May", type:"email",  text:"Sent full course brochure and enrollment form" },
      { time:"11:30 AM · 15 May", type:"status", text:"Status: Qualified → Won" },
      { time:"12:00 PM · 15 May", type:"note",   text:"Fee paid in full. Onboarding scheduled for May 20." },
    ],
    conversation:[
      { sender:"rep",    name:"Meera",  time:"11:00 AM", text:"Hi Rahul! Meera here from Pinnacle IAS. You attended our seminar yesterday — did you get a chance to go through the course material?" },
      { sender:"client", name:"Rahul",  time:"11:02 AM", text:"Haan Meera ji! Bahut accha laga. Maine raat ko hi parent se baat ki — hum full course join karna chahte hain. Process kya hai?" },
      { sender:"rep",    name:"Meera",  time:"11:03 AM", text:"Amazing! Enrollment form bhejti hoon abhi. Fee ₹72,000 for full year — you can pay in 2 installments bhi." },
      { sender:"client", name:"Rahul",  time:"11:04 AM", text:"Full payment kar deta hoon. Link bhejo." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Already closed — upsell Test Series add-on",
      nextAction:"Schedule orientation call. Propose Test Series add-on in 3 months.",
      bestTimeToCall:"Any weekday morning",
      dealProbability:100,
      keyPoints:[
        "Closed after seminar — fastest enrollment this month",
        "Full fee paid upfront",
        "Strong upsell candidate for Test Series",
      ],
      summary:"Won deal. Rahul enrolled after a seminar with full payment. Excellent candidate for Test Series upsell.",
      languagePreference:"Hindi-English (switches naturally; no preference concerns)",
      competitorIntel:"Not applicable — deal closed. During the sales cycle no competitor was mentioned. Focus is now retention and upsell.",
      handlingObjections:"No objections at this stage. For Test Series upsell: frame it as 'the natural next step' at the 3-month mark — share mock test schedules and topper testimonials ahead of that call.",
      suggestedOpeningLine:"Hi Rahul! Meera here — you're all set for orientation. I also wanted to share something exciting about our Test Series that students at your stage find really valuable.",
    },
  },

  // ── L-1006 — Tanya Malhotra ──
  {
    id:"L-1006", name:"Tanya Malhotra", phone:"+91 94600 66789",
    email:"tanya.m@gmail.com", source:"Website", service:"Prelims Pro Batch",
    status:"Lost", score:"Cold", assignedTo:"Aanya Sharma",
    city:"Delhi", priority:"Low", createdAt:"2025-05-05", followUpDate:"",
    notes:"Lost to competitor (Vajiram). Price was deciding factor. Note: highlight our faculty credentials and test series quality next time.",
    activity:[
      { time:"2:00 PM · 08 May", type:"call",   text:"Final call — student declined" },
      { time:"2:10 PM · 08 May", type:"status", text:"Status: Interested → Lost" },
      { time:"2:15 PM · 08 May", type:"note",   text:"Chose Vajiram. Price difference of ₹8K was deciding factor." },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya",  time:"2:00 PM", text:"Hi Tanya! Just calling to see if you'd made a decision on the batch?" },
      { sender:"client", name:"Tanya",  time:"2:01 PM", text:"Haan Aanya, I was going to call you. We decided to go with Vajiram." },
      { sender:"rep",    name:"Aanya",  time:"2:02 PM", text:"Oh I see. May I ask what was the deciding factor?" },
      { sender:"client", name:"Tanya",  time:"2:03 PM", text:"Mainly price. Vajiram is ₹8,000 cheaper. Features toh almost same lagte hain." },
      { sender:"rep",    name:"Aanya",  time:"2:04 PM", text:"Understood Tanya ji. Thank you for being honest. Please feel free to reach out if things don't work out." },
    ],
    aiSummary:{
      sentiment:"Negative",
      intent:"Lost — chose Vajiram on price",
      nextAction:"Mark as lost. Re-engage in 2 months if discount available.",
      bestTimeToCall:"Not applicable — lost",
      dealProbability:5,
      keyPoints:[
        "Lost to Vajiram — ₹8K price difference",
        "Features not the issue — purely price",
        "Re-approach before next UPSC cycle",
      ],
      summary:"Lost on price. Worth re-approaching before the next UPSC notification with a competitive offer.",
      languagePreference:"Hindi-English (Delhi profile, comfortable with both)",
      competitorIntel:"Explicitly chose Vajiram on price (₹8K cheaper). For re-engagement: lead with our test series quality and result data — not price matching. If Vajiram experience disappoints her, she will be receptive.",
      handlingObjections:"For re-engagement call: acknowledge her choice without being defensive. Ask about her experience so far. If dissatisfied: offer a free trial class and a one-time loyalty discount to switch.",
      suggestedOpeningLine:"Hi Tanya, Aanya here from Pinnacle — just checking in after a couple of months. How has your preparation been going? We have some new batch options coming up for the next cycle.",
    },
  },

  // ── L-1007 — Nikhil Desai ──
  {
    id:"L-1007", name:"Nikhil Desai", phone:"+91 93700 77890",
    email:"nikhil.desai@gmail.com", source:"Referral", service:"UPSC Full Course",
    status:"Contacted", score:"Medium", assignedTo:"Aanya Sharma",
    city:"Ahmedabad", priority:"Medium", createdAt:"2025-05-21", followUpDate:"2025-05-30",
    notes:"Referred by Sneha Kulkarni. Commerce grad, wants to take UPSC but unsure about optional. Needs demo and counseling session.",
    activity:[
      { time:"4:00 PM · 21 May", type:"call",   text:"First contact — positive, asked about optional subject guidance" },
      { time:"4:10 PM · 21 May", type:"status", text:"Status: New → Contacted" },
      { time:"4:30 PM · 21 May", type:"note",   text:"Counseling session scheduled May 30" },
    ],
    conversation:[
      { sender:"rep",    name:"Rohan", time:"4:00 PM", text:"Namaste Nikhil ji! Main Rohan bol raha hoon Pinnacle IAS se. Sneha ne aapka reference diya tha." },
      { sender:"client", name:"Nikhil", time:"4:01 PM", text:"Haan haan, Sneha ne bataya. Mujhe UPSC ki taraf jaana hai but optional select karne mein confusion hai." },
      { sender:"rep",    name:"Rohan", time:"4:02 PM", text:"Bahut common problem hai yeh! Humari free counseling session hoti hai jisme faculty personally guide karti hain. Commerce background se Economics ya Public Administration accha match hai." },
      { sender:"client", name:"Nikhil", time:"4:03 PM", text:"Ek session lete hain. Kab available hai?" },
      { sender:"rep",    name:"Rohan", time:"4:04 PM", text:"Thursday May 30, 3 PM — schedule karta hoon?" },
      { sender:"client", name:"Nikhil", time:"4:05 PM", text:"Haan, confirm karo." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"UPSC aspirant — needs optional guidance",
      nextAction:"Counseling session on May 30 — prepare Commerce background optional recommendations.",
      bestTimeToCall:"Weekdays 3:00 PM – 6:00 PM",
      dealProbability:58,
      keyPoints:[
        "Warm referral from enrolled student",
        "Commerce background — Economics or Public Admin optional recommended",
        "Counseling session booked May 30",
      ],
      summary:"Nikhil is a good prospect referred by an enrolled student. Counseling session is the next step — convert to enrollment after that.",
      languagePreference:"Hindi-Gujarati (Ahmedabad profile — use Hindi, avoid heavy English jargon in first session)",
      competitorIntel:"Ahmedabad aspirants often consider local institutes like Lakshya IAS or online platforms like Unacademy. Reinforce our structured counseling and dedicated optional faculty as differentiators — things local coaching lacks.",
      handlingObjections:"If optional confusion persists post-session: offer a free trial class for both Economics and Public Admin before he decides. If fee is raised: position counseling session as proof of our investment in his success — not just a sales call.",
      suggestedOpeningLine:"Nikhil ji, Rohan here from Pinnacle — all set for your counseling session tomorrow at 3 PM. I've put together a quick optional comparison for Commerce backgrounds to make it a productive session!",
    },
  },

  // ── L-1008 — Kavita Joshi ──
  {
    id:"L-1008", name:"Kavita Joshi", phone:"+91 92800 88901",
    email:"kavita.joshi@gmail.com", source:"Cold Call", service:"State PCS Batch",
    status:"Spam", score:"Cold", assignedTo:"Aanya Sharma",
    city:"Jaipur", priority:"Low", createdAt:"2025-05-22", followUpDate:"",
    notes:"Invalid number confirmed. Never answered across 3 attempts. Marked spam.",
    activity:[
      { time:"9:00 AM · 22 May", type:"call",   text:"No answer — attempt 1" },
      { time:"11:00 AM · 22 May", type:"call",  text:"No answer — attempt 2" },
      { time:"2:00 PM  · 22 May", type:"call",  text:"No answer — attempt 3, number appears invalid" },
      { time:"2:30 PM  · 22 May", type:"status",text:"Status: New → Spam" },
    ],
    conversation:[],
    aiSummary:{
      sentiment:"Negative",
      intent:"Invalid lead — no contact made",
      nextAction:"Archive. Do not attempt further.",
      bestTimeToCall:"Not applicable",
      dealProbability:0,
      keyPoints:["3 attempts with no answer","Number appears invalid","Marked spam"],
      summary:"Unreachable lead after 3 attempts. Archived.",
      languagePreference:"Unknown — no conversation recorded",
      competitorIntel:"Not applicable — lead is invalid.",
      handlingObjections:"Not applicable — lead is archived.",
      suggestedOpeningLine:"Not applicable — do not contact.",
    },
  },

  // ── L-1009 — Siddharth Rao ──
  {
    id:"L-1009", name:"Siddharth Rao", phone:"+91 91900 99012",
    email:"sid.rao@gmail.com", source:"YouTube", service:"Mains Answer Writing",
    status:"Interested", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Bangalore", priority:"High", createdAt:"2025-05-23", followUpDate:"2025-05-28",
    notes:"Watched Pinnacle's YouTube lectures, very engaged. UPSC 2025 aspirant, strong Prelims, weak in Mains answer writing. Perfect candidate for Mains intensive program.",
    activity:[
      { time:"10:00 AM · 23 May", type:"call",   text:"First call — very engaged, discussing answer writing structure" },
      { time:"10:40 AM · 23 May", type:"status", text:"Status: New → Interested" },
      { time:"11:00 AM · 23 May", type:"email",  text:"Sent Mains sample study plan and faculty profile" },
      { time:"3:00 PM  · 26 May", type:"call",   text:"Second call — reviewed sample answer, highly impressed" },
    ],
    conversation:[
      { sender:"rep",    name:"Meera",   time:"10:00 AM", text:"Hi Siddharth! Meera here from Pinnacle IAS. I saw you've been watching our GS Mains lectures on YouTube — are you preparing for 2025?" },
      { sender:"client", name:"Siddharth",time:"10:01 AM", text:"Yes! Your faculty's content is brilliant. I'm struggling with answer writing though — my content is fine but presentation is poor." },
      { sender:"rep",    name:"Meera",   time:"10:02 AM", text:"That's a very common gap! Our Mains Answer Writing Program has daily practice with individual evaluation. Every answer gets written feedback from faculty." },
      { sender:"client", name:"Siddharth",time:"10:03 AM", text:"That sounds exactly what I need. Fee kya hai? And is it online?" },
      { sender:"rep",    name:"Meera",   time:"10:04 AM", text:"₹18,000 for 3 months — fully online. Daily questions, weekly tests, individual feedback. We also have a Prelims + Mains combo if you want." },
      { sender:"client", name:"Siddharth",time:"10:05 AM", text:"Just Mains for now. Let me check once and get back." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Mains answer writing improvement — strong Prelims, weak Mains presentation",
      nextAction:"Follow up on decision. Offer a free sample evaluation of one of his answers.",
      bestTimeToCall:"Weekdays 10:00 AM – 12:00 PM",
      dealProbability:76,
      keyPoints:[
        "Organic lead from YouTube — high trust and engagement",
        "Clear pain point: Mains answer writing structure",
        "Mains Answer Writing Program is perfect fit",
        "Budget not mentioned as concern",
      ],
      summary:"Siddharth is a strong prospect. Engaged through YouTube content, clear need identified. A free sample evaluation would likely close him.",
      languagePreference:"English (Bangalore tech profile — prefers English; light Hindi acceptable)",
      competitorIntel:"Bangalore-based UPSC aspirants frequently use IASbaba or ForumIAS for answer writing practice — both are free or low-cost. Counter by emphasising individual faculty evaluation (not peer review), structured daily prompts, and personalised feedback cycles our program offers.",
      handlingObjections:"If comparing free platforms like IASbaba: highlight that peer-reviewed feedback vs. expert faculty evaluation is a fundamentally different product. Offer the free sample answer evaluation as proof. If price concern at ₹18K: break it down to ₹200/day — cheaper than one coaching session anywhere.",
      suggestedOpeningLine:"Siddharth, Meera here from Pinnacle! I evaluated one of the practice answers you might write — want me to walk you through how our faculty would mark it? Takes just 10 minutes.",
    },
  },

  // ── L-1010 — Pooja Nambiar ──
  {
    id:"L-1010", name:"Pooja Nambiar", phone:"+91 90100 10123",
    email:"pooja.n@gmail.com", source:"Seminar", service:"Prelims Pro Batch",
    status:"Qualified", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Chennai", priority:"High", createdAt:"2025-05-16", followUpDate:"2025-05-27",
    notes:"Attended offline seminar in Chennai. 3rd attempt aspirant, serious about it. Parents have approved fees. Wants to start from June 1 batch. Ready to pay.",
    activity:[
      { time:"9:00 AM  · 16 May", type:"call",   text:"Met at Chennai seminar — very serious aspirant" },
      { time:"11:00 AM · 17 May", type:"call",   text:"Follow-up call — parents approved, wants June batch" },
      { time:"3:00 PM  · 20 May", type:"email",  text:"Sent enrollment form and payment link" },
      { time:"10:00 AM · 23 May", type:"status", text:"Status: Interested → Qualified" },
      { time:"11:00 AM · 26 May", type:"note",   text:"Waiting on our enrollment confirmation call." },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya",  time:"11:00 AM", text:"Good morning Pooja! Following up — did you check with your parents about the enrollment?" },
      { sender:"client", name:"Pooja",  time:"11:01 AM", text:"Yes! Papa ne bola proceed karo. June 1 batch mein join karna hai. Enrollment kaise karein?" },
      { sender:"rep",    name:"Aanya",  time:"11:02 AM", text:"Wonderful! Payment link bhejti hoon — ₹45,000 for Prelims Pro. Ek baar payment ho jaaye, orientation call schedule hogi." },
      { sender:"client", name:"Pooja",  time:"11:03 AM", text:"Study material physical milega? Aur mock test schedule kab se shuru hoga?" },
      { sender:"rep",    name:"Aanya",  time:"11:04 AM", text:"Physical notes June 1 pe courier ho jaayenge. Mock tests week 2 se start honge — ek test per week." },
      { sender:"client", name:"Pooja",  time:"11:05 AM", text:"Perfect. Payment kar deti hoon aaj." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Ready to enroll — June 1 batch, parents approved",
      nextAction:"Send payment link TODAY and confirm enrollment. Don't delay.",
      bestTimeToCall:"Mornings 9 AM – 11 AM",
      dealProbability:92,
      keyPoints:[
        "Parents approved — 3rd attempt aspirant, serious",
        "June 1 batch deadline is the urgency driver",
        "Payment link sent — follow up on completion",
      ],
      summary:"Pooja is a near-closed deal. Parents approved, she's ready to pay. Confirm June 1 batch seat and send payment link today.",
      languagePreference:"Tamil + English (Chennai profile — open in English, may appreciate Tamil warmth in opener)",
      competitorIntel:"Chennai aspirants on their 3rd attempt commonly explore Shankar IAS Academy (strong local brand). Pooja has already chosen us post-seminar — reinforce that decision by moving fast on enrollment confirmation so she doesn't re-evaluate.",
      handlingObjections:"No significant objections remain — parents approved, payment link sent. If payment delay: create urgency around June 1 seat availability. If last-minute hesitation: offer a 5-minute call with a faculty member to reassure.",
      suggestedOpeningLine:"Good morning Pooja! Aanya here — just confirming your June 1 seat is reserved. Shall I walk you through the payment steps right now so we can lock it in today?",
    },
  },

  // ── L-1011 — Harish Kumar ──
  {
    id:"L-1011", name:"Harish Kumar", phone:"+91 89200 11234",
    email:"h.kumar@gmail.com", source:"Website", service:"UPSC Full Course",
    status:"New", score:"Medium", assignedTo:"Aanya Sharma",
    city:"Lucknow", priority:"Medium", createdAt:"2025-05-26", followUpDate:"2025-05-29",
    notes:"Just submitted enquiry form. Mentions interest in UPSC full course. UP state, likely Hindi medium preference.",
    activity:[
      { time:"2:30 PM · 26 May", type:"note", text:"Lead captured via website enquiry form" },
    ],
    conversation:[],
    aiSummary:{
      sentiment:"Neutral",
      intent:"Inbound — UPSC full course, likely Hindi medium",
      nextAction:"First call — qualify medium preference and exam target.",
      bestTimeToCall:"Weekdays 10:00 AM – 12:00 PM",
      dealProbability:30,
      keyPoints:["Fresh inbound from UP","Hindi medium likely given location","No conversation yet"],
      summary:"Fresh inbound. Needs first qualifying call to understand medium, attempt number, and target.",
      languagePreference:"Hindi (Lucknow / UP profile — conduct entire call in Hindi for best rapport)",
      competitorIntel:"Lucknow aspirants often consider Drishti IAS (strong Hindi medium brand) and local UP coaching centres. Lead with our Hindi medium content quality, UP-specific GS coverage, and result data to match Drishti's perceived edge.",
      handlingObjections:"If 'I'm just exploring': treat as warm interest, offer a free Hindi medium demo class link. If Drishti IAS comparison comes up: acknowledge their strength in Hindi content, then highlight our structured test series and personal mentorship gap they don't fill.",
      suggestedOpeningLine:"Namaste Harish ji! Main Pinnacle IAS se bol raha/rahi hoon — aapne hamari website pe UPSC Full Course ke liye form bhara tha. Kya abhi 5 minute baat ho sakti hai taiyari ke baare mein?",
    },
  },

  // ── L-1012 — Reema Kapoor ──
  {
    id:"L-1012", name:"Reema Kapoor", phone:"+91 88300 22345",
    email:"reema.k@gmail.com", source:"Referral", service:"State PCS Batch",
    status:"Contacted", score:"Cold", assignedTo:"Aanya Sharma",
    city:"Delhi", priority:"Low", createdAt:"2025-05-15", followUpDate:"2025-06-02",
    notes:"Delhi University student. Interested in State PCS Delhi batch. Budget very limited — ₹10-12k max. Check if scholarship or installment plan is available.",
    activity:[
      { time:"11:00 AM · 15 May", type:"call",   text:"First call — interested but extremely budget constrained" },
      { time:"11:20 AM · 15 May", type:"status", text:"Status: New → Contacted" },
      { time:"11:30 AM · 15 May", type:"note",   text:"Flagged for scholarship check with manager" },
    ],
    conversation:[
      { sender:"rep",    name:"Aryan",  time:"11:00 AM", text:"Hello Reema ji! Main Aryan bol raha hoon Pinnacle IAS se." },
      { sender:"client", name:"Reema",  time:"11:01 AM", text:"Hi Aryan. Haan, mere friend ne bataya tha. I'm a final year DU student — interested in State PCS Delhi. But budget kaafi limited hai mere paas." },
      { sender:"rep",    name:"Aryan",  time:"11:02 AM", text:"Koi baat nahi Reema ji! State PCS batch ₹22,000 ka hai lekin main manager se scholarship ke baare mein baat karke aapko batata hoon." },
      { sender:"client", name:"Reema",  time:"11:03 AM", text:"Please check — ₹10-12,000 se zyada nahi ho sakta mere se." },
      { sender:"rep",    name:"Aryan",  time:"11:04 AM", text:"Try karta hoon — 3-4 installments bhi possible ho sakti hain. Main 2 din mein call karta hoon." },
    ],
    aiSummary:{
      sentiment:"Neutral",
      intent:"State PCS Delhi — student, very budget constrained",
      nextAction:"Get scholarship/installment approval from manager. Call back by June 2.",
      bestTimeToCall:"Weekdays 11:00 AM – 1:00 PM",
      dealProbability:28,
      keyPoints:[
        "DU student — limited budget ₹10-12k max",
        "State PCS Delhi is a good fit product",
        "Needs scholarship or EMI arrangement",
      ],
      summary:"Reema is a genuine aspirant with a tight budget. EMI or scholarship approval from manager is needed to close.",
      languagePreference:"Hindi-English (Delhi University student — fluid between both; use English-heavy Hindi for relatability)",
      competitorIntel:"DU students commonly rely on free resources — YouTube channels, Telegram groups, or low-cost local Delhi PCS institutes. Position our structured batch as a step above self-study with the EMI bridge making it accessible.",
      handlingObjections:"Primary objection is price (₹10K gap). If scholarship not available: propose 4-installment plan of ₹5,500 each. If still hesitant: offer 1-month trial access at ₹2,000 deductible from full fee if she enrolls.",
      suggestedOpeningLine:"Hi Reema! Aryan here from Pinnacle — good news, I've spoken to the manager about your situation. Have 2 minutes to discuss a plan that works within your budget?",
    },
  },

  // ── L-1013 — Vikash Pandey ──
  {
    id:"L-1013", name:"Vikash Pandey", phone:"+91 87400 33456",
    email:"vikash.p@gmail.com", source:"Cold Call", service:"Prelims Pro Batch",
    status:"Follow-up", score:"Medium", assignedTo:"Aanya Sharma",
    city:"Varanasi", priority:"Medium", createdAt:"2025-05-20", followUpDate:"2025-05-28",
    notes:"First year UPSC aspirant. Showed interest in Prelims Pro batch but travelling. Follow up Monday 11 AM confirmed.",
    activity:[
      { time:"2:00 PM · 20 May", type:"call",   text:"Cold call — answered, showed interest" },
      { time:"2:20 PM · 20 May", type:"status", text:"Status: New → Follow-up" },
      { time:"2:30 PM · 20 May", type:"followup",text:"Reminder set — call Monday May 28 at 11 AM" },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya",  time:"2:00 PM", text:"Namaste Vikash ji! Main Aanya Sharma bol rahi hoon Pinnacle IAS se. Kya abhi 3-4 minute baat ho sakti hai?" },
      { sender:"client", name:"Vikash", time:"2:01 PM", text:"Haan bolo, main train mein hoon." },
      { sender:"rep",    name:"Aanya",  time:"2:02 PM", text:"Vikash ji, aap UPSC ki preparation soch rahe hain? First attempt hai?" },
      { sender:"client", name:"Vikash", time:"2:03 PM", text:"Haan, graduation iss saal complete hogi. UPSC ka socha hai. Lekin is hafte Delhi jaana hai — next week baat karte hain properly?" },
      { sender:"rep",    name:"Aanya",  time:"2:04 PM", text:"Bilkul! Monday 11 baje call karoon?" },
      { sender:"client", name:"Vikash", time:"2:05 PM", text:"Monday theek hai." },
    ],
    aiSummary:{
      sentiment:"Neutral",
      intent:"First attempt aspirant — fresh graduate, evaluating options",
      nextAction:"Call Monday May 28, 11 AM. Explain Prelims Pro roadmap for freshers.",
      bestTimeToCall:"Monday 11:00 AM",
      dealProbability:45,
      keyPoints:[
        "Fresh graduate — first UPSC attempt",
        "Travelling this week — Monday confirmed",
        "Varanasi — may prefer Hindi medium",
      ],
      summary:"Vikash is a fresh aspirant evaluating options. Monday 11 AM call confirmed. Prepare first-attempt guidance angle.",
      languagePreference:"Hindi (Varanasi profile — conduct call fully in Hindi; formal Hindustani works well)",
      competitorIntel:"Varanasi aspirants often look at Drishti IAS or locally famous UP PCS coaching centres. As a first-timer he may not have strong brand preferences yet — establish Pinnacle early with a clear structured roadmap before competitors do.",
      handlingObjections:"If overwhelmed by options: simplify with a '12-month Prelims roadmap' document tailored to first-timers. If parents are decision-makers (likely at this stage): offer a parent-friendly brochure in Hindi and a joint call if needed.",
      suggestedOpeningLine:"Namaste Vikash ji! Aanya here from Pinnacle — Monday 11 baje ki call ke liye ready hoon. Aapke liye first attempt ka pura roadmap taiyar kar liya hai — bahut simple hai, don't worry!",
    },
  },

  // ── L-1014 — Ananya Singh ──
  {
    id:"L-1014", name:"Ananya Singh", phone:"+91 86500 44567",
    email:"ananya.s@gmail.com", source:"Walk-in", service:"UPSC Full Course",
    status:"Qualified", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Delhi", priority:"High", createdAt:"2025-05-12", followUpDate:"2025-05-27",
    notes:"Walk-in enquiry. Engineering drop-year student, full-time aspirant. Shortlisted us over 2 other institutes. Needs payment confirmation call.",
    activity:[
      { time:"11:00 AM · 12 May", type:"note",   text:"Walk-in enquiry at Delhi centre" },
      { time:"11:30 AM · 12 May", type:"status", text:"Status: New → Contacted" },
      { time:"2:00 PM  · 14 May", type:"call",   text:"Demo class attended — very impressed with faculty" },
      { time:"3:00 PM  · 14 May", type:"status", text:"Status: Contacted → Interested" },
      { time:"10:00 AM · 20 May", type:"call",   text:"Follow-up call — shortlisted us over Chanakya and StudyIQ" },
      { time:"10:30 AM · 20 May", type:"status", text:"Status: Interested → Follow-up" },
      { time:"2:00 PM  · 24 May", type:"call",   text:"Parents joined call — approved enrollment" },
      { time:"3:00 PM  · 24 May", type:"status", text:"Status: Follow-up → Qualified" },
      { time:"3:15 PM  · 24 May", type:"note",   text:"Awaiting payment — follow up May 27" },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya",  time:"10:00 AM", text:"Good morning Ananya! Following up — aapne parents se baat ki?" },
      { sender:"client", name:"Ananya", time:"10:01 AM", text:"Haan didi! Mummy-papa dono impressed hain. Unhone bola proceed karo. Hum Pinnacle join karna chahte hain." },
      { sender:"rep",    name:"Aanya",  time:"10:02 AM", text:"Bahut badhiya! Payment kaise karna chahenge — lump sum ya installments?" },
      { sender:"client", name:"Ananya", time:"10:03 AM", text:"2 installments best rahega. Pehla aaj, doosra 3 months baad." },
      { sender:"rep",    name:"Aanya",  time:"10:04 AM", text:"Done! Payment link bhejti hoon. June batch mein seat pakki hai aapki." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Full-time aspirant — ready to enroll, payment pending",
      nextAction:"Send installment payment link today. Confirm June 1 batch seat.",
      bestTimeToCall:"Mornings 10 AM – 12 PM",
      dealProbability:90,
      keyPoints:[
        "Walk-in — shortlisted us over Chanakya and StudyIQ",
        "Parents approved after joint call",
        "Wants 2-installment plan",
        "Payment link pending",
      ],
      summary:"Ananya is effectively closed. Parents approved after a joint call, shortlisted us over competitors. Send installment payment link immediately.",
      languagePreference:"Hindi-English (Delhi, young aspirant — casual Hindi mixed with English; address her warmly as 'Ananya')",
      competitorIntel:"Explicitly compared us against Chanakya IAS and StudyIQ and chose Pinnacle. Reinforce her decision — mention what stood out in the demo (faculty quality) and avoid any re-comparison that might make her second-guess.",
      handlingObjections:"No substantive objection remaining — payment is the only step. If payment delay: remind her June 1 batch seats are filling up. If 2nd installment timing concern: confirm exact date in writing to build trust.",
      suggestedOpeningLine:"Hi Ananya! Aanya didi here — sending your 2-installment payment link right now. Your June 1 seat is blocked. Let me know once the first payment is done and I'll send your welcome kit!",
    },
  },

  // ── L-1015 — Mohit Agarwal ──
  {
    id:"L-1015", name:"Mohit Agarwal", phone:"+91 85600 55678",
    email:"mohit.a@gmail.com", source:"Google Ad", service:"Mains Answer Writing",
    status:"New", score:"Cold", assignedTo:"Aanya Sharma",
    city:"Jaipur", priority:"Low", createdAt:"2025-05-27", followUpDate:"2025-05-29",
    notes:"Clicked Google ad for Mains batch. Just signed up. No info available yet.",
    activity:[
      { time:"6:00 PM · 27 May", type:"note", text:"Lead captured via Google Ad click" },
    ],
    conversation:[],
    aiSummary:{
      sentiment:"Neutral",
      intent:"Inbound via ad — Mains batch interest",
      nextAction:"First call — qualify attempt stage and Mains concern.",
      bestTimeToCall:"Evenings 6 PM – 8 PM",
      dealProbability:25,
      keyPoints:["Fresh ad lead","No qualification data yet"],
      summary:"Brand new lead from Google ad. First call needed to qualify.",
      languagePreference:"Hindi-English (Jaipur profile — open with Hindi, switch to English if he does)",
      competitorIntel:"Google Ads for Mains Answer Writing in Jaipur compete heavily with Drishti IAS and Vision IAS. He may be comparing multiple tabs. Lead fast with a concrete differentiator — individual faculty feedback per answer vs. batch correction sheets.",
      handlingObjections:"If 'just browsing': offer a free sample Mains question with model answer to create instant value. If comparing with Vision IAS or Drishti: highlight daily evaluation turnaround time and personalised comments as what sets us apart.",
      suggestedOpeningLine:"Hello Mohit ji! Pinnacle IAS se bol raha/rahi hoon — aapne Mains Answer Writing batch ka ad dekha tha. Kya aap 2025 ya 2026 ke liye taiyari kar rahe hain? Sirf 5 minute mein clearly guide kar sakta/sakti hoon.",
    },
  },

  // ── L-1016 — Preethi Subramaniam ──
  {
    id:"L-1016", name:"Preethi Subramaniam", phone:"+91 84700 66789",
    email:"preethi.sub@gmail.com", source:"Referral", service:"Prelims Pro Batch",
    status:"Interested", score:"Hot", assignedTo:"Aanya Sharma",
    city:"Coimbatore", priority:"High", createdAt:"2025-05-24", followUpDate:"2025-05-30",
    notes:"Referred by Rahul Saxena (L-1005). Tamil Nadu PSC + UPSC Prelims aspirant. Wants hybrid mode (weekend offline + online weekdays). Strong candidate.",
    activity:[
      { time:"9:00 AM · 24 May", type:"call",   text:"First call — already aware of Pinnacle via Rahul, very positive" },
      { time:"9:30 AM · 24 May", type:"status", text:"Status: New → Interested" },
      { time:"10:00 AM · 24 May", type:"note",  text:"Interested in hybrid mode. Weekend offline possible only if she visits Delhi monthly." },
      { time:"3:00 PM  · 26 May", type:"call",  text:"Second call — discussing hybrid options and Tamil Nadu GS paper" },
    ],
    conversation:[
      { sender:"rep",    name:"Aanya",  time:"9:00 AM", text:"Hello Preethi! Main Aanya Sharma bol rahi hoon Pinnacle IAS se. Rahul Saxena ne aapka reference diya tha." },
      { sender:"client", name:"Preethi",time:"9:01 AM", text:"Hi Aanya! Yes, Rahul bhai ne bahut recommend kiya. Main both TNPSC aur UPSC Prelims soch rahi hoon." },
      { sender:"rep",    name:"Aanya",  time:"9:02 AM", text:"Excellent! Dual preparation possible hai — humara Prelims Pro covers most common topics. Aap Coimbatore mein hain toh online primarily?" },
      { sender:"client", name:"Preethi",time:"9:03 AM", text:"Online weekdays, lekin monthly ek baar Delhi aana possible hai. Hybrid ho sakta hai?" },
      { sender:"rep",    name:"Aanya",  time:"9:04 AM", text:"Bilkul! Hybrid model available hai. Fee ₹50,000 — includes monthly Delhi workshop access. Let me share the schedule." },
      { sender:"client", name:"Preethi",time:"9:05 AM", text:"Please send. I'll discuss with family and get back by Friday." },
    ],
    aiSummary:{
      sentiment:"Positive",
      intent:"Dual UPSC + TNPSC aspirant — hybrid mode, warm referral",
      nextAction:"Follow up Friday May 30. Confirm hybrid schedule and seat availability.",
      bestTimeToCall:"Mornings 9 AM – 11 AM",
      dealProbability:68,
      keyPoints:[
        "Warm referral from enrolled student — high trust",
        "Dual target UPSC + TNPSC — good fit with curriculum",
        "Hybrid model is a premium offering — higher fee justified",
        "Family decision expected by Friday",
      ],
      summary:"Preethi is a strong, warm-referral lead. Hybrid model is the right fit. Follow up Friday after family discussion.",
      languagePreference:"Tamil + Hindi-English (code-switching expected — open in English, she will set the language comfort level)",
      competitorIntel:"No competitor explicitly named, but Coimbatore aspirants commonly evaluate Shankar IAS Academy (Chennai-based, strong Tamil Nadu presence). Differentiate on hybrid model exclusivity — Shankar has no Delhi workshop component. Rahul's referral is the strongest trust anchor; use it.",
      handlingObjections:"If fee concern at ₹50K: break down hybrid value — online batch (₹35K equivalent) + monthly Delhi workshop (₹15K equivalent) bundled. If family hesitation: offer a 15-minute call with Rahul Saxena as a peer reference. If TNPSC coverage doubt: share specific TNPSC syllabus overlap document.",
      suggestedOpeningLine:"Hello Preethi! Aanya here from Pinnacle — Rahul told me you're eyeing both UPSC and TNPSC Prelims. I've got the hybrid schedule ready and a seat blocked for you. Five minutes to walk through it before Friday?",
    },
  },
];

// ── DASHBOARDS ──────────────────────────────────────────────────
export const repDashboard = {
  leadsToday:6, callsMade:18, pendingFollowUps:5,
  overdueFollowUps:1, conversionRate:34,
  wonThisMonth:8, pipelineValue:"₹6.8L",
};

export const managerDashboard = {
  totalLeads:182, activeReps:7, teamConversionRate:33,
  callsToday:117, escalations:3, overdue:9,
  wonThisMonth:52, topPerformer:"Priya Nair",
};

export const directorDashboard = {
  totalRevenue:"₹62.4L", revenueGrowth:"+22%",
  totalLeads:847, conversionRate:33,
  wonDeals:214, lostDeals:58,
  avgDealValue:"₹29,150", forecastThisQuarter:"₹78L",
  teamHealth:89,
};

export const revenueByMonth = [
  { month:"Jan", revenue:32, target:35 },
  { month:"Feb", revenue:38, target:36 },
  { month:"Mar", revenue:41, target:40 },
  { month:"Apr", revenue:36, target:42 },
  { month:"May", revenue:48, target:46 },
  { month:"Jun", revenue:53, target:50 },
];

export const pipelineStages = [
  { stage:"New",       count:47, value:"₹9.8L"  },
  { stage:"Contacted", count:38, value:"₹16.2L" },
  { stage:"Interested",count:29, value:"₹24.5L" },
  { stage:"Follow-up", count:24, value:"₹19.3L" },
  { stage:"Qualified", count:16, value:"₹31.4L" },
  { stage:"Won",       count:14, value:"₹42.1L" },
  { stage:"Lost",      count:9,  value:"—"       },
];

export const escalations = [
  { id:"ESC-01", lead:"Sneha Kulkarni",  rep:"Rohan Mehta",  reason:"Parent joint call rescheduled twice — student getting cold", severity:"High",   raisedAt:"2025-05-26 9:00 AM" },
  { id:"ESC-02", lead:"Deepak Verma",    rep:"Aanya Sharma", reason:"Needs >10% discount approval from manager", severity:"Medium", raisedAt:"2025-05-25 3:30 PM" },
  { id:"ESC-03", lead:"Reema Kapoor",    rep:"Aryan Gupta",  reason:"Scholarship request — needs director approval", severity:"Low",    raisedAt:"2025-05-24 11:00 AM" },
];

// ─── Lead source analysis ────────────────────────────────────────────────────
// Used by the "Top Sources Analysis" panel on the Overview page.
export const leadSources = [
  { source: "Facebook Ad",  leads: 7,  closed: 1, conversionRate: 14 },
  { source: "Google Ad",    leads: 7,  closed: 1, conversionRate: 14 },
  { source: "Referral",     leads: 6,  closed: 1, conversionRate: 17 },
  { source: "Instagram Ad", leads: 5,  closed: 1, conversionRate: 20 },
  { source: "CRM",          leads: 12, closed: 2, conversionRate: 17 },
];
 

export interface LostReason {
  id: string;
  reason: string;
  count: number;
  category: "price" | "timing" | "competitor" | "contact" | "product" | "other";
  trend: "up" | "down" | "flat"; // compared to last month
  repBreakdown: { repName: string; avatar: string; count: number }[];
  examples: string[];
}

export const lostReasons: LostReason[] = [
  {
    id: "lr-1",
    reason: "Price too high / Budget constraints",
    count: 38,
    category: "price",
    trend: "up",
    repBreakdown: [
      { repName: "Kabir Singh", avatar: "KS", count: 12 },
      { repName: "Rohan Mehta", avatar: "RM", count: 9 },
      { repName: "Aryan Gupta", avatar: "AG", count: 8 },
      { repName: "Aanya Sharma", avatar: "AS", count: 5 },
      { repName: "Meera Iyer", avatar: "MI", count: 4 },
    ],
    examples: [
      "Lead said our annual plan is 40% above competitor",
      "SMB segment regularly citing monthly budget cap",
      "Lost Deepak Verma to 30% cheaper alternative",
    ],
  },
  {
    id: "lr-2",
    reason: "Timing not right / Not ready to buy",
    count: 27,
    category: "timing",
    trend: "flat",
    repBreakdown: [
      { repName: "Kabir Singh", avatar: "KS", count: 8 },
      { repName: "Rohan Mehta", avatar: "RM", count: 7 },
      { repName: "Aryan Gupta", avatar: "AG", count: 6 },
      { repName: "Meera Iyer", avatar: "MI", count: 4 },
      { repName: "Divya Reddy", avatar: "DR", count: 2 },
    ],
    examples: [
      "Q2 budget already allocated, revisit in Q3",
      "Merger pending, all vendor decisions on hold",
      "New manager joining next month wants to evaluate",
    ],
  },
  {
    id: "lr-3",
    reason: "Chose a competitor",
    count: 23,
    category: "competitor",
    trend: "up",
    repBreakdown: [
      { repName: "Kabir Singh", avatar: "KS", count: 9 },
      { repName: "Rohan Mehta", avatar: "RM", count: 7 },
      { repName: "Aanya Sharma", avatar: "AS", count: 4 },
      { repName: "Priya Nair", avatar: "PN", count: 3 },
    ],
    examples: [
      "6 leads went to LeadFlow Pro citing better integrations",
      "3 leads chose SalesAce for lower per-seat pricing",
      "Competitor offered free onboarding, we didn't",
    ],
  },
  {
    id: "lr-4",
    reason: "No answer / Went silent after contact",
    count: 19,
    category: "contact",
    trend: "down",
    repBreakdown: [
      { repName: "Rohan Mehta", avatar: "RM", count: 8 },
      { repName: "Kabir Singh", avatar: "KS", count: 5 },
      { repName: "Aryan Gupta", avatar: "AG", count: 4 },
      { repName: "Aanya Sharma", avatar: "AS", count: 2 },
    ],
    examples: [
      "Leads going cold after first call — no callback",
      "Follow-up emails bouncing or ignored",
      "WhatsApp messages read but not replied to",
    ],
  },
  {
    id: "lr-5",
    reason: "Feature / product gaps",
    count: 14,
    category: "product",
    trend: "up",
    repBreakdown: [
      { repName: "Meera Iyer", avatar: "MI", count: 5 },
      { repName: "Divya Reddy", avatar: "DR", count: 4 },
      { repName: "Priya Nair", avatar: "PN", count: 3 },
      { repName: "Aanya Sharma", avatar: "AS", count: 2 },
    ],
    examples: [
      "Missing CRM integration (Zoho) cited 4 times",
      "No WhatsApp automation — critical for this segment",
      "Custom reporting requested but not available",
    ],
  },
  {
    id: "lr-6",
    reason: "Already has a solution they're happy with",
    count: 11,
    category: "other",
    trend: "flat",
    repBreakdown: [
      { repName: "Kabir Singh", avatar: "KS", count: 4 },
      { repName: "Aryan Gupta", avatar: "AG", count: 3 },
      { repName: "Rohan Mehta", avatar: "RM", count: 2 },
      { repName: "Meera Iyer", avatar: "MI", count: 2 },
    ],
    examples: [
      "Long-term contract with existing vendor",
      "Not enough pain points to justify switching",
    ],
  },
];