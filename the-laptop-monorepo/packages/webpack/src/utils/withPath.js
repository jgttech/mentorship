const { error } = console;
const { resolve, join } = require("path");

exports.withPath = (basePath=resolve()) => ([ relativePath ], ...vars) => {
    let resultPath = basePath;

    try {
        if (relativePath.indexOf("\n") !== -1) return "";
        else {
            // Normalize into an array and join using "path" to make the path OS complient.
            const sections = relativePath.split("/").map(p => p.trim());

            for (const section of sections)
                resultPath = join(resultPath, section);

            return resultPath;
        }
    } catch(e) {
        error(e);
        return "";
    }
}