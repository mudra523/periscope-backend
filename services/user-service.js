const UserModel = require('../models/user-model');

class UserService {
  async findUser(filter) {
    const user = await UserModel.findOne(filter)
      .populate('following', 'name userName avatar inRoom')
      .populate('followers', 'name userName avatar inRoom')
      .exec();
    return user;
  }

  async createUser(data) {
    const user = await UserModel.create(data);
    return user;
  }

  async getUser(userId) {
    const user = await UserModel.findOne({ _id: userId })
      .populate('following', 'name userName avatar inRoom')
      .populate('followers', 'name userName avatar inRoom')
      .exec();
    return user;
  }

  async isFollowing(followingId, userId) {
    const user = await this.findUser({ _id: userId, following: followingId });
    if (user) {
      return true;
    }
    return false;
  }

  async addFollower(followingId, userId) {
    await UserModel.findOneAndUpdate({ _id: followingId }, {
      $push: { followers: userId }
    }, { new: true })

    await UserModel.findOneAndUpdate({ _id: userId }, {
      $push: { following: followingId }
    }, { new: true })

  }

  async removeFollower(followingId, userId) {
    await UserModel.findOneAndUpdate({ _id: followingId }, {
      $pull: { followers: userId }
    }, { new: true })

    await UserModel.findOneAndUpdate({ _id: userId }, {
      $pull: { following: followingId }
    }, { new: true })
  }

  async updateData(userId, userData) {
    let user;
    user = await UserModel.findOneAndUpdate({ _id: userId }, userData, { new: true });

    return user;
  }

}

module.exports = new UserService();