import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('ℹ️ No MONGODB_URI found. Setting up in-memory MongoDB server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      process.env.MONGODB_URI = uri;
      console.log(`✅ In-memory MongoDB started at: ${uri}`);
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial mock data if database is empty
    const { seedDB } = await import('./seed.js');
    await seedDB();
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;

