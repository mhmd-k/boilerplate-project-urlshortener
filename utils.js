function validateURL(url) {
  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s]*)?$/;

  return urlPattern.test(url);
}

module.exports = { validateURL };
