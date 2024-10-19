// profanityFilter.js
const swearWords = [
    "f*ck", "fuck",
    "s*it", "shit",
    "b*tch", "bitch",
    "a*shole", "asshole",
    "c*nt", "cunt",
    "d*ck", "dick",
    "p*ssy", "pussy",
    "b*stard", "bastard",
    "w*nker", "wanker",
    "c*cksucker", "cocksucker",
    "tw*t", "twat",
    "b*lls", "balls",
    "motherf*cker", "motherfucker",
    "sh*tstorm", "shitstorm",
    "p*ss", "piss",
    "c*cks", "cocks",
    "f*ggot", "faggot",
    "n*gger", "nigger", // Note: This term is highly offensive and should be handled with care.
    "sl*t", "slut",
    "f*ckface", "fuckface",
    "d*ckhead", "dickhead",
    "s*ck my d*ck", "suck my dick",
    "sh*thead", "shithead",
    "w*nt", "wont",
    "c*cksucker", "cocksucker",
    // Add more as needed
  ];
  
  
  const containsProfanity = (text) => {
    const regex = new RegExp(`\\b(${swearWords.join("|")})\\b`, "i");
    return regex.test(text);
  };
  
  module.exports = containsProfanity;
  