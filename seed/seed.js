import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const COMPANIES = [
  "Google",
  "Amazon",
  "Meta",
  "Apple",
  "Microsoft",
  "Netflix",
  "Uber",
  "Lyft",
  "Airbnb",
  "Stripe",
  "Coinbase",
  "Dropbox",
  "LinkedIn",
  "Snap",
  "Pinterest",
  "Spotify",
  "Salesforce",
  "Adobe",
  "Oracle",
  "IBM",
  "Intel",
  "NVIDIA",
  "Tesla",
  "Bloomberg",
  "Goldman Sachs",
  "JPMorgan",
  "Morgan Stanley",
  "Capital One",
  "Visa",
  "PayPal",
  "Square",
  "Robinhood",
  "Palantir",
  "Databricks",
  "Snowflake",
  "MongoDB",
  "Figma",
  "Notion",
  "Slack",
  "Zoom",
  "Twilio",
  "Cloudflare",
  "DoorDash",
  "Instacart",
  "Reddit",
  "Discord",
  "Roblox",
  "Epic Games",
];

const ROLES = [
  "Software Engineer Intern",
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "iOS Developer",
  "Android Developer",
  "Product Manager Intern",
  "Data Analyst",
  "QA Engineer",
  "Security Engineer",
  "Site Reliability Engineer",
];

const ROUNDS = [
  "Phone Screen",
  "Online Assessment",
  "Onsite",
  "Take Home",
  "Final Round",
  "Other",
];

