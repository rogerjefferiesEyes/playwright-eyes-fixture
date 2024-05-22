import { test as base, type Page } from '@playwright/test';
import { Eyes, ClassicRunner, VisualGridRunner, Configuration, BatchInfo, BatchClose, StitchMode, BrowserType, DeviceName } from '@applitools/eyes-playwright'


// Applitools objects to share for all tests as worker-scoped fixtures
type EyesContext = {
    runner: VisualGridRunner;
    batch: BatchInfo;
}

// Playwright will instantiate a new Applitools Eyes object fixture for each
// test that needs one as a test-scoped fixture.
type EyesTest = {
    eyes: Eyes;
};

export const test = base.extend<EyesTest, EyesContext>({
    eyes: async ({ page, runner, batch }, use, testInfo) => {
        // Instantiate Eyes
        let eyes = new Eyes(runner);

        // Enable Batch Notifications (Email, Slack, etc.)
        batch.notifyOnCompletion = true
        console.log("Batch ID: " + batch.getId());

        eyes.setBatch(batch);

        // Set the Stitch Mode, for full screen/page captures (https://help.applitools.com/hc/en-us/articles/360007188071-Using-CSS-transition-with-Applitools-as-an-alternative-to-standard-scrolling)
        eyes.setStitchMode(StitchMode.CSS);

        // Get the existing Eyes configuration, so we don't overwrite previous settings!
        const configuration: Configuration = eyes.getConfiguration()

        // Configure the desired target browsers and viewport sizes
        configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.CHROME })
        configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.FIREFOX })
        configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.SAFARI })
        configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.EDGE_LEGACY })
        configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.IE_11 })
        configuration.addBrowser({ deviceName: DeviceName.Galaxy_S9_Plus })

        eyes.setConfiguration(configuration)

        // autoTestFixture setup...
        var eyesPage = await eyes.open(page, "Demo App", testInfo.title);

        await use(eyes);

        // autoTestFixture teardown...
        if (await eyes.isOpen) {
            if (await testInfo.status == 'passed') {
                await eyes.closeAsync();
            } else {
                await eyes.abortAsync();
            }
        }

        // Wait until all test executions have completed "asynchronously" in the Applitools Visual Grid
        const results = await runner.getAllTestResults(false);
        console.log('Results', results);
    },
    runner: [async ({ }, use) => {
        const runner = new VisualGridRunner({ testConcurrency: 5 });
        await use(runner);
    }, { scope: 'worker', auto: true  }],
    batch: [async ({ }, use) => {
        const batch = new BatchInfo();
        await use(batch);
    }, { scope: 'worker', auto: true  }]
})

export { expect } from '@playwright/test';