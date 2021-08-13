'use strict';

const Base = require('./Base');
const Message = require('./Message');

/**
 * Represents a Chat on WhatsApp
 * @extends {Base}
 */
class Chat extends Base {
  /**
   * Creates a Chat instance.
   * @param {Client} client
   * @param {object} data
   */
  constructor(client, data) {
    super(client);

    if (data) {
      this._patch(data);
    }
  }

  /**
   *
   * @param {object} data
   * @return {string}
   * @private
   */
  _patch(data) {
    /**
     * ID that represents the chat
     * @type {object}
     */
    this.id = data.id;

    /**
     * Title of the chat
     * @type {string}
     */
    this.name = data.formattedTitle;

    /**
     * Indicates if the Chat is a Group Chat
     * @type {boolean}
     */
    this.isGroup = data.isGroup;

    /**
     * Indicates if the Chat is readonly
     * @type {boolean}
     */
    this.isReadOnly = data.isReadOnly;

    /**
     * Amount of messages unread
     * @type {number}
     */
    this.unreadCount = data.unreadCount;

    /**
     * Unix timestamp for when the last activity occurred
     * @type {number}
     */
    this.timestamp = data.t;

    /**
     * Indicates if the Chat is archived
     * @type {boolean}
     */
    this.archived = data.archive;

    /**
     * Indicates if the Chat is pinned
     * @type {boolean}
     */
    this.pinned = !!data.pin;

    /**
     * Indicates if the chat is muted or not
     * @type {number}
     */
    this.isMuted = data.isMuted;

    /**
     * Unix timestamp for when the mute expires
     * @type {number}
     */
    this.muteExpiration = data.muteExpiration;

    return super._patch(data);
  }

  /**
   * Send a message to this chat
   * @param {string|MessageMedia|Location} content
   * @param {MessageSendOptions} [options]
   * @return {Promise<Message>} Message that was just sent
   */
  async sendMessage(content, options) {
    return this.client.sendMessage(this.id._serialized, content, options);
  }

  /**
   * Set the message as seen
   * @return {Promise<Boolean>} result
   */
  async sendSeen() {
    return this.client.sendSeen(this.id._serialized);
  }

  /**
   * Clears all messages from the chat
   * @return {Promise<Boolean>} result
   */
  async clearMessages() {
    return this.client.pupPage.evaluate((chatId) => {
      return window.WWebJS.sendClearChat(chatId);
    }, this.id._serialized);
  }

  /**
   * Deletes the chat
   * @return {Promise<Boolean>} result
   */
  async delete() {
    return this.client.pupPage.evaluate((chatId) => {
      return window.WWebJS.sendDeleteChat(chatId);
    }, this.id._serialized);
  }

  /**
   * Archives this chat
   */
  async archive() {
    return this.client.archiveChat(this.id._serialized);
  }

  /**
   * un-archives this chat
   */
  async unarchive() {
    return this.client.unarchiveChat(this.id._serialized);
  }

  /**
   * Pins this chat
   * @return {Promise<boolean>} New pin state. Could be false if the max number
   * of pinned chats was reached.
   */
  async pin() {
    return this.client.pinChat(this.id._serialized);
  }

  /**
   * Unpins this chat
   * @return {Promise<boolean>} New pin state
   */
  async unpin() {
    return this.client.unpinChat(this.id._serialized);
  }

  /**
   * Mutes this chat until a specified date
   * @param {Date} unmuteDate Date at which the Chat will be unmuted
   */
  async mute(unmuteDate) {
    return this.client.muteChat(this.id._serialized, unmuteDate);
  }

  /**
   * Unmutes this chat
   */
  async unmute() {
    return this.client.unmuteChat(this.id._serialized);
  }

  /**
   * Mark this chat as unread
   */
  async markUnread() {
    return this.client.markChatUnread(this.id._serialized);
  }

