

const client = require('redis').createClient();

// const obj = { "status": 200, "message": "hogefuga" };
const args = [];
const key = 'recruitment';

function remove(key) {
    return new Promise((resolve, reject) => {
        client.del(key, () => {
            resolve();
        });
    });
}

function set(key, data) {
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

function get(getKey) {
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

module.exports.set = set;
module.exports.get = get;

