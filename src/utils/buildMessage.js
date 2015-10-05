/**
 * Get object with params as properties.
 *
 * @param {String} type - actionType
 * @param {Object} payload
 * @returns {Object}
 */
export default (type, payload) => {
  return { type, payload};
};
