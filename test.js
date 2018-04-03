const fs = require('fs'),
    path = require('path');

(async () => {
    const askingText = await new Promise((resolve, reject) => {
        fs.readFile(path.resolve('./askingText.txt'), 'utf8', (err, text) => {
            resolve(text);
        });
    });

    const replaceText = askingText.replace(/\w+/, '');

    console.log(replaceText);
})();

