
const updateArticle = require('./routes/updateArticle.js');
const updateArticle1 = require('./routes/updateArticle1.js');

const executeAction = async () => {
    // await updateArticle.update();
    // await updateArticle1.update();
    await updateArticle.create();
};

(async () => {
    await executeAction();

    process.exit();
})();
