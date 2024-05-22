import { FullConfig } from '@playwright/test';
import { BatchClose } from '@applitools/eyes-playwright';

async function globalTeardown(config: FullConfig) {
    // Close batch if APPLITOOLS_BATCH_ID is set
    if(process.env.APPLITOOLS_BATCH_ID){
        let batchClose = new BatchClose();
        await batchClose.setBatchIds([process.env.APPLITOOLS_BATCH_ID]).close();
    }
}

export default globalTeardown;