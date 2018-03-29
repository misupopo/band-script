
const updateArticle2 = require('../../routes/updateArticle2.js');

const executeAction = async () => {
    await updateArticle2.update();
};

(async () => {
    await executeAction();
    process.exit();
})();
