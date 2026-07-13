from playwright.sync_api import sync_playwright, expect
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/")

    # Fill only spotify url, leave youtube blank
    page.get_by_label("Spotify Playlist URL").fill("https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M")

    # Try clicking the sync button, it should not be disabled as one field is filled
    sync_btn = page.locator("button:has-text('Execute Sync Protocol')")
    expect(sync_btn).to_be_enabled()

    # Click should trigger syncing
    sync_btn.click()
    page.wait_for_timeout(2000)

    # Verify the tooltip triggers and takes screenshot
    page.screenshot(path="verification1.png")

    # Now clear both
    page.get_by_label("Clear Spotify Playlist URL").click()

    # Tooltip should show, button disabled
    expect(sync_btn).to_be_disabled()

    sync_btn.hover(force=True)
    page.wait_for_timeout(1000)
    page.screenshot(path="verification2.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
