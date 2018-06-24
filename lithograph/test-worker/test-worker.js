const headless = process.env.headless !== "false";
const launched = new Promise((resolve, reject) =>
    setImmediate(() =>
        require("puppeteer").launch({ headless })
            .then(resolve, reject)));

const { dirname } = require("path");
const puppeteerPath = dirname(require.resolve("puppeteer"));

const getPackageDescriptions = require("magic-ws/get-package-descriptions");
const packageDescriptions = getPackageDescriptions([], [puppeteerPath]);

require("magic-ws/modify-resolve-lookup-paths")(packageDescriptions);
require("./static");


module.exports = async function ({ filename, blocks, exports })
{
    const browser = await launched;
    const context = await browser.createIncognitoBrowserContext();

    try
    {
        const environment = blocks[0].language === "html" ?
            require("./test-browser") : require("./test-local");

        return await environment(filename, blocks, exports, context);
    }
    finally
    {
        await Promise.all((await browser.pages())
            .map(page => page.close()));
        await context.close();
    }
}
