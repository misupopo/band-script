
const puppeteer = require('puppeteer'),
    config = require('../config/config.js'),
    redis = require('../lib/redis'),
    path = require('path'),
    fs = require('fs');

let page;

const nodeEvents = require('events');
nodeEvents.EventEmitter.prototype._maxListeners = 300;

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

    ['Gt','Ba','Dr'].forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart2').checked = false;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart3').checked = false;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart5').checked = false;
            });
        }
    });

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

    await page.screenshot({path: path.resolve(config.imgPath) + '/exec.png', fullPage: true});

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

    ['Gt','Ba','Dr'].forEach(async (data) => {
        if (data === 'Gt') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart2').checked = false;
            });
        } else if (data === 'Ba') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart3').checked = false;
            });
        } else if (data === 'Dr') {
            await page.evaluate(() => {
                document.querySelector('input#documentPart5').checked = false;
            });
        }
    });

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

    await page.screenshot({path: path.resolve(config.imgPath) + '/exec.png', fullPage: true});

    await browser.close();
};

const justUpdate = async () => {
    const browser = await loginAction();

    const isHrefMatch = await page.evaluate(() => document.querySelector('#article_menu li:nth-child(0n+2)').innerHTML);

    if (isHrefMatch.match(/href/)) {
        await Promise.all([
            page.$eval('#article_menu li:nth-child(0n+2) a', target => target.click()),
            page.waitForNavigation(),
        ]);
    }

    await page.screenshot({path: path.resolve(config.imgPath) + '/justUpdate.png', fullPage: true});

    await browser.close();
};

