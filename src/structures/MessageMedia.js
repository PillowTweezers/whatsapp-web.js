'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime');

/**
 * Media attached to a message
 * @param {string} mimetype MIME type of the attachment
 * @param {string} data Base64-encoded data of the file
 * @param {?string} filename Document file name
 */
class MessageMedia {
  /**
   * Creates a MessageMedia instance.
   * @param {string} mimetype
   * @param {string} data
   * @param {?string} filename
   */
  constructor(mimetype, data, filename) {
    /**
     * MIME type of the attachment
     * @type {string}
     */
    this.mimetype = mimetype;

    /**
     * Base64 encoded data that represents the file
     * @type {string}
     */
    this.data = data;

    /**
     * Name of the file (for documents)
     * @type {?string}
     */
    this.filename = filename;
  }

  /**
   * Gets a dataUri representation of media.
   * @return {string}
   */
  getDataUri() {
    return 'data:' + this.mimetype + ';base64,' + this.data;
  }

  /**
   * Creates a MessageMedia instance from a local file path
   * @param {string} filePath
   * @return {MessageMedia}
   */
  static fromFilePath(filePath) {
    const b64data = fs.readFileSync(filePath, {encoding: 'base64'});
    const mimetype = mime.getType(filePath);
    const filename = path.basename(filePath);

    return new MessageMedia(mimetype, b64data, filename);
  }

  /**
   * Creates a MessageMedia instance from a dataUri string
   * @param {string} dataUri
   * @param {string} fileName
   * @return {MessageMedia}
   */
  static fromDataUri(dataUri, fileName) {
    // base64 encoded data doesn't contain commas
    const base64ContentArray = dataUri.split(',');
    // base64 content cannot contain whitespaces but nevertheless skip if there
    // are!
    const mimeType = base64ContentArray[0].match(
      /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
    // base64 encoded data - pure
    let base64Data = base64ContentArray[1];
    return new MessageMedia(mimeType, base64Data, fileName);
  }
}

module.exports = MessageMedia;
