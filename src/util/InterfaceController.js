'use strict';

/**
 * Interface Controller
 */
class InterfaceController {
  /**
   * Creates an instance of an Interface Controller.
   * @param {Client} props
   */
  constructor(props) {
    this.pupPage = props.pupPage;
  }

  /**
   * Opens the Chat Window
   * @param {string} chatId ID of the chat window that will be opened
   */
  async openChatWindow(chatId) {
    await this.pupPage.evaluate(async (chatId) => {
      const chat = await window.Store.Chat.get(chatId);
      await window.Store.Cmd.openChatAt(chat);
    }, chatId);
  }

  /**
   * Opens the Chat Drawer
   * @param {string} chatId ID of the chat drawer that will be opened
   */
  async openChatDrawer(chatId) {
    await this.pupPage.evaluate(async (chatId) => {
      const chat = await window.Store.Chat.get(chatId);
      await window.Store.Cmd.chatInfoDrawer(chat);
    }, chatId);
  }

  /**
   * Opens the Chat Search
   * @param {string} chatId ID of the chat search that will be opened
   */
  async openChatSearch(chatId) {
    await this.pupPage.evaluate(async (chatId) => {
      const chat = await window.Store.Chat.get(chatId);
      await window.Store.Cmd.chatSearch(chat);
    }, chatId);
  }

  /**
   * Opens or Scrolls the Chat Window to the position of the message
   * @param {string} msgId ID of the message that will be scrolled to
   */
  async openChatWindowAt(msgId) {
    await this.pupPage.evaluate(async (msgId) => {
      const msg = await window.Store.Msg.get(msgId);
      await window.Store.Cmd.openChatAt(msg.chat,
          msg.chat.getSearchContext(msg));
    }, msgId);
  }

  /**
   * Opens the Message Drawer
   * @param {string} msgId ID of the message drawer that will be opened
   */
  async openMessageDrawer(msgId) {
    await this.pupPage.evaluate(async (msgId) => {
      const msg = await window.Store.Msg.get(msgId);
      await window.Store.Cmd.msgInfoDrawer(msg);
    }, msgId);
  }

  /**
   * Closes the Right Drawer
   */
  async closeRightDrawer() {
    await this.pupPage.evaluate(async () => {
      await window.Store.Cmd.closeDrawerRight();
    });
  }
}

module.exports = InterfaceController;
