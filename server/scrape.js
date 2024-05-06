const puppeteer = require("puppeteer");

const Musix = async () => {
  const artistArray = [];
  const spanishArray = [];
  const englishArray = [];
  const browser = await puppeteer.launch({
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.musixmatch.com/lyrics/Calibre-50/Y-Yo-Sin-Ti/translation/english"
  );

  //Title
  const titleContainer = await page.$('h1[dir="auto"]');
  const titleText = await page.evaluate(
    (el) => el.textContent.trim(),
    titleContainer
  );

  //Artists
  const artistsContainer = await page.$$(
    '.css-1rynq56.r-fdjqy7.r-a023e6.r-1kfrs79.r-1cwl3u0.r-lrvibr[dir="auto"]'
  );

  if (artistsContainer.length > 1) {
    var count = 0;
    var len = artistsContainer.length;
    for (const artist of artistsContainer) {
      count++;
      if (count >= 3 && count < len - 2) {
        const art = await page.evaluate((el) => el.textContent, artist);
        artistArray.push(art.trim());
      }
    }
  }

  //Original Lyrics
  const lyricsContainers = await page.$$(
    ".css-1rynq56.r-1grxjyw.r-adyw6z.r-11rrj2j.r-13awgt0.r-ueyrd6.r-fdjqy7"
  );

  for (const line of lyricsContainers) {
    const lines = await page.evaluate((el) => el.textContent, line);
    spanishArray.push(lines.trim());
  }

  //Enlgish Lyrics
  const englishLyrics = await page.$$(
    ".css-1rynq56.r-13awgt0.r-adyw6z.r-ueyrd6.r-1ozrv0l.r-fdjqy7"
  );
  for (const lines of englishLyrics) {
    const line = await page.evaluate((el) => el.textContent, lines);
    englishArray.push(line.trim());
  }

  await browser.close();

  if (artistArray.length === 0) {
    artistArray.push("Unknown Artist");
  }

  return [artistArray, titleText, spanishArray, englishArray];
};

const Translate = async (lyricsArray) => {
  const translatedLyrics = [];
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://translate.google.com/?sl=es&tl=en&op=translate");

  for (const lyric of lyricsArray) {
    // Type each line of lyric into the input box
    var inputBox = await page.$('[aria-label="Source text"]');
    await inputBox.type(lyric);

    // Wait for the translation to appear
    await page.waitForSelector('span[jsname="W297wb"]');

    // Get the translated text
    const outputBox = await page.$('span[jsname="W297wb"]');
    const translatedText = await page.evaluate(
      (span) => span.textContent,
      outputBox
    );
    translatedLyrics.push(translatedText);

    // Clear the input box for the next iteration
    await page.$eval(
      '[aria-label="Source text"]',
      (input) => (input.value = "")
    );
  }
  console.log(translatedLyrics);

  await browser.close();
};

const Test = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.musixmatch.com/search");

  await page.type('input[type="text"]', searchQuery);
  //var firstResultLink = await page.$('[role="link"]');

  const firstResultHref = await page.evaluate(() => {
    const firstResultLink = await page.$('[role="link"]');
    return firstResultLink ? firstResultLink.getAttribute('href') : null;
  });

  console.log(firstResultHref)

  //await firstResultLink.evaluate( firstResultLink => firstResultLink.click() );

  // Get the current URL after clicking the first result
  const currentUrl = page.url();
  console.log("Current URL:", currentUrl);

  await browser.close();
};

Test("La people");

module.exports = Musix;
