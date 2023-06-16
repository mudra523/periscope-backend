const Jimp = require('jimp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
  async activate(req, res) {
    // console.log(`Request of activate after middleware:\n${req}`);
    // Check if user has entered the data.
    const { name, avatar, userName } = req.body;
    if (!name || !avatar || !userName) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Buffer class is used to convert base64 string to image file.
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
      'base64'
    );
    const imagePath = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    // e.g., 32478362874-3242342342343432.png

    // Compressing image using jimp
    try {
      const jimResp = await Jimp.read(buffer);
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (err) {
      // console.log(err);
      return res.status(500).json({ message: 'Could not process the image' });
    }

    const userId = req.user._id;
    try {
      const user = await userService.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.userName = userName;
      user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }
}

module.exports = new ActivateController();