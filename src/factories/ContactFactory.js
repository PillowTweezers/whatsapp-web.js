'use strict';

const PrivateContact = require('../structures/PrivateContact');
const BusinessContact = require('../structures/BusinessContact');

/**
 * ContactFactory class.
 */
class ContactFactory {
  /**
   *
   * @param {Client} client
   * @param {object} data
   * @return {PrivateContact|BusinessContact}
   */
  static create(client, data) {
    if (data.isBusiness) {
      return new BusinessContact(client, data);
    }

    return new PrivateContact(client, data);
  }
}

module.exports = ContactFactory;
