const assert = require("assert");
const puppeteer = require("puppeteer");

describe("Test With Chrome", function() {
    let browser;
    let page;

    // TEST BEGINING / ENDING

    before(async function() {
        // run puppeteer browser and open page to widget
        browser = await puppeteer.launch({
            headless: true,
            slowMo: 100,
            timeout: 10000,
            args: ["--no-sandbox"]
        });
        page = await browser.newPage();
        await page.setViewport({
            width: 1024,
            height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(testing.baseurl + "index.html");
    });

    after(async function() {
        await testing.delay(2000);
        await page.close();
        await browser.close();
    });

    // BASIC TEST CASES

    describe("#Basic checks", function() {
        it("<div#app> is loaded", async function() {
            assert.ok(await page.waitForSelector("div#app"));
        });

        it("'window.widget' object exists", async function() {
            let widget = await page.evaluate("window.widget");
            assert.ok(typeof widget === "object");
            assert.ok(typeof widget.uwaUrl === "string");
        });
    });

    // TEST CASES

    describe("#others TBD...", function() {
        it("screenshot 'home.png'", async function() {
            await page.screenshot({ path: testing.reportdir + "home.png" });
        });

        it("TBD 1", async function() {
            assert.ok(true);
        });

        it("TBD 2", async function() {
            assert.ok(true);
        });
    });
});
