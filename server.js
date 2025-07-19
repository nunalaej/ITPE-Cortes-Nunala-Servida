const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/';
const dbName = 'itpetesting';
const collectionName = 'testing';

let db;

async function connectToDatabase() {
  const client = await MongoClient.connect(url, {
    useUnifiedTopology: true,
  });
  db = client.db(dbName);
}

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

// INSERT
app.post('/insert', async (req, res) => {
  const { studid, lname, fname, mname, course } = req.body;

  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    await db.collection(collectionName).insertOne({ studid, lname, fname, mname, course });
    res.status(201).json({ message: 'Record inserted successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'studid already exists' });
    }
    res.status(500).json({ error: 'Insert failed' });
  }
});

// SEARCH
app.get('/search', async (req, res) => {
  const { studid } = req.query;

  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const student = await db.collection(collectionName).findOne({ studid });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: 'No student found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// UPDATE
app.post('/update', async (req, res) => {
  const { studid, lname, fname, mname, course } = req.body;

  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const result = await db.collection(collectionName).updateOne({ studid }, {
      $set: { lname, fname, mname, course },
    });

    if (result.matchedCount > 0) {
      res.status(200).json({ message: 'Update successful' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE
app.post('/delete', async (req, res) => {
  const { studid } = req.body;

  try {
    if (!db) return res.status(500).json({ error: 'Database not connected' });

    const result = await db.collection(collectionName).deleteOne({ studid });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Delete successful' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.post('/login', async (req, res) => {
  const { studentid, course } = req.body;
  try {
    if (!db) return res.redirect('/login.html?error=1');
    // Find a student with matching studentid and course
    const student = await db.collection(collectionName).findOne({ studid: studid, course });
    if (student) {
      // Successful login
      res.redirect('/home.html');
    } else {
      // Failed login, redirect back with error
      res.redirect('/login.html?error=1');
    }
  } catch (err) {
    res.redirect('/login.html?error=1');
  }
});
// Start server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
