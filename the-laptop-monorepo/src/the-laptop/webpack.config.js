const { error } = console;

try {
    module.exports = require("@the-laptop/webpack").web();
} catch(e) {
    error(e);
}