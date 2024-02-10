import { REDIS_FILES_QUEUE } from "./config";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { commandOptions, createClient } from "redis";
import { buildProject } from "./utils";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while (1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            REDIS_FILES_QUEUE ?? "build-queue",
            0
        );

        const id = res?.element;

        if (id) {
            await downloadS3Folder(`output/${id}`);
            await buildProject(id);
            copyFinalDist(id);
            publisher.hSet("status", id, "deployed");
        }
    }
}

main();
