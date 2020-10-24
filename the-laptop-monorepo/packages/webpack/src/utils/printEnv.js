require("colors");
const { log } = console;

exports.printEnv = ([ envs ]) => {
    envs = envs.split("\n").map(s => s.trim()).filter(s => s.length > 0);

    let length = 0;
    const seperator = () => "\n" + "-".repeat(50) + "\n";
    const print = (k, v) => {
        let val = process.env[v];

        if (val == null)
            val = "none";

        if (k != null && v != null)
            log(`${k}.: `.green.bold + process.env[v]);
    }

    for (const env of envs)
        if (env.length > length)
            length = env.length;

    log("\nEnvironment".yellow);

    let cnt = 1;
    for (const env of envs) {
        let key = null;

        if (env.length === length)
            key = `${cnt}. ${env}`;
        else if (env.length < length) {
            let k = env;

            for (let i=0; i<(length - env.length); i++)
                k += ".";

            key = `${cnt}. ${k}`;
        }

        print(key, env);
        cnt++;
    }
}