const puppeteer = require("puppeteer");

/**
 * Main function that does new song related functions. Grabs the artist, lyrics, translation,
 * and title
 *
 * @param {string} url URL song can be found at
 * @returns
 */
const Musix = async (url) => {
  const artistArray = [];
  const spanishArray = [];
  const englishArray = [];
  const browser = await puppeteer.launch({
    defaultViewport: false,
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  //Title
  const titleContainer = await page.$('h1[dir="auto"]');
  const titleText = await page.evaluate(
    (el) => el.textContent.trim(),
    titleContainer
  );

  ///Album Title
  const albumTitleContainer = await page.$('h2[data-testid="lyrics-track-description"]');
  const albumNameText = await page.evaluate(
    (el) => el.textContent.split("•"),
    albumTitleContainer
  );


  ///Album Cover Image Link
  const albumCoverContainer = await page.$$(".css-9pa8cd");
  const imageLink = await page.evaluate((el) => el.src, albumCoverContainer[1])

  //Artists
  const artistsContainer = await page.$$(
    ".css-146c3p1.r-fdjqy7.r-a023e6.r-1kfrs79.r-1cwl3u0.r-lrvibr"
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
    ".css-146c3p1.r-1inkyih.r-11rrj2j.r-13awgt0.r-fdjqy7.r-1dxmaum.r-1it3c9n.r-135wba7"
  );

  for (const line of lyricsContainers) {
    const lines = await page.evaluate((el) => el.textContent, line);
    spanishArray.push(lines.trim());
  }

  /*
  const englishLyrics = await page.$$(
    //".css-146c3p1.r-1inkyih.r-13awgt0.r-1ifxtd0.r-11wrixw.r-fdjqy7.r-1dxmaum.r-1it3c9n.r-135wba7"
    //.css-175oi2r.r-eqz5dr.r-1w6e6rj
    ".css-175oi2r.r-eqz5dr.r-1w6e6rj"
  );

  for (const container of englishLyrics) {
    const text = await page.evaluate((el) => el.innerText, container);
    // Split by newline and take the second part (English)
    const parts = text.split("\n");

    if (parts.length > 1) {
      englishArray.push(parts[1].trim()); // English is after Spanish
    }
  }
*/

  // Keeps script running forever
  //await new Promise(() => {});

  await browser.close();

  artistArray.pop();
  if (artistArray.length === 0) {
    artistArray.push("Unknown Artist");
  }

  englishTranslations = await Translate(spanishArray);

  for (const line of englishTranslations) {
    englishArray.push(line.trim());
  }

  return [artistArray, titleText, spanishArray, englishArray, albumNameText[0], imageLink];
};

/**
 * Takes an array in spanish and translates each line into english
 *
 * @param {array} lyricsArray Array of lyrics in spanish that will be translated to english
 * @returns
 */
const Translate = async (lyricsArray) => {
  let translatedLyrics = [];
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

    // Wait for the translation to update
    await page.waitForFunction(
      (prevTranslation) => {
        const outputElement = document.querySelector('span[jsname="W297wb"]');
        return outputElement && outputElement.textContent !== prevTranslation;
      },
      {}, // Options
      translatedLyrics.length > 0
        ? translatedLyrics[translatedLyrics.length - 1]
        : "" // Previous translation
    );

    // Get the translated text
    const outputBox = await page.$('span[jsname="W297wb"]');
    const translatedText = await page.evaluate(
      (span) => span.textContent,
      outputBox
    );
    translatedLyrics.push(translatedText);

    // Clear the input box for the next iteration
    await inputBox.click({ clickCount: 3 }); // Select all text
    await page.keyboard.press("Backspace"); // Delete text
  }

  await browser.close();

  return translatedLyrics;
};

/**
 * Takes a string that user inputs and finds that song on MusixMatch to prepare for scraping
 *
 * @param {string} searchQuery User input search query
 */
const SearchMusix = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.musixmatch.com/search");

  await page.type('input[type="text"]', searchQuery);

  await page.waitForSelector(".css-175oi2r.r-11c0sde.r-1r5su4o");
  const firstResultHref = await page.$eval(
    ".css-175oi2r.r-11c0sde.r-1r5su4o",
    (parent) => {
      const firstResultLink = parent.querySelector(".css-175oi2r.r-1otgn73");
      return firstResultLink ? firstResultLink.getAttribute("href") : null;
    }
  );

  // Get the current URL after clicking the first result
  const newUrl =
    "https://www.musixmatch.com" + firstResultHref + "/translation/english";

  await Musix(newUrl);

  await browser.close();
};

//SearchMusix("nueva vida");

module.exports = Musix;
