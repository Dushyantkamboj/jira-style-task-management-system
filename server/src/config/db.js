import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jira_task_manager';

  const isAtlas = uri.includes('mongodb+srv') || uri.includes('.mongodb.net');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`=================================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Target: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    console.log(` Host:   ${conn.connection.host}`);
    console.log(` DB:     ${conn.connection.name}`);
    console.log(`=================================================`);

    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    if (isAtlas) {
      console.error(`ℹ️  MongoDB Atlas Troubleshooting Tips:`);
      console.error(`   1. Verify your IP address is whitelisted in Atlas (Network Access -> Add 0.0.0.0/0 or Current IP).`);
      console.error(`   2. Check your Atlas database username and password in server/.env (URI-encode special characters).`);
      console.error(`   3. Verify network connectivity to cluster0...mongodb.net.`);
    } else {
      console.error(`ℹ️  Ensure your local MongoDB daemon is running or configure MONGODB_URI in server/.env.`);
    }
    
    // We don't necessarily exit immediately in development so the developer can see the error clearly
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
