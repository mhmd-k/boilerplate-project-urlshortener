function validateURL(url) {
  const urlPattern = /^(http:\/\/www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;

  return urlPattern.test(url);
}

module.exports = { validateURL };
