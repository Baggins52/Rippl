var twitterUtil = require('../utility/util-twtr.js');
var havenUtil = require('../utility/util-haven.js');
var Promise = require('bluebird');
var {Score} = require('../db/index.js');
var {User} = require('../db/index.js');


var getTweetsAsync = Promise.promisify(twitterUtil.getTweets, {context: twitterUtil, multiArgs: true});
var getTweetsByTopicAsync = Promise.promisify(twitterUtil.getTweetsByTopic, {context: twitterUtil, multiArgs: true});
var getSentimentAsync = Promise.promisify(havenUtil.getSentiment, {context: havenUtil});

module.exports = {
  getHandleAnalysis: function(req, res, next) {
    console.log('getHandleAnalysis CALLED');
    console.log('request', req.params);
    // reads variables off query string
    var twitterHandle = req.query.handle;
    var clientUserName = req.query.clientUserName;
    var globaldata, globaltweetData, globalsentiment;

    getTweetsAsync(twitterHandle)
    .spread((data, response) => {
      globaldata = data;
      globaltweetData = twitterUtil.getTweetString(globaldata);
      return getSentimentAsync(twitterHandle, globaltweetData.string);
    })
    .then((sentiment) => {
      globalsentiment = sentiment;
      console.log('response ==>', sentiment);
      return User.findOne({where: {username: clientUserName}});
    })
    .then(function(user) {
      return Score.findOne({where: {twitterHandle: twitterHandle, UserID: user.id}})
        .then((Score) => {

           return Score.update({
            twitterHandle: twitterHandle,
            numTweets: globaldata.length,
            tweetText: globaltweetData.string,
            sentimentScore: globalsentiment,
            retweetCount: globaltweetData.retweetCount,
            favoriteCount: globaltweetData.favoriteCount
           })
        .then((newScore) => newScore.setUser(user.id)
        .then((newScore) => newScore));
    })
    .then((newScore) => {
      console.log('New score created!');
      return res.status(200).json(newScore);
    })
    .catch((err) => {
      console.error('Analysis error ');
      return Score.create({
        twitterHandle: twitterHandle,
        numTweets: globaldata.length,
        tweetText: globaltweetData.string,
        sentimentScore: globalsentiment,
        retweetCount: globaltweetData.retweetCount,
        favoriteCount: globaltweetData.favoriteCount
      }).then((newScore) => newScore.setUser(user.id)
        .then((newScore) => newScore)).
      then((score) => {
        return res.status(200).json(score);
      }).catch((err) => {
        return res.status(404).end();
    });
  });
  })
  },


  getTopicAnalysis: function(req, res, next) {
    
    console.log('getTopicAnalysis CALLED ---------------------');
    console.log(req.query);

    // reads variables off query string
    var geoString = req.query.coordinates
    var clientUserName = req.query.clientUserName
    var topic = req.query.topic
    var location = req.query.location

    // adds search radious of 10km
    if (geoString) {
      geoString += ',10km'
    }

    //Dev Note: twitterHandle needs to be removed after branch that implements no duplicates is added. Breaks now without it.
    var twitterHandle;

    getTweetsByTopicAsync(topic, geoString)
    .spread((data, response) => {

      globaldata = data;
      globalTweetString = twitterUtil.getTweetStringForTopic(globaldata);
      return getSentimentAsync(null, globalTweetString);
    })
    .then((sentiment) => {
      globalsentiment = sentiment;
      return User.findOne({where: {username: clientUserName}});
    })
    .then(function(user) {

      return Score.findOne({where: {twitterHandle: twitterHandle}})
      .then((score) => {

      //return Score.create({
      return Score.create({
        topic: topic,
        location: geoString,
        tweetText: globalTweetString,
        sentimentScore: globalsentiment,
      })

        .then((newScore) => newScore.setUser(user.id)
        .then((newScore) => newScore));
    })
    .then((newScore) => {
      console.log('New score created!');
      return res.status(200).json(newScore);
    })
    .catch((err) => {
      console.log('Analysis error ');
      return res.status(404).end();
    });
  })
  },

  getRequestToken: function(req, res, next) {
    twitterUtil.getRequestToken(req, res);
  },

  getAccessToken: function(req, res, next) {
    // Receives callback that contains oAuth verifier
    // Pull verifier from query parameters
    // Send oAuth verifier through utility function and user promises to verify consumer keys
    let oAuthVerifier = req.query.oauth_verifier;
    twitterUtil.getAccessToken(req, res, oAuthVerifier);
  },

  getUserScores: function(req, res, next) {
    // console.log('Username param: ' + req.params.username);
    let username = req.params.username || 'RipplMaster';
    User.findOrCreate({where: { username: username }})
    .then(function(user) {
      var userID = user[0].dataValues.id;
      return Score.findAll({where: {UserId: userID}});
    })
    .then(function(scores) {
      res.status(200).json(scores);
    })
    .catch(function(err) {
      console.error('Error fetching user scores', err);
      res.status(404).end();
    });

  },

  createTestUser: function(req, res, next) {
    User.findOrCreate({where: {username: 'RipplMaster'}, defaults: {password: ''}})
    .then((user) => {
      console.log('testUser created');
      res.status(200).end();
    })
    .catch((err) => {
      console.log('RipplMaster creation error');
      res.status(404).end();
    });
  }

};
