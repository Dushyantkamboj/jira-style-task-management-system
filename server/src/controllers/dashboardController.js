import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get dashboard metrics, overview cards, and recent activities
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run parallel aggregation for fast performance
    const [
      totalTasks,
      ideaTasks,
      toDoTasks,
      inProgressTasks,
      inReviewTasks,
      completedTasks,
      myAssignedTasks,
      myCreatedTasks,
      priorityStats,
      overdueTasks,
      recentActivities,
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'Idea' }),
      Task.countDocuments({ status: 'To Do' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'In Review' }),
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ assignee: userId }),
      Task.countDocuments({ creator: userId }),
      // Aggregate tasks by priority
      Task.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
      ]),
      // Overdue tasks that are not completed
      Task.find({
        status: { $ne: 'Completed' },
        dueDate: { $lt: new Date() },
      })
        .select('taskKey title status priority dueDate assignee')
        .populate('assignee', 'name avatar')
        .limit(5),
      // Recent activities
      Activity.find()
        .populate('user', 'name avatar jobTitle')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Format priority stats
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    priorityStats.forEach((p) => {
      if (priorityCounts[p._id] !== undefined) {
        priorityCounts[p._id] = p.count;
      }
    });

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalTasks,
          idea: ideaTasks,
          toDo: toDoTasks,
          inProgress: inProgressTasks,
          inReview: inReviewTasks,
          completed: completedTasks,
          completionRate,
          myAssigned: myAssignedTasks,
          myCreated: myCreatedTasks,
        },
        priorities: priorityCounts,
        overdue: {
          count: overdueTasks.length,
          tasks: overdueTasks,
        },
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};
