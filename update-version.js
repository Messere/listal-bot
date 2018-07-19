const fs = require('fs');

const version = require("./package.json").version;
const versionFile = "./dist/Version.js";

const contents = fs.readFileSync(versionFile).toString();
fs.unlinkSync(versionFile);
fs.writeFileSync(
    versionFile,
    contents.replace("{VERSION_PLACEHOLDER}", version)
);
