
const updateArticle1 = require('./routes/updateArticle1.js');
const updateArticle2 = require('./routes/updateArticle2.js');

const executeAction = async () => {

    await updateArticle1.justUpdate();
};

(async () => {
    await executeAction();

    process.exit();
})();
