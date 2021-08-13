'use strict';

const Contact = require('./Contact');

/**
 * Represents a Business Contact on WhatsApp
 * @extends {Contact}
 */
class BusinessContact extends Contact {
  /**
   * @param {object} data
   * @return {object}
   * @private
   */
  _patch(data) {
    /**
     * The contact's business profile
     */
    this.businessProfile = data.businessProfile;

    return super._patch(data);
  }
}

module.exports = BusinessContact;