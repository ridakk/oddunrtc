var redis = require('redis').createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

module.exports = redis;
