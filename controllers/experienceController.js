import { ObjectId } from "mongodb";
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

async function getAllExperiences(req, res) {
  try {
    const db = await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const experiences = await db
      .collection("interviewExperiences")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db
      .collection("interviewExperiences")
      .countDocuments({});

    res.json({
      experiences,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
}

async function getExperienceById(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const db = await connectDB();
    const experience = await db
      .collection("interviewExperiences")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch experience" });
  }
}

export { createExperience, getAllExperiences, getExperienceById };
