const redis = require('./lib/redis');


(async () => {
    await redis.configSet();

    process.exit();
})();