const FORMATS = [
  "Technical",
  "Behavioral",
  "System Design",
  "Live Coding",
  "Mixed",
  "Other",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const OUTCOMES = ["Accepted", "Rejected", "Ghosted", "Pending"];

const THEME_POOL = [
  "arrays",
  "strings",
  "hash maps",
  "linked lists",
  "trees",
  "graphs",
  "dynamic programming",
  "recursion",
  "binary search",
  "sorting",
  "BFS",
  "DFS",
  "greedy",
  "sliding window",
  "two pointers",
  "stack",
  "queue",
  "heap",
  "trie",
  "union find",
  "bit manipulation",
  "math",
  "backtracking",
  "topological sort",
  "system design",
  "OOP",
  "API design",
  "database design",
  "concurrency",
  "networking",
  "operating systems",
  "behavioral",
  "leadership",
  "teamwork",
  "conflict resolution",
  "time management",
  "communication",
  "problem solving",
];

const FORMAT_NOTES = [
  "45-minute coding session on shared editor. Interviewer was friendly and gave hints when I got stuck.",
  "Two back-to-back coding rounds, 30 minutes each. No breaks between rounds.",
  "90-minute take-home assessment with 3 problems. Had to submit within the time limit.",
  "Panel interview with 3 engineers. Each asked different types of questions.",
  "Whiteboard coding session followed by Q&A about my resume projects.",
  "Virtual interview on Zoom. Used CoderPad for the coding portion.",
  "30-minute phone screen with a recruiter, then a technical question at the end.",
  "Full day onsite with 4 rounds: 2 coding, 1 system design, 1 behavioral.",
  "HackerRank assessment with 2 medium and 1 hard problem. 90-minute time limit.",
  "Casual conversation about past projects followed by a live coding exercise.",
  "Started with introductions, then jumped straight into a coding problem.",
  "Group interview with other candidates. Had to solve a problem collaboratively.",
  "Standard 1-hour technical interview. 15 min intro, 40 min coding, 5 min questions.",
  "Two-round virtual onsite. First round was DSA, second was system design.",
  "Take-home project due in 48 hours. Built a small REST API with tests.",
];

const OFF_GUARD = [
  "They asked about a technology I had not used before.",
  "The system design question was way more open-ended than I expected.",
  "They asked me to optimize my solution to O(n) and I struggled.",
  "Unexpected behavioral question in what I thought was a purely technical round.",
  "They dove deep into distributed systems concepts I was not prepared for.",
  "The interviewer wanted me to write actual compilable code, not pseudocode.",
  "They asked about my GPA and specific coursework which I did not expect.",
  "Had to design an API from scratch with very vague requirements.",
  "The follow-up questions on my coding solution were harder than the initial problem.",
  "They tested me on SQL which was not mentioned in the job description.",
  "",
  "",
  "",
  "",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  console.log("Clearing existing data...");
  await db.collection("users").deleteMany({});
  await db.collection("interviewExperiences").deleteMany({});
  await db.collection("experienceSignals").deleteMany({});

  console.log("Creating indexes...");
  await db.collection("users").createIndex({ username: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("interviewExperiences").createIndex({ company: 1 });
  await db.collection("interviewExperiences").createIndex({ role: 1 });
  await db.collection("interviewExperiences").createIndex({ createdBy: 1 });
  await db.collection("interviewExperiences").createIndex({ createdAt: -1 });
  await db
    .collection("experienceSignals")
    .createIndex({ experienceId: 1, userId: 1 }, { unique: true });

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const usernames = [
    "alex_chen",
    "maria_garcia",
    "james_wilson",
    "priya_patel",
    "david_kim",
    "sarah_johnson",
    "omar_hassan",
    "emily_zhang",
    "carlos_rivera",
    "aisha_mohammed",
    "ryan_murphy",
    "lisa_nguyen",
    "kevin_brown",
    "nina_kowalski",
    "tyler_davis",
    "maya_sharma",
    "jordan_lee",
    "rachel_cohen",
    "samuel_jackson",
    "hannah_mueller",
    "sanjeev",
    "harsh",
  ];

  const userDocs = usernames.map((username) => {
    const now = randomDate(2024, 2025);
    return {
      username,
      email: `${username}@example.com`,
      hashedPassword,
      createdAt: now,
      updatedAt: now,
    };
  });

  const userResult = await db.collection("users").insertMany(userDocs);
  const userIds = Object.values(userResult.insertedIds);
  console.log(`  ${userIds.length} users created`);

  console.log("Seeding interview experiences...");
  const experienceDocs = [];
  for (let i = 0; i < 1050; i++) {
    const createdBy = randomItem(userIds);
    const expDate = randomDate(2023, 2026);
    const createdAt = new Date(
      expDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000,
    );

    experienceDocs.push({
      company: randomItem(COMPANIES),
      role: randomItem(ROLES),
      interviewRound: randomItem(ROUNDS),
      interviewFormat: randomItem(FORMATS),
      questionThemes: randomSubset(THEME_POOL, 1, 5),
      difficultyLevel: randomItem(DIFFICULTIES),
      formatNotes: randomItem(FORMAT_NOTES),
      caughtOffGuardNotes: randomItem(OFF_GUARD),
      outcomeTag: randomItem(OUTCOMES),
      experienceDate: expDate,
      isAnonymous: Math.random() < 0.3,
      createdBy,
      createdAt,
      updatedAt: createdAt,
    });
  }

  const expResult = await db
    .collection("interviewExperiences")
    .insertMany(experienceDocs);
  const expIds = Object.values(expResult.insertedIds);
  console.log(`  ${expIds.length} interview experiences created`);

  console.log("Seeding experience signals...");
  const signalDocs = [];
  const signalSet = new Set();

  for (let i = 0; i < 3000; i++) {
    const experienceId = randomItem(expIds);
    const userId = randomItem(userIds);
    const key = `${experienceId}-${userId}`;

    if (signalSet.has(key)) continue;
    signalSet.add(key);

    const now = randomDate(2024, 2026);
    signalDocs.push({
      experienceId,
      userId,
      helpful: Math.random() < 0.6,
      outdated: Math.random() < 0.15,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (signalDocs.length > 0) {
    await db.collection("experienceSignals").insertMany(signalDocs);
  }
  console.log(`  ${signalDocs.length} experience signals created`);

  console.log("\nSeed complete!");
  console.log(
    "Default login: any username from the list with password 'password123'",
  );
  console.log("Example: username=sanjeev, password=password123");

  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
