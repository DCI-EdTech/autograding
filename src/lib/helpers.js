const escapeRegExp = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const xmlSecure = (str) => {
  return str.replace(/[<>]/gm, '')
}

export { escapeRegExp, xmlSecure }