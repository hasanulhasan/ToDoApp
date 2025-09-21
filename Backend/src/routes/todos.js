const express = require("express");
const router = express.Router();
const { body, validationResult, query } = require("express-validator");
const auth = require("../middleware/auth");
const Todo = require("../models/Todo");

// Create Todo
router.post(
  "/",
  body("title").notEmpty().withMessage("title required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, status, priority, tags, dueDate } = req.body;

      const todo = new Todo({
        title,
        description,
        status,
        priority,
        tags: Array.isArray(tags)
          ? tags
          : tags
          ? String(tags)
              .split(",")
              .map((s) => s.trim())
          : [],
        dueDate,
      });

      await todo.save();
      res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Read (list) with filters, search, sort, pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortDir = "desc",
      priority,
    } = req.query;

    // Build query object (no user filter now)
    const q = {};
    if (status) q.status = status;
    if (priority) q.priority = Number(priority);
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    const sortableFields = ["createdAt", "dueDate", "priority"];
    if (sortableFields.includes(sortBy)) {
      sort[sortBy] = sortDir === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const lim = Math.max(1, Math.min(100, parseInt(limit, 10)));

    // Use q (not hard-coded {})
    const total = await Todo.countDocuments(q);
    const items = await Todo.find(q)
      .sort(sort)
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .exec();

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Read single
router.get("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update
router.patch("/:id", body("title").optional().notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const updates = {};
    const allowed = [
      "title",
      "description",
      "status",
      "priority",
      "tags",
      "dueDate",
    ];
    for (const k of allowed)
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    // normalize tags if provided as comma string
    if (updates.tags && !Array.isArray(updates.tags))
      updates.tags = String(updates.tags)
        .split(",")
        .map((s) => s.trim());

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updates },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
    });
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
