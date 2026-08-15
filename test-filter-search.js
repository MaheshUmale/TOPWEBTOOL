const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[ERROR]', msg.text());
  });

  // Helper to wait for twt-shell to load
  const waitForShell = async () => {
    await page.waitForSelector('.twt-shell__frame', { timeout: 5000 });
    await page.waitForTimeout(500);
  };

  console.log('=== HOMEPAGE TESTS ===');
  await page.goto('http://localhost:8081/', { waitUntil: 'networkidle' });
  await waitForShell();

  // Check twt-shell search input (the actual visible one)
  const navFilter = await page.locator('#twt-sidebar-filter').count();
  console.log('twt-sidebar-filter (visible search):', navFilter);

  // Check category groups (the actual filter chips/titles)
  const navGroups = await page.locator('.twt-nav__group').count();
  console.log('twt-nav groups (categories):', navGroups);

  // Check nav links count
  const navLinks = await page.locator('.twt-nav__link').count();
  console.log('twt-nav links (tools):', navLinks);

  // Test search functionality
  if (navFilter > 0) {
    await page.fill('#twt-sidebar-filter', 'piano');
    await page.waitForTimeout(500);
    
    const visibleLinks = await page.locator('.twt-nav__link:not(.twt-hidden)').count();
    const hiddenLinks = await page.locator('.twt-nav__link.tw-hidden').count();
    console.log('Search "piano" visible links:', visibleLinks);
    console.log('Search "piano" hidden links:', hiddenLinks);

    // Check if any groups are empty but still visible
    const emptyVisibleGroups = await page.locator('.twt-nav__group:not(.tw-hidden) .tw-hidden').count();
    console.log('Hidden items in visible groups:', emptyVisibleGroups);
  }

  // Test category toggle
  const firstTitle = await page.locator('.twt-nav__title').first();
  if (await firstTitle.count() > 0) {
    const groupBefore = await page.locator('.twt-nav__group.is-open').count();
    await firstTitle.click();
    await page.waitForTimeout(300);
    const groupAfter = await page.locator('.twt-nav__group.is-open').count();
    console.log('Open groups before click:', groupBefore, 'after:', groupAfter);
  }

  // Clear search
  await page.fill('#twt-sidebar-filter', '');
  await page.waitForTimeout(300);

  console.log('\n=== GAMES-AND-PLAY TESTS ===');
  await page.goto('http://localhost:8081/games-and-play/', { waitUntil: 'networkidle' });
  await waitForShell();

  const gameNavFilter = await page.locator('#twt-sidebar-filter').count();
  console.log('Games page twt-sidebar-filter:', gameNavFilter);

  const gameNavGroups = await page.locator('.twt-nav__group').count();
  console.log('Games page twt-nav groups:', gameNavGroups);

  const gameNavLinks = await page.locator('.twt-nav__link').count();
  console.log('Games page twt-nav links:', gameNavLinks);

  // Test search on games page
  if (gameNavFilter > 0) {
    await page.fill('#twt-sidebar-filter', 'piano');
    await page.waitForTimeout(500);
    
    const gameVisibleLinks = await page.locator('.twt-nav__link:not(.twt-hidden)').count();
    const gameHiddenLinks = await page.locator('.twt-nav__link.tw-hidden').count();
    console.log('Games search "piano" visible links:', gameVisibleLinks);
    console.log('Games search "piano" hidden links:', gameHiddenLinks);

    // Check for empty groups
    const gameEmptyGroups = await page.locator('.twt-nav__group:not(.tw-hidden)').all();
    for (const group of gameEmptyGroups) {
      const groupName = await group.locator('.twt-nav__title').textContent();
      const visibleInGroup = await group.locator('.twt-nav__link:not(.tw-hidden)').count();
      const totalInGroup = await group.locator('.twt-nav__link').count();
      if (visibleInGroup === 0 && totalInGroup > 0) {
        console.log(`ISSUE: Group "${groupName}" has ${totalInGroup} tools but 0 visible after search`);
      }
    }
  }

  await browser.close();
  console.log('\n=== TEST COMPLETE ===');
})();
