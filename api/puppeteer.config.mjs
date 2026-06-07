/** @type {import("puppeteer").Configuration} */
const config = {
  // Download Chrome (default `skipDownload: false`).
  chrome: { skipDownload: false },
  // Download Firefox (default `skipDownload: true`).
  firefox: { skipDownload: false },
};

export default config;
