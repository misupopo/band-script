
const updateArticle1 = require('../../routes/updateArticle1.js');

const executeAction = async () => {
    await updateArticle1.update();
};

(async () => {
    await executeAction();
    process.exit();
})();
