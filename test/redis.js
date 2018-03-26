

const client = require('redis').createClient();

// const obj = { "status": 200, "message": "hogefuga" };
const args = [];
const key = 'recruitment';

function remove(key) {
    client.del(key);
}

function set(key, data) {
    return new Promise((resolve, reject) => {
        // JSオブジェクトを文字列に変換してsetする
        client.set(key, JSON.stringify(data), () => {
            resolve();
        });
    });
}

function get(key) {
    return new Promise((resolve, reject) => {
        // 文字列からJSオブジェクトに変換して利用する
        client.get(key, function(error, val){
            if (error) {
                console.log(error);
            }

            const data = JSON.parse(val);

            console.log(data);

            resolve();
        });
    });
}

(async () => {
    process.argv.forEach((val, index, array) => {
        if (index >= 2) {
            args.push(val)
        }
    });

    let recruitmentWord = '';

    if (args.length > 0) {
        args.forEach((val, index) => {
            if (index > 0) {
                recruitmentWord = (recruitmentWord + '、' + args[index]);
            } else {
                recruitmentWord = (recruitmentWord + args[index]);
            }
        });
    }

    await set(key, recruitmentWord);
    await get(key);

    process.exit();
})();









