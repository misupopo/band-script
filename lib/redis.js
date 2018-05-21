const client = require('redis').createClient();
const configData = require('../config/config.js');

const key = 'recruitment';

const remove = (key) => {
    return new Promise((resolve, reject) => {
        client.del(key, () => {
            resolve();
        });
    });
}

const set = (key, data) => {
    let recruitmentWord = '';

    if (data.length > 0) {
        data.forEach((val, index) => {
            if (index > 0) {
                recruitmentWord = (recruitmentWord + '、' + data[index]);
            } else {
                recruitmentWord = (recruitmentWord + data[index]);
            }
        });
    } else {
        recruitmentWord = data;
    }

    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(recruitmentWord), () => {
            resolve();
        });
    });
}

const get = (getKey) => {
    const targetKey = getKey || key;

    return new Promise((resolve, reject) => {
        client.get(targetKey, function(error, val){
            if (error) {
                console.log(error);
            }

            const data = JSON.parse(val);
            // console.log(data);

            resolve(data);
        });
    });
}

const list = () => {
    return new Promise((resolve, reject) => {
        // 文字列からJSオブジェクトに変換して利用する
        client.keys('*', async function(error, keys){
            if (error) {
                console.log(error);
            }

            const redisData = {};

            for(let i = 0, len = keys.length; i < len; i++) {
                redisData[keys[i]] = await get(keys[i]);
            }

            resolve(redisData);
        });
    });
}

const configSet = async () => {
    await new Promise((resolve, reject) => {
        client.flushdb((err, succeeded) => {
            console.log(succeeded); // will be true if successfull
            resolve();
        });
    })

    return new Promise((resolve, reject) => {
        Object.keys(configData).map(async (key) => {
            await setDatabase(key, configData[key]);
        });

        resolve();
    });
}

const setDatabase = (key, data) => {
    return new Promise((resolve, reject) => {
        // JSオブジェクトを文字列に変換してsetする
        client.set(key, JSON.stringify(data), () => {
            resolve();
        });
    });
}

module.exports.set = set;
module.exports.get = get;
module.exports.setDatabase = setDatabase;
module.exports.configSet = configSet;
