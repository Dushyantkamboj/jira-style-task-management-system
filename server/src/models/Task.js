import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const statusHistorySchema = new mongoose.Schema({
  fromStatus: {
    type: String,
    enum: ['Idea', 'To Do', 'In Progress', 'In Review', 'Completed', 'Created'],
    required: true,
  },
  toStatus: {
    type: String,
    enum: ['Idea', 'To Do', 'In Progress', 'In Review', 'Completed'],
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
});

const taskSchema = new mongoose.Schema(
  {
    taskKey: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Idea', 'To Do', 'In Progress', 'In Review', 'Completed'],
      default: 'Idea',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    labels: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    attachments: [attachmentSchema],
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Auto-generate Jira-style task key (e.g., JIRA-101) before save if not present
taskSchema.pre('save', async function (next) {
  if (!this.taskKey) {
    try {
      const count = await mongoose.model('Task').countDocuments();
      this.taskKey = `JIRA-${count + 101}`;
    } catch (err) {
      this.taskKey = `JIRA-${Date.now().toString().slice(-4)}`;
    }
  }
  next();
});

// Indexes for common queries
taskSchema.index({ status: 1, order: 1 });
taskSchema.index({ assignee: 1, status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);
export default Task;
