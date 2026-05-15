require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('connected to Redis'));

// Connect immediately
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;