'use strict';

/**
 * Represents a WhatsApp data structure
 */
class Base {
  /**
   * Constructor of the basic WhatsApp data structure.
   * @param {Client} client
   */
  constructor(client) {
    /**
     * The client that instantiated this
     * @readonly
     */
    Object.defineProperty(this, 'client', {value: client});
  }

  /**
   * Clones object.
   * @return {Base}
   * @private
   */
  _clone() {
    return Object.assign(Object.create(this), this);
  }

  /**
   * Applies patches to object.
   * @param {object} data
   * @return {object}
   * @private
   */
  _patch(data) {
    return data;
  }
}

module.exports = Base;
/*
{
  id: {
    fromMe: true,
    remote: '972507336650-1590907536@g.us',
    id: '3EB0E42EA7A24761B1D7',
    _serialized: 'true_972507336650-1590907536@g.us_3EB0E42EA7A24761B1D7'
  },
  body: 'שאלה',
  type: 'chat',
  t: 1627134991,
  from: '972557252724@c.us',
  to: '972507336650-1590907536@g.us',
  self: 'out',
  ack: 3,
  isNewMsg: true,
  star: false,
  caption: 'שאלה',
  isFromTemplate: false,
  title: 'סקר!',
  mentionedJidList: [],
  footer: 'הסבר',
  isVcardOverMmsDocument: false,
  isForwarded: false,
  ephemeralStartTimestamp: 1627134992,
  productHeaderImageRejected: false,
  isDynamicReplyButtonsMsg: true,
  dynamicReplyButtons: [
    { buttonId: '4LdMSH', buttonText: [Object], type: 1 },
    { buttonId: 'FcNrFy', buttonText: [Object], type: 1 },
    { buttonId: 'JzG437', buttonText: [Object], type: 1 }
  ],
  replyButtons: [
    { buttonId: '4LdMSH', buttonText: [Object], type: 1 },
    { buttonId: 'FcNrFy', buttonText: [Object], type: 1 },
    { buttonId: 'JzG437', buttonText: [Object], type: 1 }
  ],
  isMdHistoryMsg: false,
  isStatusV3: false,
  links: []
}

 */
