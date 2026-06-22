import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # Navigate to the app
        await page.goto('http://localhost:8080')
        await asyncio.sleep(2)  # Wait for rendering

        # Take a screenshot of the dark mode (default)
        await page.screenshot(path='dark_mode.png')
        print("Captured dark_mode.png")

        # Toggle to light mode
        toggle_button = await page.query_selector('button[aria-label="Toggle theme"]')
        if toggle_button:
            await toggle_button.click()
            await asyncio.sleep(1)
            await page.screenshot(path='light_mode.png')
            print("Captured light_mode.png")
        else:
            print("Theme toggle button not found")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
