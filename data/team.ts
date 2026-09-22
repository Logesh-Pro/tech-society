export type TeamMember = {
  category: string;
  name: string;
  role: string;
  department?: string;
  year?: string;
  linkedin?: string;
  email?: string;
  image?: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  // FACULTY
  {
    category: "FACULTY",
    name: "C. Obed Otto",
    role: "Dean - ICT / Community Head - Tech Society",
  },
  {
    category: "FACULTY",
    name: "Jayanthi G",
    role: "Faculty Coordinator",
  },

  // CENTRAL LEADERSHIP TEAM
  {
    category: "CENTRAL LEADERSHIP",
    name: "Thirunavukkarasu M",
    role: "Coordinator",
    department: "IT",
    year: "III",
  },
  {
    category: "CENTRAL LEADERSHIP",
    name: "Hariharan Ganesh",
    role: "Assistant Coordinator",
    department: "CSE",
    year: "II",
  },
  {
    category: "CENTRAL LEADERSHIP",
    name: "Yogeswari M.",
    role: "Assistant Coordinator",
    department: "CSE",
    year: "III",
  },
  {
    category: "CENTRAL LEADERSHIP",
    name: "Ramitha Chowdary S",
    role: "Assistant Coordinator",
    department: "AIML",
    year: "III",
  },

  // MACHINE LEARNING DOMAIN
  {
    category: "MACHINE LEARNING",
    name: "Popuri Sahithya",
    role: "Secretary",
    department: "AIML",
    year: "II",
  },
  {
    category: "MACHINE LEARNING",
    name: "Santhosh K",
    role: "Joint Secretary",
    department: "CSE",
    year: "II",
  },
  {
    category: "MACHINE LEARNING",
    name: "Markandeyan Gokul",
    role: "Joint Secretary",
    department: "AIML",
    year: "III",
  },
  {
    category: "MACHINE LEARNING",
    name: "Subashini K",
    role: "Joint Secretary",
    department: "AIML",
    year: "II",
  },

  // INTELLIGENT SYSTEMS DOMAIN
  {
    category: "INTELLIGENT SYSTEMS",
    name: "Deepak V.",
    role: "Secretary",
    department: "AIDS",
    year: "II",
  },
  {
    category: "INTELLIGENT SYSTEMS",
    name: "Enbanathan V",
    role: "Joint Secretary",
    department: "IT",
    year: "III",
  },
  {
    category: "INTELLIGENT SYSTEMS",
    name: "Kabelan G K",
    role: "Joint Secretary",
    department: "CSE (IoT)",
    year: "III",
  },
  {
    category: "INTELLIGENT SYSTEMS",
    name: "Pranav Bhargav M",
    role: "Joint Secretary",
    department: "CSE",
    year: "III",
  },

  // WEB DEVELOPMENT DOMAIN
  {
    category: "WEB DEVELOPMENT",
    name: "Logesh B",
    role: "Secretary",
    department: "CSE (IoT)",
    year: "III",
  },
  {
    category: "WEB DEVELOPMENT",
    name: "Thangapazham P",
    role: "Joint Secretary",
    department: "CSE",
    year: "II",
  },
  {
    category: "WEB DEVELOPMENT",
    name: "Dhanushkumar Sivakumar",
    role: "Joint Secretary",
    department: "CSE",
    year: "III",
  },
  {
    category: "WEB DEVELOPMENT",
    name: "Yuuvasri R",
    role: "Joint Secretary",
    department: "AIDS",
    year: "II",
  },

  // GAME & APP DEVELOPMENT DOMAIN
  {
    category: "GAME & APP DEVELOPMENT",
    name: "Vikash S",
    role: "Secretary",
    department: "AIDS",
    year: "II",
  },
  {
    category: "GAME & APP DEVELOPMENT",
    name: "Kathiresh M",
    role: "Joint Secretary",
    department: "AIML",
    year: "III",
  },
  {
    category: "GAME & APP DEVELOPMENT",
    name: "Nivedhitha S R",
    role: "Joint Secretary",
    department: "AIML",
    year: "II",
  },
  {
    category: "GAME & APP DEVELOPMENT",
    name: "Sanjai U",
    role: "Joint Secretary",
    department: "AIML",
    year: "III",
  },

  // CYBER SECURITY DOMAIN
  {
    category: "CYBER SECURITY",
    name: "Naveen Jaisanker",
    role: "Secretary",
    department: "CSE (IoT)",
    year: "III",
  },
  {
    category: "CYBER SECURITY",
    name: "Adithya N M",
    role: "Joint Secretary",
    department: "CSE",
    year: "II",
  },
  {
    category: "CYBER SECURITY",
    name: "Abinav Aaditya",
    role: "Joint Secretary",
    department: "CSE",
    year: "III",
  },
  {
    category: "CYBER SECURITY",
    name: "Mithun Sai P",
    role: "Joint Secretary",
    department: "CSE (CS)",
    year: "II",
  },
];
