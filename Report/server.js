const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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
  console.log('✅ Connected to MongoDB');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// Serve HTML pages
// Show registration form at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registration.html'));
});
// Keep index available under /index or /home
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // TODO: hash the password before saving
    const col = db.collection(collectionName);
    const insert = await col.insertOne({
      name,
      email,
      password,
      createdAt: new Date()
    });
    res.status(201).json({ success: true, id: insert.insertedId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Report endpoints
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

app.get('/reports', async (req, res) => {
  try {
    const reports = await db.collection(collectionName).find().toArray();
    res.status(200).json(reports);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: '❌ Failed to fetch reports' });
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.modifiedCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Report not found or no changes made' });
    }
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: '❌ Failed to update report' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const result = await db.collection(collectionName).deleteOne({
      _id: new ObjectId(req.params.id)
    });
    if (result.deletedCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: '❌ Failed to delete report' });
  }
});

// Start server
connectToDatabase()
  .then(() => {
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));