const rotationAsking = async (data) => {
    const browser = await loginAction();

    await Promise.all([
        page.$eval('#logo a', target => target.click()),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.$eval('.bg_g2.ic_searchmember', target => target.click()),
        page.waitForNavigation(),
    ]);

    // 県を選択
    await page.evaluate(() => {
        document.querySelector('input#userPref8').checked = true;
    });

    // 楽器を選択
    if (data === 'Gt') {
        await page.evaluate(() => {
            document.querySelector('input#userPart2').checked = true;
        });
    } else if (data === 'Ba') {
        await page.evaluate(() => {
            document.querySelector('input#userPart3').checked = true;
        });
    } else if (data === 'Dr') {
        await page.evaluate(() => {
            document.querySelector('input#userPart5').checked = true;
        });
    }

    // ジャンル ポップを選択
    await page.evaluate(() => {
        document.querySelector('input#userGenre1').checked = true;
    });

    // ジャンル ロックを選択
    await page.evaluate(() => {
        document.querySelector('input#userGenre2').checked = true;
    });

    // 年齢を入力
    await page.evaluate(() => {
        document.querySelector('input[name="userAge1"]').value = '25'
    });

    // 検索をクリック
    await Promise.all([
        page.$eval('.btn2_c2 .submit button', target => target.click()),
        page.waitForNavigation(),
    ]);

    const task = [];

    for(let i = 0; i < config.rotationStopCount; i++) {
        task.push(Promise.resolve(page.evaluate(async () => {
            await document.querySelector('.show_more').click();
        })));

        task.push(Promise.resolve(await page.waitFor(6000)));
    }

    await Promise.all(task);

    // const getDetailUrl = await page.evaluate(() => {
    //     return document.querySelector('.jsArchive article:nth-child(0n+1) a').href;
    // });

    // const detailUrl = getDetailUrl.replace(/(\d*)$/, '');

    // idを取得
    const idList = await page.$$eval('.jsArchive article', elements => elements.map((target) => {
        return target.getAttribute('data-userid')
    }));

    // 自分のidを除外
    const filterList = idList.filter((value) => {
        return value !== config.myId
    });

    // 問い合わせる回数
    let shouldAskingCount = config.shouldAskingCount;

    const shouldAskTask = [];

    const testAsk = async (targetId) => {
        return new Promise(async (resolve, reject) => {
            const id = targetId;

            if (shouldAskingCount <= 0) {
                return resolve('end');
            }

            await page.$eval('article[data-userid="' + id + '"] a', target => target.click());

            const isVocal = await page.evaluate((id) => document.querySelector('article[data-userid="' + id + '"] .spec').innerHTML, id);

            if (isVocal.match(/ボーカル/)) {
                console.log('true');
                return resolve();
            } else {
                console.log('false');
            }

            await page.evaluate((id) => {
                document.querySelector('article[data-userid="' + id + '"] .detail_menu li:nth-child(0n+3) a').removeAttribute('target')
            }, id);

            await Promise.all([
                page.$eval('article[data-userid="' + id + '"] .detail_menu li:nth-child(0n+3) a', target => target.click()),
                page.waitForNavigation(),
            ]);

            const isMessaged = await page.evaluate(() => document.querySelector('#talks').innerHTML);

            if (!isMessaged.match(/talk_res/) && !isMessaged.match(/talk_message/)) {
                console.log('check text');

                let askingText = await new Promise((resolve, reject) => {
                    fs.readFile(path.resolve('./askingText.txt'), 'utf8', (err, text) => {
                        resolve(text);
                    });
                });

                let partText;

                if (data === 'Gt') {
                    partText = 'ギター';
                } else if (data === 'Ba') {
                    partText = 'ベース';
                } else if (data === 'Dr') {
                    partText = 'ドラム';
                }

                const replaceText = await askingText.replace(/\w+/, partText);

                await page.evaluate((text) => {
                    document.querySelector('textarea[name="messageBody"]').value = text;
                }, replaceText);

                // 回数を減らす
                shouldAskingCount = (shouldAskingCount - 1);
            }

            console.log('last resolve');
            await page.goto(config.url + 'メンバー/list',
                {
                    waitUntil: 'networkidle2',
                    timeout: 3000000
                }).then(() => {
                resolve();
            }).catch(reason => {
                console.log(reason);
            });
        });
    };

    // await testAsk(filterList[1]);
    //
    // console.log('testAskEnd 1');
    //
    // await testAsk(filterList[2]);
    //
    // console.log('testAskEnd 2');

    const testArray = [filterList[1], filterList[2]];

    for (let i = 0; i < filterList.length; i++) {
        const continueFlag = await testAsk(filterList[i]);

        if (!continueFlag === 'end') {
            break;
        }
    }

    console.log('complete');



    // await Promise.all([
    //     await testAsk(filterList[1]),
    //     await testAsk(filterList[2])
    // ]);

    // for(let i = 0; i < filterList.length; i++) {
    //     const id = filterList[i];
    //
    //     shouldAskTask.push(new Promise(async (resolve, reject) => {
    //         if (shouldAskingCount <= 0) {
    //             return resolve();
    //         }
    //
    //         console.log('1');
    //
    //         await page.$eval('article[data-userid="' + id + '"] a', target => target.click());
    //
    //         console.log('2');
    //
    //         const isVocal = await page.evaluate(() => document.querySelector('article[data-userid="' + id + '"] .spec').innerHTML);
    //
    //         if (isVocal.match(/ボーカル/)) {
    //             // console.log(isVocal);
    //
    //             console.log('true');
    //             return resolve();
    //         } else {
    //             // console.log(isVocal);
    //             console.log('false');
    //         }
    //
    //         console.log('3');
    //
    //         await page.evaluate(() => {
    //             document.querySelector('article[data-userid="' + id + '"] .detail_menu li:nth-child(0n+3) a').removeAttribute('target')
    //         });
    //
    //         console.log('4');
    //
    //         await Promise.all([
    //             page.$eval('article[data-userid="' + id + '"] .detail_menu li:nth-child(0n+3) a', target => target.click()),
    //             page.waitForNavigation(),
    //         ]);
    //
    //         // await Promise.all([
    //         //     page.$eval('article[data-userid="' + id + '"] a', target => target.click()),
    //         //     page.waitForNavigation(),
    //         // ]);
    //
    //         console.log('5');
    //
    //         const isMessaged = await page.evaluate(() => document.querySelector('#talks').innerHTML);
    //
    //         if (!isMessaged.match(/talk_res/) && !isMessaged.match(/talk_message/)) {
    //             console.log('check text');
    //
    //             let askingText = await new Promise((resolve, reject) => {
    //                 fs.readFile(path.resolve('./askingText.txt'), 'utf8', (err, text) => {
    //                     resolve(text);
    //                 });
    //             });
    //
    //             let partText;
    //
    //             if (data === 'Gt') {
    //                 partText = 'ギター';
    //             } else if (data === 'Ba') {
    //                 partText = 'ベース';
    //             } else if (data === 'Dr') {
    //                 partText = 'ドラム';
    //             }
    //
    //             const replaceText = await askingText.replace(/\w+/, partText);
    //
    //             await page.evaluate((text) => {
    //                 document.querySelector('textarea[name="messageBody"]').value = text;
    //             }, replaceText);
    //
    //             // 回数を減らす
    //             shouldAskingCount = (shouldAskingCount - 1);
    //         }
    //
    //         console.log('last resolve');
    //         resolve();
    //     }));
    // }

    // await Promise.all(shouldAskTask);

    // for(let j = 0; shouldAskTask.length; j++) {
    //     console.log(shouldAskTask[j]);
    //
    //     await shouldAskTask[j]();
    // }

    // filterList.forEach(async(id) => {
    //
    //     if (shouldAskingCount <= 0) {
    //         return;
    //     }
    //
    //     console.log('before move メンバー page');
    //
    //     await page.goto(config.url + 'メンバー/detail/' + id,
    //     {
    //         waitUntil: 'networkidle2',
    //         timeout: 3000000
    //     }).catch(reason => {
    //         console.log(reason);
    //     });
    //
    //     console.log('after move メンバー page');
    //
    //     const isVocal = await page.evaluate(() => document.querySelector('.spec').innerHTML);
    //
    //     if (isVocal.match(/ボーカル/)) {
    //         console.log('true');
    //         return;
    //     } else {
    //         console.log('false');
    //     }
    //
    //     console.log('before move message page');
    //
    //     await page.goto(config.url + 'member/message/index/' + id,
    //     {
    //         waitUntil: 'networkidle2',
    //         timeout: 3000000
    //     }).catch(reason => {
    //         console.log(reason);
    //     });
    //
    //     console.log('moved message page');
    //
    //     const isMessaged = await page.evaluate(() => document.querySelector('#talks').innerHTML);
    //
    //     if (!isMessaged.match(/talk_res/) && !isMessaged.match(/talk_message/)) {
    //         console.log('check text');
    //
    //         let askingText = await new Promise((resolve, reject) => {
    //             fs.readFile(path.resolve('./askingText.txt'), 'utf8', (err, text) => {
    //                 resolve(text);
    //             });
    //         });
    //
    //         let partText;
    //
    //         if (data === 'Gt') {
    //             partText = 'ギター';
    //         } else if (data === 'Ba') {
    //             partText = 'ベース';
    //         } else if (data === 'Dr') {
    //             partText = 'ドラム';
    //         }
    //
    //         const replaceText = await askingText.replace(/\w+/, partText);
    //
    //         await page.evaluate((text) => {
    //             document.querySelector('textarea[name="messageBody"]').value = text;
    //         }, replaceText);
    //
    //         // 回数を減らす
    //         shouldAskingCount = (shouldAskingCount - 1);
    //     }
    //
    //     console.log(id);
    //     console.log('last resolve');
    //
    // });

    // console.log('complete');
};


module.exports.update = updateArticle;
module.exports.remove = removeArticle;
module.exports.create = createArticle;
module.exports.justUpdate = justUpdate;
module.exports.rotationAsking = rotationAsking;
