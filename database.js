const mongoose = require('mongoose');

function DBConnect() {
  const DB_URL = process.env.DB_URL;

  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }).catch(err => console.log(err));

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', () => {
    console.log('DB connected...');
  });


}

module.exports = DBConnect;