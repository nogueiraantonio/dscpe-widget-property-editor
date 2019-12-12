const assert = require("assert");
const puppeteer = require("puppeteer");
const fs = require("fs");

const SHOW_TEST = process.env.SHOW_TEST === "true";

describe("Test Browser", function() {
    let browser;
    let page;

    const reportPage = function(name) {
        return new Promise((resolve, reject) => {
            page.screenshot({ path: `${testing.reportdir}/${name}.png` })
                .then(page.content())
                .then(dom => {
                    fs.writeFile(`${testing.reportdir}/${name}.dom.html`, dom, function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                })
                .catch(err => reject(err));
        });
    };

    // TEST BEGINING / ENDING

    before(async function() {
        // run puppeteer browser and open page to widget
        browser = await puppeteer.launch({
            headless: !SHOW_TEST,
            slowMo: 100,
            timeout: 10000,
            args: ["--no-sandbox"]
        });
        console.debug("    ==> Using " + (await browser.version()));

        page = await browser.newPage();
        await page.setViewport({
            width: 1024,
            height: 800,
            deviceScaleFactor: 1
        });

        await page.goto(testing.baseurl + "index.html");
    });

    after(async function() {
        if (SHOW_TEST) {
            console.debug("Test finished, waiting 5sec before close...");
            await testing.delay(5000);
        }
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

    describe("#UX checks", function() {
        it("report home page", async function() {
            await reportPage("home");
        });

        // initialize list of chapters
        const titles = ["Widget Template with Vue, VueX & Vuetify", "Chapter One", "Chapter Two", "Chapter Three", "Chapter Four"];
        /* we could use
         * titles = await loadTitles();
         * but it is not recommended to use source to generate test !
         */

        let cnt = 1;
        for (let title of titles) {
            let n = cnt++;
            it(`section #${n} : ${title}`, async function() {
                const selClk = `div.v-item-group > div:nth-child(${n}) > button`;
                const selDivTitle = "div.v-window-item--active div.row";
                await page.click(selClk);
                // check if button become active
                assert.ok(await page.waitForSelector(selClk + ".v-btn--active"));
                // check title
                let txt = await page.$eval(selDivTitle, el => el.innerText);
                assert.strictEqual(txt.trim(), title);

                await reportPage(`section${n}`);
            });
        }
    });
});

function loadTitles() /* eslint-disable-line no-unused-vars */ {
    return new Promise(resolve => {
        fs.readFile("README.md", (err, data) => {
            if (err) throw err;
            const ascii = data.toString("ascii");
            const RE = /^#\s+(.+?)$\b\s+/gm;
            let titles = [];
            let grps;
            while ((grps = RE.exec(ascii))) {
                titles.push(grps[1]);
            }
            resolve(titles);
        });
    });
}
