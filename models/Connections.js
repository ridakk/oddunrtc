var connections = {};

exports.add = function(key, value) {
  if (!connections[key]) {
    connections[key] = value;
  }
};

exports.get = function(key) {
  return connections[key];
};
