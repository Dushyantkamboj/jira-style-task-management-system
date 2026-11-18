import fs from 'fs';
import path from 'path';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';

/**
 * Format attachment object from Multer file
 */
const formatAttachment = (file, userId) => {
  return {
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
    url: `/uploads/${file.filename}`,
    uploadedBy: userId,
    uploadedAt: new Date(),
  };
};

/**
 * @desc    Get all tasks with filtering, search, sorting
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assignee,
      creator,
      scope, // 'all', 'assigned_to_me', 'created_by_me'
      search,
      label,
      sortBy = 'order',
      sortDir = 'asc',
    } = req.query;

    const query = {};

    // Scope filtering
    if (scope === 'assigned_to_me') {
      query.assignee = req.user._id;
    } else if (scope === 'created_by_me') {
      query.creator = req.user._id;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Specific Assignee filter
    if (assignee && assignee !== 'all') {
      if (assignee === 'unassigned') {
        query.assignee = null;
      } else if (assignee === 'me') {
        query.assignee = req.user._id;
      } else {
        query.assignee = assignee;
      }
    }

    // Specific Creator filter
    if (creator && creator !== 'all') {
      query.creator = creator === 'me' ? req.user._id : creator;
    }

    // Label tag filter
    if (label) {
      query.labels = label;
    }

    // Search keyword in title, description, or taskKey
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { taskKey: searchRegex },
        { labels: searchRegex },
      ];
    }

    // Sort order
    const sort = {};
    if (sortBy === 'order') {
      sort.order = sortDir === 'desc' ? -1 : 1;
      sort.createdAt = -1;
    } else if (sortBy === 'dueDate') {
      sort.dueDate = sortDir === 'desc' ? -1 : 1;
    } else if (sortBy === 'priority') {
      sort.priority = sortDir === 'desc' ? -1 : 1;
    } else {
      sort[sortBy] = sortDir === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatar jobTitle department')
      .populate('creator', 'name email avatar')
      .populate('statusHistory.changedBy', 'name email avatar')
      .sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID or taskKey
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { taskKey: req.params.id.toUpperCase() };

    const task = await Task.findOne(filter)
      .populate('assignee', 'name email avatar jobTitle department')
      .populate('creator', 'name email avatar jobTitle department')
      .populate('statusHistory.changedBy', 'name email avatar')
      .populate('attachments.uploadedBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignee, labels } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Task title and description are required.',
      });
    }

    // Parse labels array if passed as string or JSON
    let parsedLabels = [];
    if (labels) {
      if (Array.isArray(labels)) {
        parsedLabels = labels;
      } else if (typeof labels === 'string') {
        try {
          parsedLabels = JSON.parse(labels);
        } catch {
          parsedLabels = labels.split(',').map((l) => l.trim()).filter(Boolean);
        }
      }
    }

    // Process file attachments if uploaded
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachments.push(formatAttachment(file, req.user._id));
      });
    }

    const taskStatus = status || 'Idea';

    // Calculate max order in this column to place at the bottom
    const lastTask = await Task.findOne({ status: taskStatus }).sort({ order: -1 });
    const order = lastTask && typeof lastTask.order === 'number' ? lastTask.order + 1 : 0;

    const initialHistory = [
      {
        fromStatus: 'Created',
        toStatus: taskStatus,
        changedBy: req.user._id,
        changedAt: new Date(),
        note: 'Task initially created',
      },
    ];

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'Medium',
      status: taskStatus,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignee: assignee || null,
      creator: req.user._id,
      labels: parsedLabels,
      attachments,
      order,
      statusHistory: initialHistory,
    });

    // Populate for response
    await task.populate('assignee', 'name email avatar jobTitle');
    await task.populate('creator', 'name email avatar');
    await task.populate('statusHistory.changedBy', 'name email avatar');

    // Record activity
    await Activity.create({
      action: 'TASK_CREATED',
      task: task._id,
      taskKey: task.taskKey,
      taskTitle: task.title,
      user: req.user._id,
      details: {
        status: task.status,
        priority: task.priority,
        assignee: task.assignee ? task.assignee.name : 'Unassigned',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const { title, description, priority, status, dueDate, assignee, labels, order } = req.body;

    const previousStatus = task.status;
    const previousAssignee = task.assignee ? task.assignee.toString() : null;

    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (order !== undefined) task.order = Number(order);

    if (labels !== undefined) {
      if (Array.isArray(labels)) {
        task.labels = labels;
      } else if (typeof labels === 'string') {
        try {
          task.labels = JSON.parse(labels);
        } catch {
          task.labels = labels.split(',').map((l) => l.trim()).filter(Boolean);
        }
      }
    }

    // If status changed
    if (status && status !== previousStatus) {
      // Permission check: assigned user, creator, or admin can update status
      const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();
      const isCreator = task.creator.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isAssignee && !isCreator && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You are only authorized to change status of tasks assigned to you or created by you.',
        });
      }

      task.status = status;
      task.statusHistory.push({
        fromStatus: previousStatus,
        toStatus: status,
        changedBy: req.user._id,
        changedAt: new Date(),
        note: req.body.statusNote || 'Status updated via task editor',
      });

      await Activity.create({
        action: 'STATUS_CHANGED',
        task: task._id,
        taskKey: task.taskKey,
        taskTitle: task.title,
        user: req.user._id,
        details: { from: previousStatus, to: status },
      });
    }

    // If assignee changed
    if (assignee !== undefined && String(assignee) !== String(previousAssignee)) {
      let assignedUserName = 'Unassigned';
      if (assignee) {
        const assignedUser = await User.findById(assignee);
        if (assignedUser) assignedUserName = assignedUser.name;
      }

      await Activity.create({
        action: 'TASK_ASSIGNED',
        task: task._id,
        taskKey: task.taskKey,
        taskTitle: task.title,
        user: req.user._id,
        details: { assignedTo: assignedUserName },
      });
    }

    await task.save();

    await task.populate('assignee', 'name email avatar jobTitle');
    await task.populate('creator', 'name email avatar');
    await task.populate('statusHistory.changedBy', 'name email avatar');
    await task.populate('attachments.uploadedBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fast update task status and position (Drag and Drop Kanban)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Target status is required.',
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // User authorization check: Assigned users, creator, or admin can update status
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();
    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAssignee && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: You can only move tasks assigned to you or created by you.',
      });
    }

    const previousStatus = task.status;
    const statusChanged = previousStatus !== status;

    task.status = status;
    if (order !== undefined) {
      task.order = Number(order);
    }

    if (statusChanged) {
      task.statusHistory.push({
        fromStatus: previousStatus,
        toStatus: status,
        changedBy: req.user._id,
        changedAt: new Date(),
        note: note || `Moved from ${previousStatus} to ${status} via Kanban Board`,
      });

      await Activity.create({
        action: 'STATUS_CHANGED',
        task: task._id,
        taskKey: task.taskKey,
        taskTitle: task.title,
        user: req.user._id,
        details: { from: previousStatus, to: status },
      });
    }

    await task.save();

    await task.populate('assignee', 'name email avatar jobTitle');
    await task.populate('creator', 'name email avatar');
    await task.populate('statusHistory.changedBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task permanently
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Only creator or admin can permanently delete task
    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied. Only the task creator or an administrator can delete this task.',
      });
    }

    // Remove any physical attachment files from disk
    if (task.attachments && task.attachments.length > 0) {
      task.attachments.forEach((att) => {
        if (att.path && fs.existsSync(att.path)) {
          try {
            fs.unlinkSync(att.path);
          } catch (e) {
            console.warn(`Could not delete file ${att.path}:`, e.message);
          }
        }
      });
    }

    await Task.findByIdAndDelete(task._id);

    // Record activity
    await Activity.create({
      action: 'TASK_DELETED',
      taskKey: task.taskKey,
      taskTitle: task.title,
      user: req.user._id,
      details: { deletedBy: req.user.name },
    });

    res.status(200).json({
      success: true,
      message: `Task ${task.taskKey} has been deleted permanently.`,
      taskId: task._id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload attachments to existing task
 * @route   POST /api/tasks/:id/attachments
 * @access  Private
 */
