const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const uri = "mongodb+srv://ryan64128:Ry64An128@flash-card-cluster.xbap9ne.mongodb.net/?retryWrites=true&w=majority&appName=flash-card-cluster";
const app = express();
const port = 3000;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });

  // Connect to MongoDB Atlas
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
  
  // Check if MongoDB is connected
  const db = mongoose.connection;
  db.on('error', (error) => console.error(error));
  db.once('open', () => console.log('Connected to MongoDB Atlas'));

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    try{
        const users = await User.find();
        const userList = users.map(user => `${user.username}, ${user.password}`).join('\n');
        res.send(userList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addUser', async(req, res) => {
    try {
        // Create a new user document
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });

        // Save the user to the database
        await newUser.save();

        // Send a success response
        res.status(201).send('User added successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
    }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
