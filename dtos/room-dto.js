class RoomDto {
  id;
  topic;
  roomType;
  tags;
  hostId;
  speakers;
  createdAt;

  constructor(room) {
    this.id = room._id;
    this.topic = room.topic;
    this.roomType = room.roomType;
    this.tags = room.tags;
    this.hostId = room.hostId;
    this.speakers = room.speakers;
    this.createdAt = room.createdAt;
  }
}

module.exports = RoomDto;