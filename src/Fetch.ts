import * as puppeteer from "puppeteer";

const fetch = async (url: string) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);
    const pageContents = await page.content();
    await browser.close();

    return Promise.resolve(pageContents);
};

export default fetch;
