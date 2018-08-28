const fetch = require('node-fetch')

/**
 * @param {string} url
 * @param {object} [options] as accepted by `fetch`
 * @returns {Promise<object>} promise resolving into JSON object
 */
const fetchJSON = (url, options = {}) =>
  fetch(url, options).then(res => res.text())

/**
 * @param {Context} context
 * @return {string} owner name
 *
 */
const getOwner = context => context.payload.repository.owner.login

/**
 * @param {Context} context
 * @return {string} repo name
 *
 */
const getRepo = context => context.payload.repository.name

/**
 * @param {Context} context
 * @param {string} message
 * @return {object} isssue comment body
 *
 */
const getComment = (context, message) => context.issue({ body: message })

/**
 * @param {string} templateField
 * @param {object} issueBody
 * @return {boolean} whether issue body contains the given templateField
 *
 */
const isFollowingTemplate = (templateField, bodyText) => {
  if (bodyText.includes(templateField)) {
    return true
  }
  // Handles radio button markdown
  return (templateField.includes('* [ ]')
  ? [templateField, templateField.replace('* [ ]', '* [x]')].some(l => bodyText.includes(l))
  : bodyText.includes(templateField)) ||
  (templateField.includes('- [ ]')
  ? [templateField, templateField.replace('- [ ]', '- [x]')].some(l => bodyText.includes(l))
  : bodyText.includes(templateField))
}

/**
 * @param {object} templateBytes
 * @return {Array} string array of template fields
 *
 */
const getTemplateFields = templateBytes => templateBytes.toString().split('\n')

/**
 * @param {Context} context
 * @param {boolean} isFollowingTemplate
 * @param {object} commentOnSuccess
 * @param {object} commentOnFailure
 * @return {object} final comment to be displayed eventually
 *
 */
const getFinalComment = (context, isFollowingTemplate, commentOnSuccess, commentOnFailure) => isFollowingTemplate
    ? context.github.issues.createComment(commentOnSuccess)
    : context.github.issues.createComment(commentOnFailure)

exports.getTemplateFields = getTemplateFields
exports.getFinalComment = getFinalComment
exports.isFollowingTemplate = isFollowingTemplate
exports.getComment = getComment
exports.fetchJSON = fetchJSON
exports.getOwner = getOwner
exports.getRepo = getRepo
