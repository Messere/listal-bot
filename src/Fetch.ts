import * as cloudscraper from "cloudscraper";

const fetch = async (url: string) => {
    return cloudscraper.get(url);
};

export default fetch;
