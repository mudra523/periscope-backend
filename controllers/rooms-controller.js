const roomService = require('../services/room-service.js');
const RoomDto = require('../dtos/room-dto.js');

class RoomsController {
  async create(req, res) {
    const { topic, roomType, tags } = req.body;

    if (!topic || !roomType || !tags || tags.length === 0) {
      return res.status(400).json({ message: "all fields are required." })
    }

    // to-do: uncomment host id
    const room = await roomService.create({
      topic,
      roomType,
      tags,
      hostId: req.user._id,
    });

    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const rooms = await roomService.getAllRooms(['public']);
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json(allRooms);
  }

  async show(req, res) {
    const room = await roomService.getRoom(req.params.roomId);
    return res.json(room);
  }

  async remove(req, res) {
    const room = await roomService.getRoom(req.params.roomId);
    if (room === null) {
      return res.status(404).json({ message: "Room you are trying to delete does not exist or have already been deleted" });
    }
    try {
      await roomService.removeRoom(req.params.roomId);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'db error' });
    }

    return res.status(200).json({ message: 'Room has been successfully deleted' });

  }

  async addSpeaker(req, res) {
    const { roomId } = req.body;
    await roomService.addSpeaker(req.user._id, roomId);
  }

  async removeSpeaker(req, res) {
    const { roomId } = req.body;
    await roomService.removeSpeaker(req.user._id, roomId);
  }

}

module.exports = new RoomsController();