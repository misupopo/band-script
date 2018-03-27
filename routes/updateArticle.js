
const puppeteer = require('puppeteer'),
    config = require('../config/config.js'),
    redis = require('../lib/redis');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    await page.goto(config.url + 'member/');

    await page.type('input[name="userMail"]', config.id);
    await page.type('input[name="userPw"]', config.password);

    await Promise.all([
        page.$eval('.btn2_c1 button', target => target.click()),
        page.waitForNavigation(),
    ]);

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

    await Promise.all([
        page.$eval('.bg_o2', target => target.click()),
        page.waitForNavigation(),
    ]);

    await browser.close();

    process.exit();
})();



