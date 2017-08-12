var rq = require('request-promise');

function apiRequest(params, req) {
    var options = {
      uri: `https://api.kraken.com/0/public/${params}`,
      qs: req,
      json: true,
      resolveWithFullResponse: true
    };
  return rq(options).then((res) => {
    return res;
  }).catch((err) => {
    return err;
  });
};


module.exports = {
  apiRequest
};
