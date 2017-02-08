var Sequelize = require('sequelize');
var db = new Sequelize('rippl', 'root', '');

// we define the models we need using js
var Session = db.define('Session', {
  'sid': Sequelize.STRING,
  expires: Sequelize.STRING,
  data: Sequelize.STRING,
});

var User = db.define('User', {
  username: {type: Sequelize.STRING, unique: true},
  password: Sequelize.STRING,
  requestToken: Sequelize.STRING,
  requestTokenSecret: Sequelize.STRING,
  accessToken: Sequelize.STRING,
  accessTokenSecret: Sequelize.STRING
});

var Score = db.define('Score', {
  value: Sequelize.STRING,
  category: Sequelize.STRING,
  //twitterHandle: Sequelize.STRING,
  numTweets: Sequelize.INTEGER,
  tweetText: Sequelize.TEXT,
  sentimentScore: Sequelize.FLOAT,
  retweetCount: Sequelize.INTEGER,
  favoriteCount: Sequelize.INTEGER  
});

// enables bi-directional associations between Users and Scores
User.hasMany(Score);

// puts a UserId column on each Score instance
// also gives us the `.setUser` method available
// after creating a new instance of Score
Score.belongsTo(User);

User.sync();
Score.sync();
Session.sync();
// creates these tables in MySQL if they don't already exist. Pass in {force: true}
// to drop any existing user and Score tables and make new ones.

// User.sync({force: true});
// Score.sync({force: true});
// Session.sync({force: true});

module.exports.db = db;
module.exports.User = User;
module.exports.Score = Score;
module.exports.Session = Session;