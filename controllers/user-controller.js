const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto')

class UserController {
  async follow(req, res) {

    // to-do: change this to get user id from middleware
    const { followingId } = req.body;
    // const { followingId, userId } = req.body;

    if (!followingId) {
      return res.status(400).json({ message: "Following Id is required" })
    }

    // to-do
    if (followingId == req.user._id) {
      // if (followingId == userId) {
      return res.status(400).json({ message: "Can't follow your own account" })
    }

    // to-do
    let isFollowing = await userService.isFollowing(followingId, req.user._id);
    // let isFollowing = await userService.isFollowing(followingId, userId);

    if (isFollowing) {
      return res.status(409).json({ message: "You are already following this user." })
    } else {
      // to-do 
      await userService.addFollower(followingId, req.user._id);
      // await userService.addFollower(followingId, userId);
      return res.status(200).json({ message: "Successfully followed this user" })
    }
  }

  async unfollow(req, res) {

    // to-do: change this to get user id from middleware
    const { unFollowingId } = req.body;
    // const { unFollowingId, userId } = req.body;

    if (!unFollowingId) {
      return res.status(400).json({ message: "Un following Id is required" })
    }

    // to-do
    if (unFollowingId == req.user._id) {
      // if (unFollowingId == userId) {
      return res.status(400).json({ message: "Can't unfollow your own account" })
    }

    // to-do
    let isFollowing = await userService.isFollowing(unFollowingId, req.user._id);
    // let isFollowing = await userService.isFollowing(unFollowingId, userId);

    if (!isFollowing) {
      return res.status(409).json({ message: "You have already unfollowed this user." })
    } else {
      // to-do 
      await userService.removeFollower(unFollowingId, req.user._id);
      // await userService.removeFollower(unFollowingId, userId);
      return res.status(200).json({ message: "Successfully unfollowed this user" })
    }
  }

  async findUser(req, res) {
    const user = await userService.getUser(req.params.userId);
    return res.json(new UserDto(user));
  }

  async updateUser(req, res) {
    // to-do
    const { userData } = req.body;
    // const { userData, userId } = req.body;

    // to-do
    const user = await userService.updateData(req.user._id, userData);
    // const user = await userService.updateData(userId, userData);
    return res.json(new UserDto(user));
  }

}

module.exports = new UserController();