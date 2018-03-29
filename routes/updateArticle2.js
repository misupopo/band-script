
const puppeteer = require('puppeteer'),
    config = require('../config/config.js'),
    redis = require('../lib/redis'),
    path = require('path');

const updateArticle1 = async () => {
    const browser = await puppeteer.launch({
        headless: !!config.developerMode,
    });

    const page = await browser.newPage();

    await page.goto(config.url1 + 'logins/login/');

    await page.type('input[name="data[MMember][mail]"]', config.id);
    await page.type('input[name="data[MMember][passwd]"]', config.password);

    await Promise.all([
        page.$eval('.login input', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('a.side-name', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('.post-total a', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('input[value="編集"]', target => target.click()),
        page.waitForNavigation(),
    ]);

    const editTile = await page.evaluate(() => document.querySelector('input[name="data[MemberRequest][title]"]').value);
    const changeWord = await redis.get();

    const newEditTitle = editTile.replace(/\s(.*)/, ' ' + changeWord + '（デモ音源あり）');

    await page.evaluate(() => {
        document.querySelector('input[name="data[MemberRequest][title]"]').value = ''
    });

    await page.type('input[name="data[MemberRequest][title]"]', newEditTitle);

    const editBody = await page.evaluate(() => document.querySelector('textarea[name="data[MemberRequest][post_text]"]').value);
    const newEditBody = editBody.replace(/(.+)(?=\を募集しております)/, changeWord);

    await page.evaluate((text) => {
        document.querySelector('textarea[name="data[MemberRequest][post_text]"]').value = text;
    }, newEditBody);

    ['Gt','Ba','Dr'].forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartエレキギター').checked = false;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartエレキベース').checked = false;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartドラム').checked = false;
            });
        }
    });

    const splitData = changeWord.split('、');

    splitData.forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartエレキギター').checked = true;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartエレキベース').checked = true;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#MemberPartPartドラム').checked = true;
            });
        }
    });

    await page.screenshot({path: path.resolve(config.imgPath) + '/exec2.png', fullPage: true});

    await Promise.all([
        page.$eval('#contents-btn', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('input[name="login_action"][value="登録"]', target => target.click()),
        page.waitForNavigation(),
    ]);

    await browser.close();

    // process.exit();
};

module.exports.update = updateArticle1;
