function validateURL(url) {
  const urlPattern =
    /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/;

  return urlPattern.test(url);
}

module.exports = { validateURL };
