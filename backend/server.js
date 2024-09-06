const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
mongoose.pluralize(null);
// MongoDB Connection
mongoose.connect('mongodb://localhost/Db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'] }, // Added role field
});

const User = mongoose.model('User', userSchema);

// Availability Schema
const availabilitySchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
});

const Availability = mongoose.model('Availability', availabilitySchema);


// Route to register a new user
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Route to login a user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Login successful; return user details
    res.status(200).json({ message: 'Login successful', email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Route to add availability
app.post('/api/availability/add', async (req, res) => {
  try {
    const { user, start, end, duration } = req.body;
    const newSlot = new Availability({
      user,
      start: new Date(start),
      end: new Date(end),
      duration: parseInt(duration, 10),
    });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    console.error('Error Adding Availability:', error);
    res.status(500).json({ error: 'Failed to add time slot' });
  }
});
// Route to get availability for a specific user
app.get('/api/availability/:user', async (req, res) => {
  const { user } = req.params;

  try {
    const slots = await Availability.find({ user });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve availability' });
  }
});

// Update an existing availability slot
app.put('/api/availability/update/:id', async (req, res) => {
  const { id } = req.params;
  const { start, end, duration } = req.body;

  try {
    // Find the availability slot by its ID and update the fields
    const updatedSlot = await Availability.findByIdAndUpdate(
      id,
      { start, end, duration },
      { new: true, runValidators: true } // Return the updated document and validate the inputs
    );

    if (!updatedSlot) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.status(200).json(updatedSlot);
  } catch (error) {
    console.error('Error updating availability slot:', error);
    res.status(500).json({ error: 'Failed to update availability slot' });
  }
});

// Delete an existing availability slot
app.delete('/api/availability/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the availability slot by its ID and delete it
    const deletedSlot = await Availability.findByIdAndDelete(id);

    if (!deletedSlot) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }

    res.status(200).json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({ error: 'Failed to delete availability slot' });
  }
});


app.get('/api/admin/users', async (req, res) => {
  try {
    const usersWithAvailability = await User.aggregate([
      {
        $lookup: {
          from: 'Availability', // Availability collection name in lowercase
          localField: 'user',
          foreignField: 'email',
          as: 'availability',
        },
      },
      {
        $project: {
          email: 1,
          availability: {
            start: 1,
            end: 1,
            duration: 1,
          },
        },
      },
    ]);
    res.status(200).json(usersWithAvailability);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