export const addAttachment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one file to upload.',
      });
    }

    const newAttachments = req.files.map((file) => formatAttachment(file, req.user._id));
    task.attachments.push(...newAttachments);

    await task.save();
    await task.populate('attachments.uploadedBy', 'name email avatar');

    await Activity.create({
      action: 'ATTACHMENT_ADDED',
      task: task._id,
      taskKey: task.taskKey,
      taskTitle: task.title,
      user: req.user._id,
      details: { count: newAttachments.length, files: newAttachments.map((f) => f.originalName) },
    });

    res.status(200).json({
      success: true,
      message: `${newAttachments.length} file(s) attached successfully!`,
      attachments: task.attachments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete attachment from task
 * @route   DELETE /api/tasks/:id/attachments/:attachmentId
 * @access  Private
 */
export const deleteAttachment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    const attachment = task.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found.',
      });
    }

    // Permission check: uploader, task creator, or admin can delete attachment
    const isUploader =
      attachment.uploadedBy && attachment.uploadedBy.toString() === req.user._id.toString();
    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUploader && !isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this attachment.',
      });
    }

    // Unlink physical file
    if (attachment.path && fs.existsSync(attachment.path)) {
      try {
        fs.unlinkSync(attachment.path);
      } catch (err) {
        console.warn(`Could not delete file ${attachment.path}:`, err.message);
      }
    }

    task.attachments.pull(req.params.attachmentId);
    await task.save();

    await Activity.create({
      action: 'ATTACHMENT_REMOVED',
      task: task._id,
      taskKey: task.taskKey,
      taskTitle: task.title,
      user: req.user._id,
      details: { filename: attachment.originalName },
    });

    res.status(200).json({
      success: true,
      message: 'Attachment removed successfully.',
      attachments: task.attachments,
    });
  } catch (error) {
    next(error);
  }
};
