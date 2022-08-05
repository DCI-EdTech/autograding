const escapeRegExp = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\/^$|]/g, '\\$&');
}

const xmlSecure = (str) => {
  return str.replace(/[<>]/gm, '')
}

const removeTerminalColoring = (message) => {
  if(!message) return message
  return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

const repoNameFromUrl = (url) => {
  return url.match(/([^\/]+$)/)[0]
}

export { escapeRegExp, xmlSecure, removeTerminalColoring, repoNameFromUrl }