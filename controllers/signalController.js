import { ObjectId } from "mongodb";
import connectDB from "../db/connectDB.js";

async function getSignals(req, res) {
  try {
    const db = await connectDB();
    const { experienceId } = req.params;

    if (!ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const expObjId = new ObjectId(experienceId);

    const aggResult = await db
      .collection("experienceSignals")
      .aggregate([
        { $match: { experienceId: expObjId } },
        {
          $group: {
            _id: null,
            helpfulCount: { $sum: { $cond: ["$helpful", 1, 0] } },
            outdatedCount: { $sum: { $cond: ["$outdated", 1, 0] } },
          },
        },
      ])
      .toArray();

    const counts = aggResult[0] || { helpfulCount: 0, outdatedCount: 0 };

    let userSignal = null;
    if (req.user) {
      userSignal = await db.collection("experienceSignals").findOne({
        experienceId: expObjId,
        userId: new ObjectId(req.user._id),
      });
    }

    res.json({
      helpfulCount: counts.helpfulCount,
      outdatedCount: counts.outdatedCount,
      userSignal,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch signals" });
  }
}

async function createSignal(req, res) {
  try {
    const db = await connectDB();
    const { experienceId, helpful, outdated } = req.body;

    if (!experienceId || !ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Valid experienceId is required" });
    }

    const expObjId = new ObjectId(experienceId);
    const userObjId = new ObjectId(req.user._id);

    const experience = await db
      .collection("interviewExperiences")
      .findOne({ _id: expObjId });

    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const existing = await db.collection("experienceSignals").findOne({
      experienceId: expObjId,
      userId: userObjId,
    });

    if (existing) {
      return res.status(409).json({
        error:
          "You already have a signal for this experience. Use PUT to update.",
      });
    }

    const now = new Date();
    const doc = {
      experienceId: expObjId,
      userId: userObjId,
      helpful: Boolean(helpful),
      outdated: Boolean(outdated),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("experienceSignals").insertOne(doc);

    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch {
    res.status(500).json({ error: "Failed to create signal" });
  }
}

async function updateSignal(req, res) {
  try {
    const db = await connectDB();
    const { experienceId } = req.params;
    const { helpful, outdated } = req.body;

    if (!ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const expObjId = new ObjectId(experienceId);
    const userObjId = new ObjectId(req.user._id);

    const existing = await db.collection("experienceSignals").findOne({
      experienceId: expObjId,
      userId: userObjId,
    });

    if (!existing) {
      return res.status(404).json({ error: "Signal not found" });
    }

    const updates = {
      ...(helpful !== undefined && { helpful: Boolean(helpful) }),
      ...(outdated !== undefined && { outdated: Boolean(outdated) }),
      updatedAt: new Date(),
    };

    await db
      .collection("experienceSignals")
      .updateOne({ _id: existing._id }, { $set: updates });

    const updated = await db
      .collection("experienceSignals")
      .findOne({ _id: existing._id });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update signal" });
  }
}

async function deleteSignal(req, res) {
  try {
    const db = await connectDB();
    const { experienceId } = req.params;

    if (!ObjectId.isValid(experienceId)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const result = await db.collection("experienceSignals").deleteOne({
      experienceId: new ObjectId(experienceId),
      userId: new ObjectId(req.user._id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Signal not found" });
    }

    res.json({ message: "Signal removed" });
  } catch {
    res.status(500).json({ error: "Failed to delete signal" });
  }
}

export { getSignals, createSignal, updateSignal, deleteSignal };
