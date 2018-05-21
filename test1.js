
const cronJob = require('cron').CronJob;

(async () => {
    const cronTime = '* * * * * *';
    const job = new cronJob({
        //実行したい日時 or crontab書式
        cronTime: cronTime

        //指定時に実行したい関数
        , onTick: async () => {
            console.log('test success');
        }

        //ジョブの完了または停止時に実行する関数
        , onComplete: function() {
            console.log('onComplete!')
        }

        // コンストラクタを終する前にジョブを開始するかどうか
        , start: false

    });

    //ジョブ開始
    job.start();
})();



