const { log } = console;
const { resolve } = require("path");
const { readFileSync } = require("fs");
const { parse } = require("yaml");

exports.getFeatures = (featureFile=resolve("features.yml")) => {
    try {
        return featureFile != null
            ? parse(readFileSync(featureFile, "utf-8")).features
            : [];
    } catch(e) {
        return [];
    }
}