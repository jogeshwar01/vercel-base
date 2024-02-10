import { REDIS_FILES_QUEUE } from "./config";
import { downloadS3Folder } from "./aws";
import { commandOptions, createClient } from "redis";
const subscriber = createClient();
subscriber.connect();

async function main() {
    while (1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            REDIS_FILES_QUEUE ?? "build-queue",
            0
        );

        const id = res?.element;
        await downloadS3Folder(`output/${id}`);
    }
}

main();
