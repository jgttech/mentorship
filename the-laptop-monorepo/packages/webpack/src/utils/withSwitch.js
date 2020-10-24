const { pipe, type } = require("ramda");

exports.withSwitch = (target, switchOps) => pipe(obj => {
    let results = null;

    // Get default data.
    if (obj.hasOwnProperty("default"))
        results = type(obj.default) === "Function"
            ? obj.default()
            : obj.default;

    // Get conditional results.
    if (obj.hasOwnProperty(target)) {
        const data = obj[target];

        results = type(data) === "Function"
            ? data()
            : type(data) === "Object"
                ? {...results, ...data }
                : data;
    }

    return results;
})(switchOps)