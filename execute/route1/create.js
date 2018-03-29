
const updateArticle1 = require('../../routes/updateArticle1.js');

const executeAction = async () => {
    await updateArticle1.create();
};

(async () => {
    await executeAction();
    process.exit();
})();
