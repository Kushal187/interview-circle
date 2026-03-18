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
  } catch {
    res.status(500).json({ error: "Failed to create experience" });
  }
}

async function getAllExperiences(req, res) {
  try {
    const db = await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "newest";

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = {};

    if (req.query.company) {
      filter.company = {
        $regex: escapeRegex(req.query.company),
        $options: "i",
      };
    }
    if (req.query.role) {
      filter.role = { $regex: escapeRegex(req.query.role), $options: "i" };
    }
    if (req.query.round) {
      filter.interviewRound = req.query.round;
    }

    if (sort === "helpful") {
      const pipeline = [
        { $match: filter },
        {
          $lookup: {
            from: "experienceSignals",
            localField: "_id",
            foreignField: "experienceId",
            as: "signals",
          },
        },
        {
          $addFields: {
            helpfulCount: {
              $size: {
                $filter: {
                  input: "$signals",
                  cond: { $eq: ["$$this.helpful", true] },
                },
              },
            },
            outdatedCount: {
              $size: {
                $filter: {
                  input: "$signals",
                  cond: { $eq: ["$$this.outdated", true] },
                },
              },
            },
          },
        },
        { $sort: { helpfulCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { signals: 0 } },
      ];

      const experiences = await db
        .collection("interviewExperiences")
        .aggregate(pipeline)
        .toArray();

      const total = await db
        .collection("interviewExperiences")
        .countDocuments(filter);

      return res.json({
        experiences,
        page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    }

    const experiences = await db
      .collection("interviewExperiences")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // attach signal counts for default sort too
    const expIds = experiences.map((e) => e._id);
    const signalAgg = await db
      .collection("experienceSignals")
      .aggregate([
        { $match: { experienceId: { $in: expIds } } },
        {
          $group: {
            _id: "$experienceId",
            helpfulCount: { $sum: { $cond: ["$helpful", 1, 0] } },
            outdatedCount: { $sum: { $cond: ["$outdated", 1, 0] } },
          },
        },
      ])
      .toArray();

    const signalMap = {};
    for (const s of signalAgg) {
      signalMap[s._id.toString()] = s;
    }

    const enriched = experiences.map((e) => {
      const sig = signalMap[e._id.toString()];
      return {
        ...e,
        helpfulCount: sig?.helpfulCount || 0,
        outdatedCount: sig?.outdatedCount || 0,
      };
    });

    const total = await db
      .collection("interviewExperiences")
      .countDocuments(filter);

    res.json({
      experiences: enriched,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
}

async function getExperienceById(req, res) {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const db = await connectDB();
    const results = await db
      .collection("interviewExperiences")
      .aggregate([
        { $match: { _id: new ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $addFields: {
            username: { $arrayElemAt: ["$author.username", 0] },
          },
        },
        { $project: { author: 0 } },
      ])
      .toArray();

    if (results.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    res.json(results[0]);
  } catch {
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
  } catch {
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

    const expObjId = new ObjectId(req.params.id);

    await db.collection("interviewExperiences").deleteOne({ _id: expObjId });
    await db
      .collection("experienceSignals")
      .deleteMany({ experienceId: expObjId });

    res.json({ message: "Experience deleted" });
  } catch {
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
  } catch {
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
