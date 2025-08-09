const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: ['GICPL-OG', 'GICPL-H'],
    trim: true
  },
  captain: {
    type: String,
    required: [true, 'Captain name is required'],
    trim: true
  },
  players: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['C', 'VC', 'WK', 'Player'], // Captain, Vice-Captain, Wicket-Keeper, Player
      default: 'Player'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
teamSchema.index({ section: 1, name: 1 });

module.exports = mongoose.model('Team', teamSchema);