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

async function updateExperience(req, res) {
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

    if (experience.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only edit your own experiences" });
    }

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

    const updates = {
      ...(company && { company: company.trim() }),
      ...(role && { role: role.trim() }),
      ...(interviewRound && { interviewRound }),
      ...(interviewFormat !== undefined && { interviewFormat }),
      ...(questionThemes && { questionThemes }),
      ...(difficultyLevel && { difficultyLevel }),
      ...(formatNotes !== undefined && { formatNotes }),
      ...(caughtOffGuardNotes !== undefined && { caughtOffGuardNotes }),
      ...(outcomeTag && { outcomeTag }),
      ...(experienceDate && { experienceDate: new Date(experienceDate) }),
      ...(isAnonymous !== undefined && { isAnonymous: !!isAnonymous }),
      updatedAt: new Date(),
    };

    await db
      .collection("interviewExperiences")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    const updated = await db
      .collection("interviewExperiences")
      .findOne({ _id: new ObjectId(req.params.id) });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update experience" });
  }
}

async function deleteExperience(req, res) {
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

    if (experience.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own experiences" });
    }

    await db
      .collection("interviewExperiences")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete experience" });
  }
}

async function getMyExperiences(req, res) {
  try {
    const db = await connectDB();
    const experiences = await db
      .collection("interviewExperiences")
      .find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ experiences });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your experiences" });
  }
}

export {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  getMyExperiences,
};
