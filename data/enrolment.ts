export type EnrolledLead = {
  id: string;
  name: string;
  service: string;
  rep: string;
  repAvatar: string;
  enrolledOn: string;
  fee: number;
  paymentStatus: "Paid" | "Partial" | "Pending";
  batch: string;
  city: string;
  contact: string;
  email: string;
  dob: string;
  gender: string;
  documents: string[];
  paymentHistory: { date: string; amount: number; mode: string; ref: string }[];
  batchStartDate: string;
  batchEndDate: string;
  classTimings: string;
  counsellorNotes: string;
  // Note written by the sales rep on the lead detail page.
  // Shown READ-ONLY inside the operations panel.
  salesRepNote: string;
  // The single payment operations/admissions actually cares about:
  // the first / token / admission payment that confirms the seat.
  admissionPayment: {
    amount: number;
    status: "Paid" | "Partial" | "Pending";
    paidOn: string | null;
    mode: string;
  };
  kitStatus: "Dispatched" | "Pending" | "Not Dispatched";
  onboardingSteps: { label: string; done: boolean }[];
};

export const enrolledLeads: EnrolledLead[] = [
  {
    id: "e1", name: "Rahul Verma", service: "MBA Prep", rep: "Aanya Sharma", repAvatar: "AS",
    enrolledOn: "2025-05-27", fee: 28000, paymentStatus: "Paid", batch: "June A", city: "Delhi",
    contact: "9810012345", email: "rahul.verma@gmail.com", dob: "1999-03-14", gender: "Male",
    documents: ["ID Proof ✓", "Photo ✓", "10th Marksheet ✓", "12th Marksheet ✓"],
    paymentHistory: [{ date: "2025-05-27", amount: 28000, mode: "UPI", ref: "TXN9810001" }],
    batchStartDate: "2025-06-01", batchEndDate: "2025-08-31", classTimings: "Mon–Fri, 7:00–9:00 AM",
    counsellorNotes: "Student is highly motivated. Aiming for top-10 B-schools.",
    salesRepNote: "Spoke to Rahul twice before he committed. Compared us against 2 competitors — converted on the scholarship angle. Slightly price-sensitive. Wants weekend doubt-clearing, told him we'd check feasibility.",
    admissionPayment: { amount: 10000, status: "Paid", paidOn: "2025-05-27", mode: "UPI" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e2", name: "Sneha Kapoor", service: "CA Foundation", rep: "Rohan Mehta", repAvatar: "RM",
    enrolledOn: "2025-05-26", fee: 18500, paymentStatus: "Partial", batch: "June B", city: "Mumbai",
    contact: "9820023456", email: "sneha.kapoor@outlook.com", dob: "2001-07-22", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✓", "10th Marksheet ✗", "12th Marksheet ✗"],
    paymentHistory: [{ date: "2025-05-26", amount: 10000, mode: "Bank Transfer", ref: "TXN9820001" }],
    batchStartDate: "2025-06-05", batchEndDate: "2025-09-05", classTimings: "Tue–Sat, 6:00–8:00 PM",
    counsellorNotes: "Balance ₹8,500 due by June 1. Follow up on documents.",
    salesRepNote: "Sneha's father is the decision-maker on the call. Closed on the EMI option. She committed to clearing the balance and pending marksheets by month-end. Family is cost-conscious — keep the tone gentle.",
    admissionPayment: { amount: 10000, status: "Paid", paidOn: "2025-05-26", mode: "Bank Transfer" },
    kitStatus: "Pending",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: false },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e3", name: "Amit Joshi", service: "UPSC Mains", rep: "Priya Nair", repAvatar: "PN",
    enrolledOn: "2025-05-25", fee: 35000, paymentStatus: "Paid", batch: "June A", city: "Bangalore",
    contact: "9830034567", email: "amit.joshi@yahoo.com", dob: "1997-11-05", gender: "Male",
    documents: ["ID Proof ✓", "Photo ✓", "10th Marksheet ✓", "12th Marksheet ✓", "Graduation ✓"],
    paymentHistory: [
      { date: "2025-05-25", amount: 20000, mode: "UPI", ref: "TXN9830001" },
      { date: "2025-05-26", amount: 15000, mode: "UPI", ref: "TXN9830002" },
    ],
    batchStartDate: "2025-06-01", batchEndDate: "2025-11-30", classTimings: "Mon–Sat, 8:00–10:00 AM",
    counsellorNotes: "Third attempt. Very determined. Assign mentor for essay writing.",
    salesRepNote: "Amit has been with two other institutes before — knows exactly what he wants. Sold on our mentor-led essay programme. Decisive, minimal hand-holding needed. Paid the token same day.",
    admissionPayment: { amount: 10000, status: "Paid", paidOn: "2025-05-25", mode: "UPI" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: true },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e4", name: "Pooja Iyer", service: "Data Science", rep: "Aanya Sharma", repAvatar: "AS",
    enrolledOn: "2025-05-24", fee: 42000, paymentStatus: "Paid", batch: "July A", city: "Chennai",
    contact: "9840045678", email: "pooja.iyer@gmail.com", dob: "2000-01-30", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✓", "Graduation ✓"],
    paymentHistory: [{ date: "2025-05-24", amount: 42000, mode: "Credit Card", ref: "TXN9840001" }],
    batchStartDate: "2025-07-01", batchEndDate: "2025-10-31", classTimings: "Mon–Fri, 7:00–9:00 PM",
    counsellorNotes: "Background in statistics. Fast learner — place in advanced track.",
    salesRepNote: "Pooja reached out herself after a webinar — barely needed convincing. Strong stats background. Asked hard questions about placement numbers, shared the FY24 report. Hot referral source, mentioned 3 interested friends.",
    admissionPayment: { amount: 12000, status: "Paid", paidOn: "2025-05-24", mode: "Credit Card" },
    kitStatus: "Not Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e5", name: "Karan Malhotra", service: "MBA Prep", rep: "Meera Iyer", repAvatar: "MI",
    enrolledOn: "2025-05-23", fee: 28000, paymentStatus: "Partial", batch: "June A", city: "Pune",
    contact: "9850056789", email: "karan.m@hotmail.com", dob: "1998-06-18", gender: "Male",
    documents: ["ID Proof ✓", "Photo ✓", "10th Marksheet ✗"],
    paymentHistory: [{ date: "2025-05-23", amount: 14000, mode: "UPI", ref: "TXN9850001" }],
    batchStartDate: "2025-06-01", batchEndDate: "2025-08-31", classTimings: "Mon–Fri, 7:00–9:00 AM",
    counsellorNotes: "Balance ₹14,000 due. 10th marksheet missing. Contact before June 1.",
    salesRepNote: "Karan went quiet for a week mid-conversation, re-engaged after the demo class. Paid the admission part but still owes balance — asked for a few days. Follow up gently, don't push hard or he stalls.",
    admissionPayment: { amount: 14000, status: "Paid", paidOn: "2025-05-23", mode: "UPI" },
    kitStatus: "Pending",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: false },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e6", name: "Divya Chauhan", service: "Full Stack Dev", rep: "Kabir Singh", repAvatar: "KS",
    enrolledOn: "2025-05-22", fee: 55000, paymentStatus: "Paid", batch: "June C", city: "Hyderabad",
    contact: "9860067890", email: "divya.c@gmail.com", dob: "1999-09-25", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✓", "Graduation ✓", "Resume ✓"],
    paymentHistory: [{ date: "2025-05-22", amount: 55000, mode: "Bank Transfer", ref: "TXN9860001" }],
    batchStartDate: "2025-06-10", batchEndDate: "2025-12-10", classTimings: "Mon–Sat, 9:00 AM–1:00 PM",
    counsellorNotes: "2 yrs work exp. Wants job placement support. Tag for placement drive.",
    salesRepNote: "Divya is a working professional — decision came quick once we confirmed weekend timings + placement support. Paid in full upfront. Very low-maintenance, high-intent lead.",
    admissionPayment: { amount: 15000, status: "Paid", paidOn: "2025-05-22", mode: "Bank Transfer" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: true },
      { label: "Orientation completed",    done: true },
    ],
  },
  {
    id: "e7", name: "Naveen Kumar", service: "CA Foundation", rep: "Aryan Gupta", repAvatar: "AG",
    enrolledOn: "2025-05-21", fee: 18500, paymentStatus: "Pending", batch: "July B", city: "Delhi",
    contact: "9870078901", email: "naveen.k@gmail.com", dob: "2002-02-10", gender: "Male",
    documents: ["ID Proof ✗", "Photo ✓"],
    paymentHistory: [],
    batchStartDate: "2025-07-10", batchEndDate: "2025-10-10", classTimings: "Tue–Sat, 6:00–8:00 PM",
    counsellorNotes: "Payment not received. ID proof missing. Risk of no-show.",
    salesRepNote: "Naveen is a student, budget is tight and parents aren't fully on board yet. Verbal yes but no payment. High flight-risk — wouldn't block a confirmed seat until the token comes in.",
    admissionPayment: { amount: 8000, status: "Pending", paidOn: null, mode: "—" },
    kitStatus: "Not Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: false },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e8", name: "Riya Saxena", service: "UPSC Prelims", rep: "Divya Reddy", repAvatar: "DR",
    enrolledOn: "2025-05-20", fee: 22000, paymentStatus: "Paid", batch: "June B", city: "Jaipur",
    contact: "9880089012", email: "riya.s@outlook.com", dob: "1998-12-03", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✓", "Graduation ✓"],
    paymentHistory: [{ date: "2025-05-20", amount: 22000, mode: "UPI", ref: "TXN9880001" }],
    batchStartDate: "2025-06-05", batchEndDate: "2025-09-05", classTimings: "Mon–Fri, 6:00–8:00 AM",
    counsellorNotes: "Good academic background. First attempt. Assign study plan.",
    salesRepNote: "Riya compared us mainly on faculty quality. Closed after the free counselling session. First-attempt aspirant — needs reassurance more than discounts. Smooth close.",
    admissionPayment: { amount: 8000, status: "Paid", paidOn: "2025-05-20", mode: "UPI" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: true },
      { label: "Orientation completed",    done: true },
    ],
  },
  {
    id: "e9", name: "Ankit Sharma", service: "Data Science", rep: "Rohan Mehta", repAvatar: "RM",
    enrolledOn: "2025-05-19", fee: 42000, paymentStatus: "Partial", batch: "July A", city: "Kolkata",
    contact: "9890090123", email: "ankit.s@gmail.com", dob: "1999-08-15", gender: "Male",
    documents: ["ID Proof ✓", "Photo ✓", "Graduation ✗"],
    paymentHistory: [{ date: "2025-05-19", amount: 21000, mode: "UPI", ref: "TXN9890001" }],
    batchStartDate: "2025-07-01", batchEndDate: "2025-10-31", classTimings: "Mon–Fri, 7:00–9:00 PM",
    counsellorNotes: "Balance ₹21,000 pending. Graduation certificate not yet submitted.",
    salesRepNote: "Ankit negotiated hard on price, settled on a 2-part plan. Paid the first part. Graduation cert still pending from his side. Responsive on WhatsApp, just slow with paperwork.",
    admissionPayment: { amount: 12000, status: "Paid", paidOn: "2025-05-19", mode: "UPI" },
    kitStatus: "Pending",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: false },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e10", name: "Simran Bhatia", service: "Full Stack Dev", rep: "Priya Nair", repAvatar: "PN",
    enrolledOn: "2025-05-18", fee: 55000, paymentStatus: "Paid", batch: "June C", city: "Ahmedabad",
    contact: "9900001234", email: "simran.b@gmail.com", dob: "2000-04-20", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✓", "Graduation ✓", "Resume ✓"],
    paymentHistory: [{ date: "2025-05-18", amount: 55000, mode: "Credit Card", ref: "TXN9900001" }],
    batchStartDate: "2025-06-10", batchEndDate: "2025-12-10", classTimings: "Mon–Sat, 9:00 AM–1:00 PM",
    counsellorNotes: "Fresher. Keen on frontend. Assign to React-focused track.",
    salesRepNote: "Simran is a fresher, very excited about the frontend track. Mum was on the call and both were aligned. Quick full payment. Great candidate for a testimonial later.",
    admissionPayment: { amount: 15000, status: "Paid", paidOn: "2025-05-18", mode: "Credit Card" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: true },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e11", name: "Tarun Mehta", service: "MBA Prep", rep: "Aanya Sharma", repAvatar: "AS",
    enrolledOn: "2025-05-17", fee: 28000, paymentStatus: "Paid", batch: "June A", city: "Lucknow",
    contact: "9911012345", email: "tarun.m@gmail.com", dob: "1998-01-12", gender: "Male",
    documents: ["ID Proof ✓", "Photo ✓", "10th Marksheet ✓", "12th Marksheet ✓"],
    paymentHistory: [{ date: "2025-05-17", amount: 28000, mode: "UPI", ref: "TXN9911001" }],
    batchStartDate: "2025-06-01", batchEndDate: "2025-08-31", classTimings: "Mon–Fri, 7:00–9:00 AM",
    counsellorNotes: "Second MBA attempt. Strong GK. Needs verbal coaching.",
    salesRepNote: "Tarun is a repeat-attempt lead who came back to us specifically. Knows the drill. Sold on the verbal coaching add-on. Easy, renewal-style close — paid in full.",
    admissionPayment: { amount: 10000, status: "Paid", paidOn: "2025-05-17", mode: "UPI" },
    kitStatus: "Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: true },
      { label: "Welcome kit sent",         done: true },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
  {
    id: "e12", name: "Preethi Nair", service: "UPSC Mains", rep: "Meera Iyer", repAvatar: "MI",
    enrolledOn: "2025-05-16", fee: 35000, paymentStatus: "Pending", batch: "July A", city: "Kochi",
    contact: "9922023456", email: "preethi.n@gmail.com", dob: "1996-05-30", gender: "Female",
    documents: ["ID Proof ✓", "Photo ✗"],
    paymentHistory: [],
    batchStartDate: "2025-07-01", batchEndDate: "2025-11-30", classTimings: "Mon–Sat, 8:00–10:00 AM",
    counsellorNotes: "Payment not received. Photo missing. Follow up urgently.",
    salesRepNote: "Preethi is keen but stuck on funds — waiting on a loan approval, so no payment yet. Genuine intent, just a timing issue. Worth a personal follow-up call this week.",
    admissionPayment: { amount: 10000, status: "Pending", paidOn: null, mode: "—" },
    kitStatus: "Not Dispatched",
    onboardingSteps: [
      { label: "Enrolment form submitted", done: true },
      { label: "Fee payment confirmed",    done: false },
      { label: "Welcome kit sent",         done: false },
      { label: "LMS access granted",       done: false },
      { label: "Orientation completed",    done: false },
    ],
  },
];

export const PAYMENT_COLORS: Record<string, string> = {
  Paid:    "#059669",
  Partial: "#d97706",
  Pending: "#dc2626",
};

export const AVATAR_PALETTE = [
  { bg: "#dbeafe", text: "#1d4ed8" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fef3c7", text: "#92400e" },
  { bg: "#ede9fe", text: "#5b21b6" },
  { bg: "#fee2e2", text: "#991b1b" },
  { bg: "#fce7f3", text: "#9d174d" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fff7ed", text: "#9a3412" },
  { bg: "#dbeafe", text: "#1e40af" },
  { bg: "#ecfdf5", text: "#065f46" },
  { bg: "#fef9c3", text: "#713f12" },
  { bg: "#f3e8ff", text: "#6b21a8" },
];