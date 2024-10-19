// sentimentUtil.js
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  
  // Determine sentiment based on the score
  if (result.score > 0) {
    return "Good";
  } else if (result.score < 0) {
    return "Bad";
  } else {
    return "Neutral";
  }
};

module.exports = analyzeSentiment;
