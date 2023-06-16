const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone: { type: String, required: true },
    name: { type: String, required: false },
    userName: { type: String, required: false },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        if (avatar) {
          return `${process.env.BASE_URL}${avatar}`;
        }
      }
    },
    activated: { type: Boolean, required: false, default: false },
    occupation: { type: String, required: false },
    location: { type: String, required: false },
    bio: { type: String, required: false },
    followers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: false,
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: false,
    },
    inRoom: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model('User', userSchema, 'users'); 