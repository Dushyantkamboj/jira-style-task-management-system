import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'TASK_CREATED',
        'TASK_UPDATED',
        'STATUS_CHANGED',
        'TASK_ASSIGNED',
        'ATTACHMENT_ADDED',
        'ATTACHMENT_REMOVED',
        'TASK_DELETED',
      ],
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    taskKey: {
      type: String,
    },
    taskTitle: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
