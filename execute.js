
const updateArticle1 = require('./routes/updateArticle1.js');
const updateArticle2 = require('./routes/updateArticle2.js');
const cronJob = require('cron').CronJob;

const redis = require('./lib/redis');

const actionData = {
    updateTime1: updateArticle1.justUpdate,
    updateTime2: updateArticle2.update,
    rotationAsking1: updateArticle1.rotationAsking
};

const executeAction = async () => {
    // await updateArticle1.justUpdate();
    await updateArticle2.update();

    // await updateArticle1.rotationAsking('Gt');
    // await updateArticle1.rotationAsking('Ba');
    // await updateArticle1.rotationAsking('Dr');
};

const executeOurSound = async (askingPart) => {
    await actionData.updateTime1();
    await actionData.rotationAsking1(askingPart);
};

const executeWith9 = async () => {
    await actionData.updateTime2();
};

(async () => {
    const ourSoundExecuteFlag = false;
    const with9ExecuteFlag = true;

    // 毎秒実行
    const askingTime = await redis.get('rotationAsking1');
    const askingPart = await redis.get('askingPart');
    const updateTime2 = await redis.get('updateTime2');

    // 一度だけ実行したい場合、Dateオブジェクトで指定も可能
    // const cronTime = new Date();

    if (ourSoundExecuteFlag) {
        const ourSound = new cronJob({
            //実行したい日時 or crontab書式
            cronTime: askingTime

            //指定時に実行したい関数
            , onTick: async () => {
                await executeOurSound(askingPart);
            }

            //ジョブの完了または停止時に実行する関数
            , onComplete: function() {
                console.log('onComplete!')
            }

            // コンストラクタを終する前にジョブを開始するかどうか
            , start: false

        });

        ourSound.start();
    }

    // 5秒置き
    // cronTime: '*/5 * * * * *',

    if (with9ExecuteFlag) {
        const with9Update = new cronJob({
            cronTime: '*/30 * * * * *',
            onTick: async () => {
                await executeWith9();
                console.log('with9Update: ' + Date.now());
            },
            onComplete: function() {
                console.log('onComplete!');
            },
            start: false
        });

        with9Update.start();
    }

    // process.exit();
})();





