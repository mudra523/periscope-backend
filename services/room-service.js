const RoomModel = require('../models/room-model.js');

class RoomService {
  async create(payload) {
    const { topic, roomType, tags, hostId } = payload;
    const room = await RoomModel.create({
      topic,
      roomType,
      tags,
      hostId,
      speakers: [hostId],
    });
    return room;
  }

  // to-do: add audience field later.
  async getAllRooms(types) {
    const rooms = await RoomModel.find({ roomType: { $in: types } })
      .populate('speakers', 'name userName avatar')
      .populate('hostId', 'name userName avatar')
      .exec();
    return rooms;
  }

  async getRoom(roomId) {
    const room = await RoomModel.findOne({ _id: roomId })
      .populate('speakers', 'name userName avatar')
      .populate('hostId', 'name userName avatar')
      .exec();
    return room;
  }

  async removeRoom(roomId) {
    await RoomModel.deleteOne({ _id: roomId })
  }

  async addSpeaker(userId, roomId) {
    await RoomModel.findOneAndUpdate({ _id: roomId }, { $addToSet: { speakers: userId } })
  }

  async removeSpeaker(userId, roomId) {
    const room = await RoomModel.findOneAndUpdate({ _id: roomId }, {
      $pull: { speakers: userId }
    }, { new: true })

    if (room && room?.speakers.length < 1) {
      this.removeRoom(roomId);
    }

  }
}


module.exports = new RoomService();