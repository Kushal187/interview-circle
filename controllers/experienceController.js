import connectDB from "../db/connectDB.js";

async function createExperience(req, res) {
  try {
    const {
      company,
      role,
      interviewRound,
      interviewFormat,
      questionThemes,
      difficultyLevel,
      formatNotes,
      caughtOffGuardNotes,
      outcomeTag,
      experienceDate,
      isAnonymous,
    } = req.body;

    if (!company || !role || !interviewRound || !difficultyLevel) {
      return res
        .status(400)
        .json({ error: "Company, role, round, and difficulty are required" });
    }

    const db = await connectDB();
    const now = new Date();

    const doc = {
      company: company.trim(),
      role: role.trim(),
      interviewRound,
      interviewFormat: interviewFormat || "",
      questionThemes: questionThemes || [],
      difficultyLevel,
      formatNotes: formatNotes || "",
      caughtOffGuardNotes: caughtOffGuardNotes || "",
      outcomeTag: outcomeTag || "Pending",
      experienceDate: experienceDate ? new Date(experienceDate) : now,
      isAnonymous: !!isAnonymous,
      createdBy: req.user._id,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("interviewExperiences").insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create experience" });
  }
}

export { createExperience };
