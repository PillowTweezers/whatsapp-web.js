'use strict';

const PrivateChat = require('../structures/PrivateChat');
const GroupChat = require('../structures/GroupChat');

/**
 * ChatFactory class.
 */
class ChatFactory {
  /**
   * Creates a Chat instance.
   * @param {Client} client
   * @param {object} data
   * @return {GroupChat|PrivateChat}
   */
  static create(client, data) {
    if (data.isGroup) {
      return new GroupChat(client, data);
    }

    return new PrivateChat(client, data);
  }
}

module.exports = ChatFactory;
