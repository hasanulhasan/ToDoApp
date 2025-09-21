const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
// user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
description: { type: String },
status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
priority: { type: Number, min: 1, max: 5, default: 3 },
tags: [{ type: String }],
dueDate: { type: Date }
}, { timestamps: true });


module.exports = mongoose.model('Todo', todoSchema);