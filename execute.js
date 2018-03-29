
const updateArticle = require('./routes/updateArticle1.js');
const updateArticle1 = require('./routes/updateArticle2.js');

const executeAction = async () => {
    await updateArticle.update();
    // await updateArticle1.update();
    // await updateArticle.create();
    // await updateArticle.remove();
};

(async () => {
    await executeAction();

    process.exit();
})();
