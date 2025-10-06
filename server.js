const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brokerhq', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Watchlist Schema
const watchlistSchema = new mongoose.Schema({
  userId: String,
  itemId: String,
  itemType: String,
  itemData: Object,
  createdAt: { type: Date, default: Date.now },
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

// Routes
app.get('/api/watchlist/:userId', async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/watchlist/:userId', async (req, res) => {
  try {
    const { itemId, itemType, itemData } = req.body;
    const watchlistItem = new Watchlist({
      userId: req.params.userId,
      itemId,
      itemType,
      itemData,
    });
    await watchlistItem.save();
    res.json(watchlistItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/watchlist/:userId/:itemId', async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({
      userId: req.params.userId,
      itemId: req.params.itemId,
    });
    res.json({ message: 'Item removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/watchlist/:userId/check/:itemId', async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      userId: req.params.userId,
      itemId: req.params.itemId,
    });
    res.json({ isInWatchlist: !!item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 