//These are the dependencies
const express = require('express'); 
const { MongoClient, ObjectId } = require('mongodb'); 
const cors = require('cors'); const path = require('path'); 
const app = express(); 
const port = 3000; // Replace with your desired port number 
 
// Connection URL and Database Name 
const url = "mongodb://localhost:27017/"; // Replace with your MongoDB connection URL
const dbName = 'myproject'; // Replace with your database name 
const collectionName = 'personal_info'; // Replace with your collection name 
 
let db; // Global variable to hold the MongoDB database reference 
 
async function connectToDatabase() { 
const client = await MongoClient.connect(url, { 
useUnifiedTopology: true });   
db = client.db(dbName); 
} 
 
// Middleware to parse JSON requests 
app.use(express.json()); 
app.use(cors()); 
 
// Serve the HTML form 
app.get('/', (req, res) => { 
    
    res.sendFile(path.join(__dirname, 'public/client.html')); }); 
 
// Insert route 
app.post('/insert', async (req, res) => { 
  const { studid, lname, fname, mname, course } = req.body;   console.log('Received request body:', req.body); 
 
  try { 
    // Ensure the database connection is established before insertion     
    if (!db) { 
      console.log('Database connection is not established yet.'); 
      return res.status(500).json({ error: 'Database connection is not ready.' }); 
    } 
 
    // Insert the record into the collection     
    await db.collection(collectionName).insertOne({ studid,lname,fname, mname,course, 
    }); 
 
    console.log('Record inserted successfully!'); 
    res.status(201).json({ message: 'Record inserted successfully!' }); 
  } catch (err) { 
    if (err.name === 'MongoError' && err.code === 11000) {       
      console.log('Duplicate entry for studid:', studid); 
      return res.status(400).json({ error: 'The provided studid already exists.' }); 
    } 
 
    console.error('Error inserting record:', err); 
    res.status(500).json({ error: 'An error occurred while inserting the record.' });   } 
}); 
 
// Search route 
app.get('/search', async (req, res) => { 
  const { studid } = req.query; 
 
  try { 
    // Ensure the database connection is established before searching      
    if (!db) { 
      console.log('Database connection is not established yet.'); 
      return res.status(500).json({ error: 'Database connection is not ready.' }); 
    } 
 
    // Search for the student record with the provided studid 
    const student = await db.collection(collectionName).findOne({ studid }); 
 
    if (student) { 
      console.log('Student found:', student);       
      res.status(200).json(student); 
    } else { 
      console.log('No student found with the provided studid.'); 
      res.status(404).json({ error: 'No student found with the provided studid.' });     } 
  } catch (err) { 
    console.error('Error searching for student:', err); 
    res.status(500).json({ error: 'An error occurred while searching for the student.' });   } 
}); 
 
// Update route 
app.post('/update', async (req, res) => { 
  const { studid, lname, fname, mname, course } = req.body; 
 
  try { 
    // Ensure the database connection is established before updating      
    if (!db) { 
      console.log('Database connection is not established yet.'); 
      return res.status(500).json({ error: 'Database connection is not ready.' }); 
    } 
 
    // Construct the update query     
    const updateQuery = { studid }; 
    const updateValues = { $set: { lname, fname, mname, course } }; 
 
    // Update the document in the personal_info collection 
    const result = await db.collection(collectionName).updateOne(updateQuery, updateValues); 
 
    if (result.matchedCount > 0) { 
      console.log('Document updated successfully.'); 
      res.status(200).json({ message: 'Document updated successfully!' }); 
    } else { 
      console.log('No document found with the provided studid.'); 
      res.status(404).json({ error: 'No document found with the provided studid.' }); 
    } 
  } catch (err) { 
    console.error('Error updating document:', err); 
    res.status(500).json({ error: 'An error occurred while updating the document.' }); 
  } 
}); 
 
// Delete route 
app.post('/delete', async (req, res) => {   const { studid } = req.body; 
 
  try { 
    // Ensure the database connection is established before deleting     
    if (!db) { 
      console.log('Database connection is not established yet.'); 
      return res.status(500).json({ error: 'Database connection is not ready.' }); 
    } 
 
    // Construct the delete query 
    const deleteQuery = { studid }; 
 
    // Delete the document from the personal_info collection 
    const result = await db.collection(collectionName).deleteOne(deleteQuery); 
 
    if (result.deletedCount > 0) { 
      console.log('Document deleted successfully.'); 
      res.status(200).json({ message: 'Document deleted successfully!' }); 
    } else { 
      console.log('No document found with the provided studid.'); 
      res.status(404).json({ error: 'No document found with the provided studid.' }); 
    } 
  } catch (err) { 
    console.error('Error deleting document:', err); 
    res.status(500).json({ error: 'An error occurred while deleting the document.' });   } 
}); 
 
// Start the server and connect to the database 
connectToDatabase() 
  .then(() => {     app.listen(port, () => { 
      console.log(`Server is running on http://localhost:${port}`); 
    }); 
  }) 
  .catch((err) => { 
    console.error('Error connecting to MongoDB:', err); 
  }); 
 
