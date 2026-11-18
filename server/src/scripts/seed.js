import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing database collections...');

    await User.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    console.log('👥 Creating default users...');

    // 1. Create Demo Users
    const users = await User.create([
      {
        name: 'Alex Morgan',
        email: 'alex@example.com',
        password: 'Password123!',
        role: 'admin',
        jobTitle: 'Lead Architect & Tech Lead',
        department: 'Engineering',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex Morgan&backgroundColor=0052cc&textColor=ffffff',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: 'Password123!',
        role: 'member',
        jobTitle: 'Senior Full Stack Engineer',
        department: 'Product Engineering',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah Chen&backgroundColor=6554c0&textColor=ffffff',
      },
      {
        name: 'Michael Scott',
        email: 'michael@example.com',
        password: 'Password123!',
        role: 'member',
        jobTitle: 'Product Manager',
        department: 'Product',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Michael Scott&backgroundColor=00875a&textColor=ffffff',
      },
    ]);

    const [alex, sarah, michael] = users;

    console.log('📋 Creating realistic Jira-style tasks across all 5 workflow columns...');

    const sampleTasks = [
      // 1. IDEA
      {
        taskKey: 'JIRA-101',
        title: 'Explore AI-Assisted Task Estimation & Smart Autocomplete',
        description:
          'Investigate incorporating Gemini / LLM models to provide intelligent story-point estimates, task breakdowns, and auto-generated acceptance criteria based on historical velocity.',
        status: 'Idea',
        priority: 'Low',
        creator: michael._id,
        assignee: alex._id,
        labels: ['AI', 'Research', 'Roadmap'],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        order: 0,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'Idea',
            changedBy: michael._id,
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            note: 'Initial proposal during Q4 product ideation session',
          },
        ],
      },
      {
        taskKey: 'JIRA-102',
        title: 'Dark Mode Theme & Accessibility Enhancements',
        description:
          'Implement full dark mode palette adhering to WCAG 2.1 AA contrast standards. Ensure high-contrast keyboard focus indicators for accessibility compliance.',
        status: 'Idea',
        priority: 'Medium',
        creator: alex._id,
        assignee: null,
        labels: ['UI/UX', 'Accessibility'],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        order: 1,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'Idea',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Proposed based on customer feedback survey',
          },
        ],
      },

      // 2. TO DO
      {
        taskKey: 'JIRA-103',
        title: 'Implement Multi-Factor Authentication (MFA) via TOTP',
        description:
          'Enhance user security by supporting Authenticator apps (Google Authenticator, Authy) with QR code setup, recovery codes, and backup mechanisms.',
        status: 'To Do',
        priority: 'High',
        creator: alex._id,
        assignee: sarah._id,
        labels: ['Security', 'Auth', 'Backend'],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        order: 0,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'Idea',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            note: 'Security compliance requirement identified',
          },
          {
            fromStatus: 'Idea',
            toStatus: 'To Do',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Approved for current sprint',
          },
        ],
      },
      {
        taskKey: 'JIRA-104',
        title: 'Setup Redis Caching for Real-Time Dashboard Metrics',
        description:
          'Cache frequently requested aggregation metrics on the dashboard to optimize MongoDB query throughput during peak usage.',
        status: 'To Do',
        priority: 'Medium',
        creator: sarah._id,
        assignee: sarah._id,
        labels: ['Performance', 'Backend', 'Database'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        order: 1,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'To Do',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Planned tech-debt item',
          },
        ],
      },

      // 3. IN PROGRESS
      {
        taskKey: 'JIRA-105',
        title: 'Develop Real-Time Drag & Drop Kanban Workflow Board',
        description:
          'Create smooth multi-column drag and drop board with @hello-pangea/dnd. Include optimistic UI updates, keyboard accessibility, and state persistence with MongoDB.',
        status: 'In Progress',
        priority: 'Critical',
        creator: alex._id,
        assignee: sarah._id,
        labels: ['Frontend', 'Kanban', 'UI/UX'],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        order: 0,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'Idea',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'Idea',
            toStatus: 'To Do',
            changedBy: michael._id,
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'To Do',
            toStatus: 'In Progress',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Started board state and dnd integration',
          },
        ],
      },
      {
        taskKey: 'JIRA-106',
        title: 'Implement File Attachment Upload with Previews & Downloads',
        description:
          'Add Multer-powered multi-file upload system for images, PDFs, spreadsheets and documents. Provide thumbnail preview, file size badges, and deletion controls.',
        status: 'In Progress',
        priority: 'High',
        creator: michael._id,
        assignee: alex._id,
        labels: ['Attachments', 'Storage', 'FullStack'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        order: 1,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'To Do',
            changedBy: michael._id,
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'To Do',
            toStatus: 'In Progress',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            note: 'Configuring Multer storage and static endpoints',
          },
        ],
      },

      // 4. IN REVIEW
      {
        taskKey: 'JIRA-107',
        title: 'Audit User Permission Boundaries for Task Modification',
        description:
          'Ensure strict role-based and ownership-based access control. Users should only move or modify tasks they are authorized for (assigned or created by them).',
        status: 'In Review',
        priority: 'Critical',
        creator: alex._id,
        assignee: sarah._id,
        labels: ['Security', 'Authorization', 'Backend'],
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        order: 0,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'To Do',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'To Do',
            toStatus: 'In Progress',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'In Progress',
            toStatus: 'In Review',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            note: 'PR #42 opened for peer security review',
          },
        ],
      },

      // 5. COMPLETED
      {
        taskKey: 'JIRA-108',
        title: 'Containerize Application with Production Docker & Compose',
        description:
          'Create multi-stage Dockerfiles for backend and frontend (Nginx). Add docker-compose.yml with production environmental variables and MongoDB Atlas connectivity.',
        status: 'Completed',
        priority: 'High',
        creator: alex._id,
        assignee: alex._id,
        labels: ['DevOps', 'Docker', 'Deployment'],
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        order: 0,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'In Progress',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'In Progress',
            toStatus: 'In Review',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'In Review',
            toStatus: 'Completed',
            changedBy: michael._id,
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Verified container builds and compose orchestration',
          },
        ],
      },
      {
        taskKey: 'JIRA-109',
        title: 'JWT Authentication Architecture with Bcrypt Hashing',
        description:
          'Implement secure user registration, password confirmation, salted bcrypt hashing, and JWT token session management.',
        status: 'Completed',
        priority: 'Critical',
        creator: alex._id,
        assignee: sarah._id,
        labels: ['Auth', 'Security', 'Backend'],
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        order: 1,
        statusHistory: [
          {
            fromStatus: 'Created',
            toStatus: 'In Progress',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'In Progress',
            toStatus: 'In Review',
            changedBy: sarah._id,
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            fromStatus: 'In Review',
            toStatus: 'Completed',
            changedBy: alex._id,
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Passed end-to-end authentication tests',
          },
        ],
      },
    ];

    const createdTasks = await Task.insertMany(sampleTasks);

    console.log(`✅ Seeded ${createdTasks.length} tasks!`);

    // Create Activity feed items
    for (const task of createdTasks) {
      await Activity.create({
        action: task.status === 'Completed' ? 'STATUS_CHANGED' : 'TASK_CREATED',
        task: task._id,
        taskKey: task.taskKey,
        taskTitle: task.title,
        user: task.creator,
        details: { status: task.status, priority: task.priority },
        createdAt: task.createdAt || new Date(),
      });
    }

    console.log('✅ Activity feed generated!');
    console.log('\n=============================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('Demo Credentials:');
    console.log('  Admin:   alex@example.com    / Password123!');
    console.log('  Member:  sarah@example.com   / Password123!');
    console.log('  PM:      michael@example.com / Password123!');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
