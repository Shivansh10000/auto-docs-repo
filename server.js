const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/notes-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  notes: [{
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:userId/notes', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users/:userId/notes', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const newNote = {
      title: req.body.title,
      content: req.body.content
    };
    
    user.notes.push(newNote);
    await user.save();
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:userId/notes/:noteId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.notes = user.notes.filter(note => note._id.toString() !== req.params.noteId);
    await user.save();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize some test users if none exist
async function initializeTestUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    const users = [
      { username: 'user1', notes: [] },
      { username: 'user2', notes: [] },
      { username: 'user3', notes: [] }
    ];
    await User.insertMany(users);
    console.log('Test users initialized');
  }
}

initializeTestUsers();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 