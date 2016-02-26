var connections = {};

exports.add = function(key, value) {
  if (!connections[key]) {
    connections[key] = value;
  }
  console.log("conn model add %j k:%s v:%s", connections, key, value);
};

exports.get = function(key) {
  return connections[key];
  console.log("conn model get %j k:%s v:%s", connections, key, connections[key]);
};
