class UserDto {
  id;
  phone;
  name;
  userName;
  avatar;
  activated;
  occupation;
  location;
  bio;
  followers;
  following;
  inRoom;
  createdAt;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.name = user.name;
    this.userName = user.userName
    this.avatar = user.avatar;
    this.activated = user.activated;
    this.occupation = user.occupation;
    this.location = user.location;
    this.bio = user.bio;
    this.followers = user.followers;
    this.following = user.following;
    this.inRoom = user.inRoom;
    this.createdAt = user.createdAt;
  }
}

module.exports = UserDto;