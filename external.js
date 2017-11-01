var hasMin = (Array.prototype.hasMin = function(attrib) {
  return this.reduce(function(prev, curr) {
    return parseFloat(prev[attrib]) < parseFloat(curr[attrib]) ? prev : curr;
  });
});

var hasMax = (Array.prototype.hasMax = function(attrib) {
  return this.reduce(function(prev, curr) {
    return parseFloat(prev[attrib]) > parseFloat(curr[attrib]) ? prev : curr;
  });
});

module.exports = {
  hasMin,
  hasMax
};
