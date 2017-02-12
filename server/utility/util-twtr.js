// Utility functions for pulling messages from twitter API
var axios = require('axios');
var twitterAccessTokens = require('../config/twitter.js');
var Promise = require('bluebird');

var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: twitterAccessTokens['consumer_key'],
  consumerSecret: twitterAccessTokens['consumer_secret'],
  callback: 'http://127.0.0.1:3000/oauth'
});

// Promisify twitter-npm module functions for asynchronous use
  // When multiargs === true must use spread function to rec   eive multiple responses
var twtrGetReqTokenAsync = Promise.promisify(twitter.getRequestToken, {context: twitter, multiArgs: true});
var twtrGetAccessTokenAsync = Promise.promisify(twitter.getAccessToken, {context: twitter, multiArgs: true});
var twtrVerifyCredentialsAsync = Promise.promisify(twitter.verifyCredentials, {context: twitter, multiArgs: true});
var twtrGetTimelineAsync = Promise.promisify(twitter.getTimeline, {context: twitter, multiArgs: true});
// KG: testing out...
var twtrSearchAsync = Promise.promisify(twitter.search, {context: twitter, multiArgs: true});



module.exports = {
  getTweets: function(username, callback) {
    let accessToken = twitter.accessToken;
    let accessTokenSecret = twitter.accessTokenSecret;
    twtrGetTimelineAsync('user', {'screen_name': username, count: 50}, accessToken, accessTokenSecret)
    .spread((data, response) => {
      callback(null, data, response);
    })
    .catch((err) => {
      console.error('Timeline retrieval error ', err);
      callback(err);
    });
  },


  getTweetsByTopic: function(topic, location, callback) {
    let accessToken = twitter.accessToken;
    let accessTokenSecret = twitter.accessTokenSecret;
    twitter.search({'q': topic, 'geocode': location, count: 50}, accessToken, accessTokenSecret, function(err, data, response) {
      console.log('twitter search just returned');
      if (err) {
        console.log('getTweetsByTopic failed');
        return console.error(err)
      } else {
        console.log('getTweetsByTopic success');
        console.log(data);
        return callback(err, data, response);
      }
    })
  },

  getRequestToken: function(req, res) {

    twtrGetReqTokenAsync()
    .spread((requestToken, requestTokenSecret, results) => {
      // Save down request token / secret onto twitter object
        // In future would save down information within AuthO session if possible
      twitter['requestToken'] = requestToken;
      twitter['requestTokenSecret'] = requestTokenSecret;
      // Helper function from module to string together url we should redirect to in  order to receive verifier
      let url = twitter.getAuthUrl(requestToken);
      console.log('URL', url);
      // Redirecting to url above will ping twitter for a verifier, which will be sent to the callback
      // above as part of the querystring
      res.redirect(url);
    })
    .then((response) => {
      console.log('REDIRECTION');
      res.status(200).end('successful redirection');
    })
    .catch((err) => {
      console.error('Request Token Error: ', err);
    });

  },

  getAccessToken: function(req, res, oAuthVerifier) {
    // user oAuthVerifier from querystring to get access tokens
    let requestToken = twitter.requestToken;
    let requestTokenSecret = twitter.requestTokenSecret;

    twtrGetAccessTokenAsync(requestToken, requestTokenSecret, oAuthVerifier)
    .spread((accessToken, accessTokenSecret, results) => {
      // Save access tokens to twitter object
        // Would save these to session in future scenarios if possible
      twitter['accessToken'] = accessToken;
      twitter['accessTokenSecret'] = accessTokenSecret;
      twitter['results'] = results;
      // Verify twitter credentials have been accepted
      return twtrVerifyCredentialsAsync(accessToken, accessTokenSecret, results);
    })
    .spread((data, response) => {
      // Check screen name of verified user
      console.log('SCREEN NAME: ', data['screen_name']);
      res.status(200).redirect('/');
    })
    .catch((err) => {
      console.error('twitter request token error', err);
      res.status(404).end();
    });
  },

  getTweetString: function(tweetJSON) {
    let string = '';
    let favoriteCount = 0;
    let retweetCount = 0;
    // Should we be creating an array or concatenating a string?
    tweetJSON.forEach((tweet) => {
      string += tweet.text + ' ';
      favoriteCount += tweet.favorite_count;
      retweetCount += tweet.retweet_count;
    });

    string = string.replace(/[^\x00-\x7F]/g, '');

    return {string, favoriteCount, retweetCount};
  },

  getTweetStringForTopic: function(tweetJSON) {
    let string = '';
    tweetJSON.statuses.forEach((tweet) => {
      string+= tweet.text + ' ';
    })

    string = string.replace(/[^\x00-\x7F]/g, '');

    return string;
  },

  twitter: twitter
};