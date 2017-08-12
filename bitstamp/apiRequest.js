var rq = require('request-promise');

function apiRequest(params, req) {
  if (req) {
    var options = {
      uri: `https://www.bitstamp.net/api/v2/${params}/${req}`,
      json: true,
      resolveWithFullResponse: true
    }
  } else {
    var options = {
      uri: `https://www.bitstamp.net/api/v2/${params}`,
      json: true,
      resolveWithFullResponse: true
    }
  }
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    return err;
  });
};


module.exports = {
  apiRequest
};
