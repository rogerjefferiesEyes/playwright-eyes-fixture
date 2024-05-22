import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    process.env.APPLITOOLS_BATCH_NAME = "Playwright Tests";

    // Sets APPLITOOLS_BATCH_ID if not already set at time of execution
    if(!process.env.APPLITOOLS_BATCH_ID){
        process.env.APPLITOOLS_BATCH_ID = Date.now().toString()
    }

    // Don't close Applitools batches implicitly
    process.env.APPLITOOLS_DONT_CLOSE_BATCHES = "true";
}

export default globalSetup;