  /**
   * Loads chat messages, sorted from earliest to latest.
   * @param {Object} searchOptions Options for searching messages. Right now
   * only limit is supported.
   * @param {Number} [searchOptions.limit=50] The amount of messages to return.
   * Note that the actual number of returned messages may be smaller if there
   * aren't enough messages in the conversation. Set this to Infinity to load
   * all messages.
   * @return {Promise<Array<Message>>}
   */
  async fetchMessages(searchOptions) {
    if (!searchOptions) {
      searchOptions = { limit: 50 };
    }

    let messages = await this.client.pupPage.evaluate(async (chatId, limit) => {
      const msgFilter = m => !m.isNotification; // dont include notification messages

      const chat = window.Store.Chat.get(chatId);
      let msgs = chat.msgs.models.filter(msgFilter);

      while (msgs.length < limit) {
        const loadedMessages = await chat.loadEarlierMsgs();
        if (!loadedMessages) break;
        msgs = [...loadedMessages.filter(msgFilter), ...msgs];
      }

      msgs.sort((a, b) => (a.t > b.t) ? 1 : -1);
      if (msgs.length > limit) msgs = msgs.splice(msgs.length - limit);
      return msgs.map(m => window.WWebJS.getMessageModel(m));

    }, this.id._serialized, searchOptions.limit);

    return messages.map(m => new Message(this.client, m));
  }


  /**
   * Loads chat messages, sorted from earliest to latest.
   * @param {Object} searchOptions Options for searching messages.
   * @param {Message}
   * @return {Promise<Array<Message>>}
   */
  async fetchMessagesUntil(limitMsg){
    if (!limitMsg) {
      return;
    }
    let messages = await this.client.pupPage.evaluate(async (chatId, limitMsg) => {
      const msgFilter = m => !m.isNotification; // dont include notification messages
      const msgIsInArray = (array, msg)=>{
        for (let i =0; i<array.length; i++){
          if (array[i].id && array[i].id.id === msg.id.id){
            return true;
          }
        }
        return false;
      }

      const chat = window.Store.Chat.get(chatId);
      let msgs = chat.msgs.models.filter(msgFilter);
      let running = true;
      if (msgIsInArray(msgs, limitMsg)){
        running = false;
      }

      while (running) {
        const loadedMessages = await chat.loadEarlierMsgs();
        if (!loadedMessages) break;
        if(msgIsInArray(loadedMessages, limitMsg)){
          running = false;
        }
        msgs = [...loadedMessages.filter(msgFilter), ...msgs];
      }
      msgs.sort((a, b) => (a.t > b.t) ? 1 : -1);
      return msgs.map(m => window.WWebJS.getMessageModel(m));

    }, this.id._serialized, limitMsg);

    return messages.map(m => new Message(this.client, m));
  }

//3EB09D2D899AF85E4AF2
  /**
   * Loads a message by id, this is needed if you want to response to an old
   * message.
   * @param {Message} message
   */
  async loadMessage(message) {
    await this.client.pupPage.evaluate(async (messageId, chatId) => {
      const chat = window.Store.Chat.get(chatId);
      while (!window.Store.Msg.get(messageId)) {
        const messages = await chat.loadEarlierMsgs();
        if (!messages) {
          break;
        }
      }
    }, message.id._serialized, this.id._serialized);
  }

  /**
   * Simulate typing in chat. This will last for 25 seconds.
   */
  async sendStateTyping() {
    return this.client.pupPage.evaluate((chatId) => {
      window.WWebJS.sendChatstate('typing', chatId);
      return true;
    }, this.id._serialized);
  }

  /**
   * Simulate recording audio in chat. This will last for 25 seconds.
   */
  async sendStateRecording() {
    return this.client.pupPage.evaluate((chatId) => {
      window.WWebJS.sendChatstate('recording', chatId);
      return true;
    }, this.id._serialized);
  }

  /**
   * Stops typing or recording in chat immediately.
   */
  async clearState() {
    return this.client.pupPage.evaluate((chatId) => {
      window.WWebJS.sendChatstate('stop', chatId);
      return true;
    }, this.id._serialized);
  }

  /**
   * Returns the Contact that corresponds to this Chat.
   * @return {Promise<Contact>}
   */
  async getContact() {
    return await this.client.getContactById(this.id._serialized);
  }

  /**
   * Returns array of all Labels assigned to this Chat
   * @return {Promise<Array<Label>>}
   */
  async getLabels() {
    return this.client.getChatLabels(this.id._serialized);
  }
}

module.exports = Chat;
