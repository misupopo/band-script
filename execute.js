
const updateArticle1 = require('./routes/updateArticle1.js');
const updateArticle2 = require('./routes/updateArticle2.js');
const cronJob = require('cron').CronJob;

const executeAction = async () => {
    // await updateArticle1.justUpdate();
    await updateArticle2.update();

    // await updateArticle1.rotationAsking('Gt');
    // await updateArticle1.rotationAsking('Ba');
    // await updateArticle1.rotationAsking('Dr');
};

(async () => {
    // 毎秒実行
    const cronTime = '* * * * * *';

    // 一度だけ実行したい場合、Dateオブジェクトで指定も可能
    // const cronTime = new Date();

    // const job = new cronJob({
    //     //実行したい日時 or crontab書式
    //     cronTime: cronTime
    //
    //     //指定時に実行したい関数
    //     , onTick: async () => {
    //         await executeAction();
    //     }
    //
    //     //ジョブの完了または停止時に実行する関数
    //     , onComplete: function() {
    //         console.log('onComplete!')
    //     }
    //
    //     // コンストラクタを終する前にジョブを開始するかどうか
    //     , start: false
    //
    // });
    //
    // //ジョブ開始
    // job.start();

    // await executeAction();

    // const with9Update = new cronJob({
    //     cronTime: '*/1 * * * *',
    //     onTick: async () => {
    //         await updateArticle2.update();
    //     },
    //     onComplete: function() {
    //         console.log('onComplete!')
    //     },
    //     start: false
    // });
    //
    // with9Update.start();

    await executeAction();

    process.exit();
})();





