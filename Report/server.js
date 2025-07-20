const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/';
const dbName = 'myproject';
const collectionName = 'reports';

let db;

// Connect to MongoDB
async function connectToDatabase() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db = client.db(dbName);
  console.log("✅ Connected to MongoDB");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle insert
app.post('/insert', async (req, res) => {
  const { heading, description, concern, building, status } = req.body;

  if (!heading || !description || !concern || !building || !status) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  try {
    await db.collection(collectionName).insertOne({
      heading,
      description,
      concern,
      building,
      status,
      createdAt: new Date()
    });

    res.status(201).json({ message: '✅ Report submitted successfully!' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: '❌ Failed to submit report' });
  }
});

// View reports (admin/debug)
app.get('/reports', async (req, res) => {
  try {
    const reports = await db.collection(collectionName).find().toArray();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch reports' });
  }
});

// Start server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
