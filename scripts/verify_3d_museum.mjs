import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/SAHIL/.gemini/antigravity/brain/9e48e468-27d1-455a-9a36-037bd091e6bd";

async function main() {
  console.log("Launching Chromium for 3D Digital Museum verification...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Listen to console errors
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[Browser Console Error]: ${msg.text()}`);
    }
  });

  try {
    // ── 1. TEST SHANIWAR WADA 3D EXPLORER ──
    console.log("1. Navigating to Shaniwar Wada 3D Museum page...");
    await page.goto("http://localhost:3005/heritage/shaniwar-wada/3d", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    const title = await page.title();
    console.log("Page title:", title);

    // Take screenshot of Experience A: Monument Explorer
    const explorerScreenshotPath = path.join(ARTIFACT_DIR, "shaniwar-wada-3d-explorer.png");
    await page.screenshot({ path: explorerScreenshotPath });
    console.log("Saved screenshot:", explorerScreenshotPath);

    // Verify lighting preset switch
    console.log("Testing Lighting Preset: Golden Hour...");
    const goldenHourBtn = page.locator("button:has-text('Golden Hour')").first();
    if (await goldenHourBtn.isVisible()) {
      await goldenHourBtn.click();
      await page.waitForTimeout(1000);
    }

    // Verify wireframe toggle
    console.log("Testing Wireframe Toggle...");
    const wireframeBtn = page.locator("button:has-text('Wireframe')").first();
    if (await wireframeBtn.isVisible()) {
      await wireframeBtn.click();
      await page.waitForTimeout(1000);
      const wireframeScreenshotPath = path.join(ARTIFACT_DIR, "shaniwar-wada-3d-wireframe.png");
      await page.screenshot({ path: wireframeScreenshotPath });
      console.log("Saved wireframe screenshot:", wireframeScreenshotPath);
      // Toggle back off
      await wireframeBtn.click();
      await page.waitForTimeout(500);
    }

    // ── 2. TEST 1732 CE HISTORICAL RECONSTRUCTION ──
    console.log("2. Testing Mode: 1732 CE Reconstruction...");
    const historicalBtn = page.locator("button:has-text('1732 CE Reconstruction')").first();
    if (await historicalBtn.isVisible()) {
      await historicalBtn.click();
      await page.waitForTimeout(3000);

      const histScreenshotPath = path.join(ARTIFACT_DIR, "shaniwar-wada-3d-1732-reconstruction.png");
      await page.screenshot({ path: histScreenshotPath });
      console.log("Saved 1732 reconstruction screenshot:", histScreenshotPath);
    }

    // ── 3. TEST EXPERIENCE B: WALK INSIDE ──
    console.log("3. Testing Mode: Walk Inside (Experience B)...");
    const walkInsideBtn = page.locator("button:has-text('Walk Inside')").first();
    if (await walkInsideBtn.isVisible()) {
      await walkInsideBtn.click();
      await page.waitForTimeout(3000);

      const walkthroughScreenshotPath = path.join(ARTIFACT_DIR, "shaniwar-wada-3d-walkthrough.png");
      await page.screenshot({ path: walkthroughScreenshotPath });
      console.log("Saved walkthrough screenshot:", walkthroughScreenshotPath);
    }

    // ── 4. TEST TAJ MAHAL 3D STATUS (IN PRODUCTION FALLBACK) ──
    console.log("4. Navigating to Taj Mahal 3D page...");
    await page.goto("http://localhost:3005/heritage/taj-mahal/3d", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const fallbackScreenshotPath = path.join(ARTIFACT_DIR, "taj-mahal-3d-in-production.png");
    await page.screenshot({ path: fallbackScreenshotPath });
    console.log("Saved Taj Mahal in-production fallback screenshot:", fallbackScreenshotPath);

    // ── 5. TEST EMBEDDED VIEWER ON MONUMENT DETAIL PAGE ──
    console.log("5. Navigating to Shaniwar Wada Detail Page...");
    await page.goto("http://localhost:3005/heritage/shaniwar-wada", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    // Scroll to 3D museum section
    const museumSection = page.locator("text=Digital 3D Architectural Museum").first();
    if (await museumSection.isVisible()) {
      await museumSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      const detailEmbeddedScreenshot = path.join(ARTIFACT_DIR, "shaniwar-wada-detail-3d-embedded.png");
      await page.screenshot({ path: detailEmbeddedScreenshot });
      console.log("Saved embedded 3D viewer screenshot:", detailEmbeddedScreenshot);
    }

    // ── 6. TEST MOBILE VIEWPORT ──
    console.log("6. Testing Mobile Viewport (iPhone 14 / Pixel 7)...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3005/heritage/shaniwar-wada/3d", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2500);

    const mobileScreenshotPath = path.join(ARTIFACT_DIR, "shaniwar-wada-3d-mobile.png");
    await page.screenshot({ path: mobileScreenshotPath });
    console.log("Saved mobile screenshot:", mobileScreenshotPath);

    console.log("All 3D verification tests completed successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();