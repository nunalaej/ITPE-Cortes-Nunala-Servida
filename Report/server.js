const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const { ObjectId } = require('mongodb'); // ✅ Needed for manual _id handling

const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/myproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected to 'myproject'"))
.catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Report Schema
const reportSchema = new mongoose.Schema({
  heading: String,
  description: String,
  concern: String,
  building: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'registration.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/users', (req, res) => res.sendFile(path.join(__dirname, 'views', 'users.html')));
app.get('/reports', (req, res) => res.sendFile(path.join(__dirname, 'views', 'reports.html')));

// Register User
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

    res.json({ success: true, message: 'Login successful', name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit a Report
app.post('/api/reports', async (req, res) => {
  try {
    const { heading, description, concern, building, status } = req.body;
    const newReport = new Report({ heading, description, concern, building, status });
    await newReport.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Report submission error:', err);
    res.status(500).json({ success: false, message: 'Error saving report' });
  }
});

// Get All Reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Fetch reports error:', err);
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// Update Report Status
app.put('/api/reports/:id/status', async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;
    const updated = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    console.error('Update report status error:', err);
    res.status(500).json({ success: false, message: 'Error updating report' });
  }
});

// Update a Report
app.put('/update/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = {
      heading: req.body.heading,
      description: req.body.description,
      concern: req.body.concern,
      building: req.body.building,
      status: req.body.status
    };
    const result = await Report.findByIdAndUpdate(id, updated, { new: true });
    res.json(result);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Error updating report' });
  }
});

// Delete a Report
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Report.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting report' });
  }
});
// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:${3000}');
});
