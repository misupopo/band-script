
const puppeteer = require('puppeteer'),
    config = require('../config/config.js'),
    redis = require('../lib/redis'),
    path = require('path'),
    fs = require('fs');

let page;

const loginAction = async () => {
    const browser = await puppeteer.launch({
        headless: !!config.developerMode,
    });
    page = await browser.newPage();

    await page.goto(config.url + 'member/');

    await page.type('input[name="userMail"]', config.id);
    await page.type('input[name="userPw"]', config.password);

    await Promise.all([
        page.$eval('.btn2_c1 button', target => target.click()),
        page.waitForNavigation(),
    ]);

    return browser;
};

const updateArticle = async () => {
    const browser = await loginAction();

    await Promise.all([
        page.$eval('#article_menu li:nth-child(0n+3) a', target => target.click()),
        page.waitForNavigation(),
    ]);

    const editTile = await page.evaluate(() => document.querySelector('input[name="documentTitle"]').value);
    const changeWord = await redis.get();

    const newEditTitle = editTile.replace(/\s(.*)/, ' ' + changeWord + '（デモ音源あり）');

    await page.evaluate(() => {
        document.querySelector('input[name="documentTitle"]').value = ''
    });

    await page.type('input[name="documentTitle"]', newEditTitle);

    const editBody = await page.evaluate(() => document.querySelector('textarea[name="documentBody"]').value);
    const newEditBody = editBody.replace(/(.+)(?=\を募集しております)/, changeWord);

    await page.evaluate((text) => {
        document.querySelector('textarea[name="documentBody"]').value = text;
    }, newEditBody);

    const splitData = changeWord.split('、');

    splitData.forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart2').checked = true;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart3').checked = true;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart5').checked = true;
            });
        }
    });

    await page.evaluate(() => {
        document.querySelector('input#documentGenre1').checked = true;
    });

    await page.evaluate(() => {
        document.querySelector('input#documentGenre2').checked = true;
    });

    await page.evaluate(() => {
        document.querySelector('input#postTwitter').checked = true;
    });

    await Promise.all([
        page.$eval('.bg_o2', target => target.click()),
        page.waitForNavigation(),
    ]);

    await browser.close();
};

const removeArticle = async () => {
    const browser = await loginAction();

    await Promise.all([
        page.$eval('#article_menu li:nth-child(0n+4) a', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('.bg_o2', target => target.click()),
        page.waitForNavigation(),
    ]);

    await browser.close();
};

const createArticle = async () => {
    const browser = await loginAction();

    await Promise.all([
        page.$eval('#article_menu li:nth-child(0n+3) a', target => target.click()),
        page.waitForNavigation(),
    ]);

    await page.select('select[name="documentFlg"]', '1');

    const changeWord = await redis.get();

    await page.type('input[name="documentTitle"]', 'バンドメンバー募集 ' + changeWord + '（デモ音源あり）');

    await page.evaluate(() => {
        document.querySelector('input#documentPref8').checked = true;
    });

    await page.select('select[name="documentWeekday"]', '2');

    await page.select('select[name="documentAim"]', '2');

    await page.select('select[name="documentSex"]', 'm');

    await page.select('select[name="documentSongType"]', '1');

    await page.evaluate((text) => {
        document.querySelector('input[name="documentSongUrl"]').value = text;
    }, config.songUrl);

    const splitData = changeWord.split('、');

    splitData.forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart2').checked = true;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart3').checked = true;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart5').checked = true;
            });
        }
    });

    await page.evaluate(() => {
        document.querySelector('input#documentGenre1').checked = true;
    });

    await page.evaluate(() => {
        document.querySelector('input#documentGenre2').checked = true;
    });

    await page.evaluate(() => {
        document.querySelector('input#postTwitter').checked = true;
    });

    let articleText = await new Promise((resolve, reject) => {
        fs.readFile(path.resolve('./articleText.txt'), 'utf8', (err, text) => {
            resolve(text);
        });
    });

    const newEditBody = articleText.replace(/(.+)(?=\を募集しております)/, changeWord);

    await page.evaluate((text) => {
        document.querySelector('textarea[name="documentBody"]').value = text;
    }, newEditBody);

    await Promise.all([
        page.$eval('.bg_o2', target => target.click()),
        page.waitForNavigation(),
    ]);

    await page.screenshot({path: path.resolve(config.imgPath) + '/sample.png', fullPage: true});

    await browser.close();
};




module.exports.update = updateArticle;
module.exports.remove = removeArticle;
module.exports.create = createArticle;
