import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// User Schema
const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  email: { type: String },
  avatarUrl: { type: String },
  accessToken: { type: String },
}, { timestamps: true });

// README Schema
const readmeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoName: { type: String, required: true },
  repoOwner: { type: String, required: true },
  content: { type: String, required: true },
  templateStyle: { type: String, default: 'modern' },
}, { timestamps: true });

// Generation Log Schema
const generationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repoName: { type: String },
  status: { type: String },
  errorMessage: { type: String },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Readme = mongoose.model('Readme', readmeSchema);
export const GenerationLog = mongoose.model('GenerationLog', generationLogSchema);

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully');
  return mongoose.connection;
}

export default { User, Readme, GenerationLog, initDatabase };
