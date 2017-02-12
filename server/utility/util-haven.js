// Utility functions for sending twitter info through Haven On Demand API
var havenAPIKey = require('../config/haven.js');
var Promise = require('bluebird');
var axios = require('axios');

var Score = require('../db/index.js').Score;

module.exports = {
  // KG: I believe they just put twitterHandle as first argument just to get it in scope for callback
  getSentiment: (twitterHandle, tweets, callback) => {
    axios.get('https://api.havenondemand.com/1/api/async/analyzesentiment/v2', {
      params: {
        apikey: havenAPIKey['apikey'],
        text: tweets
      }
    }).then((response) => {
      // console.log('data.jobID===>', response.data.jobID);
      var jobID = response.data.jobID;
      var url = 'https://api.havenondemand.com/1/job/result/';
      url += jobID;
      axios.get(url, {
        params: {
          apikey: havenAPIKey['apikey']
        }
      })
      .then((response) => {
        // console.log('response ===>', response.data.actions[0].result);
        callback(null, response.data.actions[0].result.sentiment_analysis[0].aggregate.score);
        // Score.update({
        //   sentimentScore: response.data.actions[0].result.sentiment_analysis[0].aggregate.score
        // }, {
        //   where: {
        //     twitterHandle: twitterHandle,
        //     tweetText: tweets
        //   }
        // });
      }).catch((error) => {
        console.log('async result error');
        callback(error, null);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
};