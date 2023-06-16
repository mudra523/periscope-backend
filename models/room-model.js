const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// to-do: add audience field later.

const roomSchema = new Schema(
  {
    topic: { type: String, required: true },
    roomType: { type: String, required: true },
    tags: [
      { type: String, required: true }
    ],
    hostId: { type: Schema.Types.ObjectId, ref: 'User' },
    speakers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema, 'rooms');
