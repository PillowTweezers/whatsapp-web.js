import { EventEmitter } from 'events'
import puppeteer = require('puppeteer')

declare namespace WAWebJS {

  export class Client extends EventEmitter {
    constructor(options: ClientOptions)

    /** Current connection information */
    public info: ClientInfo

    /** Puppeteer page running WhatsApp Web */
    pupPage?: puppeteer.Page

    /** Puppeteer browser running WhatsApp Web */
    pupBrowser?: puppeteer.Browser

    /**Accepts an invitation to join a group */
    acceptInvite(inviteCode: string): Promise<string>

    /** Accepts a private invitation to join a group (v4 invite) */
    acceptGroupV4Invite: (inviteV4: InviteV4Data) => Promise<{status: number}>

    /**Returns an object with information about the invite code's group */
    getInviteInfo(inviteCode: string): Promise<object>

    /** Enables and returns the archive state of the Chat */
    archiveChat(chatId: string): Promise<boolean>

    /** Pins the Chat and returns its new Pin state */
    pinChat(chatId: string): Promise<boolean>

    /** Unpins the Chat and returns its new Pin state */
    unpinChat(chatId: string): Promise<boolean>

    /**
     * Create a new group
     * @param name group title
     * @param participants an array of Contacts or contact IDs to add to the group
     */
    createGroup(name: string, participants: Contact[] | string[]): Promise<CreateGroupResult>

    /** Closes the client */
    destroy(): Promise<void>

    /** Logs out the client, closing the current session */
    logout(): Promise<void>

    /** Get chat instance by ID */
    getChatById(chatId: string): Promise<Chat>

    /** Get all current chat instances */
    getChats(): Promise<Chat[]>

    /** Get contact instance by ID */
    getContactById(contactId: string): Promise<Contact>

    /** Get all current contact instances */
    getContacts(): Promise<Contact[]>

    /** Get all current Labels  */
    getLabels(): Promise<Label[]>

    /** Get Label instance by ID */
    getLabelById(labelId: string): Promise<Label>

    /** Get all Labels assigned to a Chat */
    getChatLabels(chatId: string): Promise<Label[]>

    /** Get all Chats for a specific Label */
    getChatsByLabelId(labelId: string): Promise<Chat[]>

    /** Returns the contact ID's profile picture URL, if privacy settings allow it */
    getProfilePicUrl(contactId: string): Promise<string>

    /** Gets the current connection state for the client */
    getState(): Promise<WAState>

    /** Returns the version of WhatsApp Web currently being run */
    getWWebVersion(): Promise<string>

    /** Sets up events and requirements, kicks off authentication request */
    initialize(): Promise<void>

    /** Check if a given ID is registered in whatsapp */
    isRegisteredUser(contactId: string): Promise<boolean>

    /** Get the registered WhatsApp ID for a number. Returns null if the number is not registered on WhatsApp. */
    getNumberId(number: string): Promise<ContactId | null>

    /**
     * Mutes the Chat until a specified date
     * @param chatId ID of the chat that will be muted
     * @param unmuteDate Date when the chat will be unmuted
     */
    muteChat(chatId: string, unmuteDate: Date): Promise<void>

    /** Force reset of connection state for the client */
    resetState(): Promise<void>

    /** Send a message to a specific chatId */
    sendMessage(chatId: string, content: MessageContent, options?: MessageSendOptions): Promise<Message>

    /** Searches for messages */
    searchMessages(query: string, options?: { chatId?: string, page?: number, limit?: number }): Promise<Message[]>

    /** Marks the client as online */
    sendPresenceAvailable(): Promise<void>

    /** Mark as seen for the Chat */
    sendSeen(chatId: string): Promise<boolean>

    /** Mark the Chat as unread */
    markChatUnread(chatId: string): Promise<void>

    /**
     * Sets the current user's status message
     * @param status New status message
     */
    setStatus(status: string): Promise<void>

    /**
     * Sets the current user's display name
     * @param displayName New display name
     */
    setDisplayName(displayName: string): Promise<void>

    /** Changes and returns the archive state of the Chat */
    unarchiveChat(chatId: string): Promise<boolean>

    /** Unmutes the Chat */
    unmuteChat(chatId: string): Promise<void>

    /** Generic event */
    on(event: string, listener: (...args: any) => void): this

    /** Emitted when there has been an error while trying to restore an existing session */
    on(event: 'auth_failure', listener: (message: string) => void): this

    /** Emitted when authentication is successful */
    on(event: 'authenticated', listener: (
        /** Object containing session information. Can be used to restore the session */
        session: ClientSession
    ) => void): this

    /** Emitted when the battery percentage for the attached device changes */
    on(event: 'change_battery', listener: (batteryInfo: BatteryInfo) => void): this

    /** Emitted when the connection state changes */
    on(event: 'change_state', listener: (
        /** the new connection state */
        state: WAState
    ) => void): this

    /** Emitted when the client has been disconnected */
    on(event: 'disconnected', listener: (
        /** reason that caused the disconnect */
        reason: WAState | "NAVIGATED"
    ) => void): this

    /** Emitted when a user joins the chat via invite link or is added by an admin */
    on(event: 'group_join', listener: (
        /** GroupNotification with more information about the action */
        notification: GroupNotification
    ) => void): this

    /** Emitted when a user leaves the chat or is removed by an admin */
    on(event: 'group_leave', listener: (
        /** GroupNotification with more information about the action */
        notification: GroupNotification
    ) => void): this

    /** Emitted when group settings are updated, such as subject, description or picture */
    on(event: 'group_update', listener: (
        /** GroupNotification with more information about the action */
        notification: GroupNotification
    ) => void): this

    /** Emitted when media has been uploaded for a message sent by the client */
    on(event: 'media_uploaded', listener: (
        /** The message with media that was uploaded */
        message: Message
    ) => void): this

    /** Emitted when a new message is received */
    on(event: 'message', listener: (
        /** The message that was received */
        message: Message
    ) => void): this

    /** Emitted when an ack event occurrs on message type */
    on(event: 'message_ack', listener: (
        /** The message that was affected */
        message: Message,
        /** The new ACK value */
        ack: MessageAck
    ) => void): this

    /** Emitted when a new message is created, which may include the current user's own messages */
    on(event: 'message_create', listener: (
        /** The message that was created */
        message: Message
    ) => void): this

    /** Emitted when a message is deleted for everyone in the chat */
    on(event: 'message_revoke_everyone', listener: (
        /** The message that was revoked, in its current state. It will not contain the original message's data */
        message: Message,
        /**The message that was revoked, before it was revoked.
         * It will contain the message's original data.
         * Note that due to the way this data is captured,
         * it may be possible that this param will be undefined. */
        revoked_msg?: Message | null
    ) => void): this

    /** Emitted when a message is deleted by the current user */
    on(event: 'message_revoke_me', listener: (
        /** The message that was revoked */
        message: Message
    ) => void): this

    /** Emitted when the QR code is received */
    on(event: 'qr', listener: (
        /** qr code string
         *  @example ```1@9Q8tWf6bnezr8uVGwVCluyRuBOJ3tIglimzI5dHB0vQW2m4DQ0GMlCGf,f1/vGcW4Z3vBa1eDNl3tOjWqLL5DpYTI84DMVkYnQE8=,ZL7YnK2qdPN8vKo2ESxhOQ==``` */
        qr: string
    ) => void): this

    /** Emitted when the client has initialized and is ready to receive messages */
    on(event: 'ready', listener: () => void): this
  }

  /** Current connection information */
  export interface ClientInfo {
    /**
     * Current user ID
     * @deprecated Use .wid instead
     */
    me: ContactId
    /** Current user ID */
    wid: ContactId
    /** Information about the phone this client is connected to */
    phone: ClientInfoPhone
    /** Platform the phone is running on */
    platform: string
    /** Name configured to be shown in push notifications */
    pushname: string

    /** Get current battery percentage and charging status for the attached device */
    getBatteryStatus: () => Promise<BatteryInfo>
  }

  /** Information about the phone this client is connected to */
  export interface ClientInfoPhone {
    /** WhatsApp Version running on the phone */
    wa_version: string
    /** OS Version running on the phone (iOS or Android version) */
    os_version: string
    /** Device manufacturer */
    device_manufacturer: string
    /** Device model */
    device_model: string
    /** OS build number */
    os_build_number: string
  }

  /** Options for initializing the whatsapp client */
  export interface ClientOptions {
    /** Timeout for authentication selector in puppeteer
     * @default 45000 */
    authTimeoutMs?: number,
    /** Puppeteer launch options. View docs here: https://github.com/puppeteer/puppeteer/ */
    puppeteer?: puppeteer.LaunchOptions
    /** Refresh interval for qr code (how much time to wait before checking if the qr code has changed)
     * @default 20000 */
    qrRefreshIntervalMs?: number
    /** Timeout for qr code selector in puppeteer
     * @default 45000 */
    qrTimeoutMs?: number,
    /** Restart client with a new session (i.e. use null 'session' var) if authentication fails
     * @default false */
    restartOnAuthFail?: boolean
    /** Whatsapp session to restore. If not set, will start a new session */
    session?: ClientSession
    /** If another whatsapp web session is detected (another browser), take over the session in the current browser
     * @default false */
    takeoverOnConflict?: boolean,
    /** How much time to wait before taking over the session
     * @default 0 */
    takeoverTimeoutMs?: number,
    /** User agent to use in puppeteer.
     * @default 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36' */
    userAgent?: string
    /** Ffmpeg path to use when formating videos to webp while sending stickers
     * @default 'ffmpeg' */
    ffmpegPath?: string
  }

  /** Represents a Whatsapp client session */
  export interface ClientSession {
    WABrowserId: string,
    WASecretBundle: string,
    WAToken1: string,
    WAToken2: string,
  }

  export interface BatteryInfo {
    /** The current battery percentage */
    battery: number,
    /** Indicates if the phone is plugged in (true) or not (false) */
    plugged: boolean,
  }

  export interface CreateGroupResult {
    /** ID for the group that was just created */
    gid: string,
    /** participants that were not added to the group.
     * Keys represent the ID for participant that was not added and its value is a status code
     * that represents the reason why participant could not be added.
     * This is usually 403 if the user's privacy settings don't allow you to add them to groups. */
    missingParticipants: Record<string, string>
  }

  export interface GroupNotification {
    /** ContactId for the user that produced the GroupNotification */
    author: string,
    /** Extra content */
    body: string,
    /** ID for the Chat that this groupNotification was sent for */
    chatId: string,
    /** ID that represents the groupNotification
     *  @todo create a more specific type for the id object */
    id: object,
    /** Contact IDs for the users that were affected by this GroupNotification */
    recipientIds: string[],
    /** Unix timestamp for when the groupNotification was created */
    timestamp: number,
    /** GroupNotification type */
    type: GroupNotificationTypes,

    /** Returns the Chat this GroupNotification was sent in */
    getChat: () => Promise<Chat>,
    /** Returns the Contact this GroupNotification was produced by */
    getContact: () => Promise<Contact>,
    /** Returns the Contacts affected by this GroupNotification */
    getRecipients: () => Promise<Contact[]>,
    /** Sends a message to the same chat this GroupNotification was produced in */
    reply: (content: MessageContent, options?: MessageSendOptions) => Promise<Message>,

  }

  /** whatsapp web url */
  export const WhatsWebURL: string

  /** default client options */
  export const DefaultOptions: ClientOptions

  /** Chat types */
  export enum ChatTypes {
    SOLO = 'solo',
    GROUP = 'group',
    UNKNOWN = 'unknown',
  }

  /** Events that can be emitted by the client */
  export enum Events {
    AUTHENTICATED = 'authenticated',
    AUTHENTICATION_FAILURE = 'auth_failure',
    READY = 'ready',
    MESSAGE_RECEIVED = 'message',
    MESSAGE_CREATE = 'message_create',
    MESSAGE_REVOKED_EVERYONE = 'message_revoke_everyone',
    MESSAGE_REVOKED_ME = 'message_revoke_me',
    MESSAGE_ACK = 'message_ack',
    MEDIA_UPLOADED = 'media_uploaded',
    GROUP_JOIN = 'group_join',
    GROUP_LEAVE = 'group_leave',
    GROUP_UPDATE = 'group_update',
    QR_RECEIVED = 'qr',
    DISCONNECTED = 'disconnected',
    STATE_CHANGED = 'change_state',
    BATTERY_CHANGED = 'change_battery',
  }

  /** Group notification types */
  export enum GroupNotificationTypes {
    ADD = 'add',
    INVITE = 'invite',
    REMOVE = 'remove',
    LEAVE = 'leave',
    SUBJECT = 'subject',
    DESCRIPTION = 'description',
    PICTURE = 'picture',
    ANNOUNCE = 'announce',
    RESTRICT = 'restrict',
  }

  /** Message ACK */
  export enum MessageAck {
    ACK_ERROR = -1,
    ACK_PENDING = 0,
    ACK_SERVER = 1,
    ACK_DEVICE = 2,
    ACK_READ = 3,
    ACK_PLAYED = 4,
  }

  /** Message types */
  export enum MessageTypes {
    TEXT= 'chat',
    AUDIO= 'audio',
    VOICE= 'ptt',
    IMAGE= 'image',
    VIDEO= 'video',
    DOCUMENT= 'document',
    STICKER= 'sticker',
    LOCATION= 'location',
    CONTACT_CARD= 'vcard',
    CONTACT_CARD_MULTI= 'multi_vcard',
    ORDER= 'order',
    REVOKED= 'revoked',
    PRODUCT= 'product',
    UNKNOWN= 'unknown',
    GROUP_INVITE= 'groups_v4_invite',
    LIST= 'list',
    BUTTON_RESPONSE= 'buttons_response',
  }

  /** Client status */
  export enum Status {
    INITIALIZING = 0,
    AUTHENTICATING = 1,
    READY = 3,
  }

  /** WhatsApp state */
  export enum WAState {
    CONFLICT = 'CONFLICT',
    CONNECTED = 'CONNECTED',
    DEPRECATED_VERSION = 'DEPRECATED_VERSION',
    OPENING = 'OPENING',
    PAIRING = 'PAIRING',
    PROXYBLOCK = 'PROXYBLOCK',
    SMB_TOS_BLOCK = 'SMB_TOS_BLOCK',
    TIMEOUT = 'TIMEOUT',
    TOS_BLOCK = 'TOS_BLOCK',
    UNLAUNCHED = 'UNLAUNCHED',
    UNPAIRED = 'UNPAIRED',
    UNPAIRED_IDLE = 'UNPAIRED_IDLE',
  }

  export type MessageInfo = {
    delivery: Array<{id: ContactId, t: number}>,
    deliveryRemaining: number,
    played: Array<{id: ContactId, t: number}>,
    playedRemaining: number,
    read: Array<{id: ContactId, t: number}>,
    readRemaining: number
  }

  export type InviteV4Data = {
    inviteCode: string,
    inviteCodeExp: number,
    groupId: string,
    groupName?: string,
    fromId: string,
    toId: string
  }

  /**
   * Represents a Message on WhatsApp
   *
   * @example
   * {
   *   mediaKey: undefined,
   *   id: {
   *     fromMe: false,
   *     remote: `554199999999@c.us`,
   *     id: '1234567890ABCDEFGHIJ',
   *     _serialized: `false_554199999999@c.us_1234567890ABCDEFGHIJ`
   *   },
   *   ack: -1,
   *   hasMedia: false,
   *   body: 'Hello!',
   *   type: 'chat',
   *   timestamp: 1591482682,
   *   from: `554199999999@c.us`,
   *   to: `554188888888@c.us`,
   *   author: undefined,
   *   isForwarded: false,
   *   broadcast: false,
   *   fromMe: false,
   *   hasQuotedMsg: false,
   *   location: undefined,
   *   mentionedIds: []
   * }
   */
  export interface Message {
    isDynamicReplyButtonsMsg?:boolean,
    dynamicReplyButtons?: [],
    replyButtons?: [],
    footer?: string,
    question?: string,
    /** ACK status for the message */
    ack: MessageAck,
    /** If the message was sent to a group, this field will contain the user that sent the message. */
    author?: string,
    /** Message content */
    body: string,
    /** Indicates if the message was a broadcast */
    broadcast: boolean,
    /** Indicates if the message was a status update */
    isStatus: boolean,
    /** ID for the Chat that this message was sent to, except if the message was sent by the current user */
    from: string,
    /** Indicates if the message was sent by the current user */
    fromMe: boolean,
    /** Indicates if the message has media available for download */
    hasMedia: boolean,
    /** Indicates if the message was sent as a reply to another message */
    hasQuotedMsg: boolean,
    /** ID that represents the message */
    id: MessageId,
    /** Indicates if the message was forwarded */
    isForwarded: boolean,
    /**
     * Indicates how many times the message was forwarded.
     * The maximum value is 127.
     */
    forwardingScore: number,
    /** Indicates if the message was starred */
    isStarred: boolean,
    /** Location information contained in the message, if the message is type "location" */
    location: Location,
    /** List of vCards contained in the message */
    vCards: string[],
    /** Invite v4 info */
    inviteV4?: InviteV4Data,
    /** MediaKey that represents the sticker 'ID' */
    mediaKey?: string,
    /** Indicates the mentions in the message body. */
    mentionedIds: [],
    /** Unix timestamp for when the message was created */
    timestamp: number,
    /**
     * ID for who this message is for.
     * If the message is sent by the current user, it will be the Chat to which the message is being sent.
     * If the message is sent by another user, it will be the ID for the current user.
     */
    to: string,
    /** Message type */
    type: MessageTypes,
    /** Links included in the message. */
    links: Array<{
      link: string,
      isSuspicious: boolean
    }>,
    /** Order ID */
    orderId: string,
    /** title */
    title?: string,
    /** description*/
    description?: string,
    /** Business Owner JID */
    businessOwnerJid?: string,
    /** Product JID */
    productId?: string,
    /** Accept the Group V4 Invite in message */
    acceptGroupV4Invite: () => Promise<{status: number}>,
    /** Deletes the message from the chat */
    delete: (everyone?: boolean) => Promise<void>,
    /** Downloads and returns the attatched message media */
    downloadMedia: () => Promise<MessageMedia>,
    /** Returns the Chat this message was sent in */
    getChat: () => Promise<Chat>,
    /** Returns the Contact this message was sent from */
    getContact: () => Promise<Contact>,
    /** Returns the Contacts mentioned in this message */
    getMentions: () => Promise<Contact[]>,
    /** Returns the quoted message, if any */
    getQuotedMessage: () => Promise<Message>,
    /**
     * Sends a message as a reply to this message.
     * If chatId is specified, it will be sent through the specified Chat.
     * If not, it will send the message in the same Chat as the original message was sent.
     */
    reply: (content: MessageContent, chatId?: string, options?: MessageSendOptions) => Promise<Message>,
    /**
     * Forwards this message to another chat
     */
    forward: (chat: Chat | string) => Promise<void>,
    /** Star this message */
    star: () => Promise<void>,
    /** Unstar this message */
    unstar: () => Promise<void>,
    /** Get information about message delivery statuso */
    getInfo: () => Promise<MessageInfo | null>,
    /**
     * Gets the order associated with a given message
     */
    getOrder: () => Order,
  }

  /** ID that represents a message */
  export interface MessageId {
    fromMe: boolean,
    remote: string,
    id: string,
    _serialized: string,
  }

  /** Location information */
  export class Location {
    description?: string | null
    latitude: string
    longitude: string

    constructor(latitude: number, longitude: number, description?: string)
  }

  export interface Label {
    /** Label name */
    name: string,
    /** Label ID */
    id: string,
    /** Color assigned to the label */
    hexColor: string,

    /** Get all chats that have been assigned this Label */
    getChats: () => Promise<Chat[]>
  }

  /** Options for sending a message */
  export interface MessageSendOptions {
    /** Show links preview */
    linkPreview?: boolean
    /** Send audio as voice message */
    sendAudioAsVoice?: boolean
    /** Send video as gif */
    sendVideoAsGif?: boolean
    /** Send media as sticker */
    sendMediaAsSticker?: boolean
    /** Send media as document */
    sendMediaAsDocument?: boolean
    /** Automatically parse vCards and send them as contacts */
    parseVCards?: boolean
    /** Image or videos caption */
    caption?: string
    /** Id of the message that is being quoted (or replied to) */
    quotedMessageId?: string
    /** Contacts that are being mentioned in the message */
    mentions?: Contact[]
    /** Send 'seen' status */
    sendSeen?: boolean
    /** Media to be sent */
    media?: MessageMedia
    /** Extra options */
    extra?: any
    /** Sticker name, if sendMediaAsSticker is true */
    stickerName?: string
    /** Sticker author, if sendMediaAsSticker is true */
    stickerAuthor?: string
    /** Sticker categories, if sendMediaAsSticker is true */
    stickerCategories?: string[]
  }

  /** Media attached to a message */
  export class MessageMedia {
    /** MIME type of the attachment */
    mimetype: string
    /** Base64-encoded data of the file */
    data: string
    /** Document file name. Value can be null */
    filename?: string | null

    /**
     * @param {string} mimetype MIME type of the attachment
     * @param {string} data Base64-encoded data of the file
     * @param {?string} filename Document file name. Value can be null
     */
    constructor(mimetype: string, data: string, filename?: string | null)

    /** Creates a MessageMedia instance from a local file path */
    static fromFilePath: (filePath: string) => MessageMedia
  }

  export type MessageContent = string | MessageMedia | Location | Contact | Contact[]

  /**
   * Represents a Contact on WhatsApp
   *
   * @example
   * {
   *   id: {
   *     server: 'c.us',
   *     user: '554199999999',
   *     _serialized: `554199999999@c.us`
   *   },
   *   number: '554199999999',
   *   isBusiness: false,
   *   isEnterprise: false,
   *   labels: [],
   *   name: undefined,
   *   pushname: 'John',
   *   sectionHeader: undefined,
   *   shortName: undefined,
   *   statusMute: false,
   *   type: 'in',
   *   verifiedLevel: undefined,
   *   verifiedName: undefined,
   *   isMe: false,
   *   isUser: true,
   *   isGroup: false,
   *   isWAContact: true,
   *   isMyContact: false
   * }
   */
  export interface Contact {
    /** Contact's phone number */
    number: string,
    /** Indicates if the contact is a business contact */
    isBusiness: boolean,
    /** ID that represents the contact */
    id: ContactId,
    /** Indicates if the contact is an enterprise contact */
    isEnterprise: boolean,
    /** Indicates if the contact is a group contact */
    isGroup: boolean,
    /** Indicates if the contact is the current user's contact */
    isMe: boolean,
    /** Indicates if the number is saved in the current phone's contacts */
    isMyContact: boolean
    /** Indicates if the contact is a user contact */
    isUser: boolean,
    /** Indicates if the number is registered on WhatsApp */
    isWAContact: boolean,
    /** Indicates if you have blocked this contact */
    isBlocked: boolean,
    /** @todo verify labels type. didn't have any documentation */
    labels?: string[],
    /** The contact's name, as saved by the current user */
    name?: string,
    /** The name that the contact has configured to be shown publically */
    pushname: string,
    /** @todo missing documentation */
    sectionHeader: string,
    /** A shortened version of name */
    shortName?: string,
    /** Indicates if the status from the contact is muted */
    statusMute: boolean,
    /** @todo missing documentation */
    type: string,
    /** @todo missing documentation */
    verifiedLevel?: undefined,
    /** @todo missing documentation */
    verifiedName?: undefined,

    /** Returns the contact's profile picture URL, if privacy settings allow it */
    getProfilePicUrl: () => Promise<string>,

    /** Returns the Chat that corresponds to this Contact.
     * Will return null when getting chat for currently logged in user.
     */
    getChat: () => Promise<Chat>,

    /** Blocks this contact from WhatsApp */
    block: () => Promise<boolean>,
    /** Unlocks this contact from WhatsApp */
    unblock: () => Promise<boolean>,

    /** Gets the Contact's current "about" info. Returns null if you don't have permission to read their status.  */
    getAbout: () => Promise<string | null>,

  }

  export interface ContactId {
    server: string,
    user: string,
    _serialized: string,
  }

  export interface BusinessContact extends Contact {
    /**
     * The contact's business profile
     * @todo add a more specific type for the object
     */
    businessProfile: object
  }

  export interface PrivateContact extends Contact {

  }

  /**
   * Represents a Chat on WhatsApp
   *
   * @example
   * {
   *   id: {
   *     server: 'c.us',
   *     user: '554199999999',
   *     _serialized: `554199999999@c.us`
   *   },
   *   name: '+55 41 9999-9999',
   *   isGroup: false,
   *   isReadOnly: false,
   *   unreadCount: 6,
   *   timestamp: 1591484087,
   *   archived: false
   * }
   */
  export interface Chat {
    /** Indicates if the Chat is archived */
    archived: boolean,
    /** ID that represents the chat */
    id: ChatId,
    /** Indicates if the Chat is a Group Chat */
    isGroup: boolean,
    /** Indicates if the Chat is readonly */
    isReadOnly: boolean,
    /** Indicates if the Chat is muted */
    isMuted: boolean,
    /** Unix timestamp for when the mute expires */
    muteExpiration: number,
    /** Title of the chat */
    name: string,
    /** Unix timestamp for when the last activity occurred */
    timestamp: number,
    /** Amount of messages unread */
    unreadCount: number,

    /** Archives this chat */
    archive: () => Promise<void>,
    /** Pins this chat and returns its new Pin state */
    pin: () => Promise<boolean>,
    /** Unpins this chat and returns its new Pin state */
    unpin: () => Promise<boolean>,
    /** Clears all messages from the chat */
    clearMessages: () => Promise<boolean>,
    /** Stops typing or recording in chat immediately. */
    clearState: () => Promise<boolean>,
    /** Deletes the chat */
    delete: () => Promise<boolean>,
    /** Loads chat messages, sorted from earliest to latest. */
    fetchMessages: (searchOptions: MessageSearchOptions) => Promise<Message[]>,
    /** Loads chat messages, sorted from earliest to latest. */
    fetchMessagesUntilForSurvey: (limitMsg: Message) => Promise<Message[]>,
    /** Mutes this chat until a specified date */
    mute: (unmuteDate: Date) => Promise<void>,
    /** Send a message to this chat */
    sendMessage: (content: MessageContent, options?: MessageSendOptions) => Promise<Message>,
    /** Set the message as seen */
    sendSeen: () => Promise<void>,
    /** Simulate recording audio in chat. This will last for 25 seconds */
    sendStateRecording: () => Promise<void>,
    /** Simulate typing in chat. This will last for 25 seconds. */
    sendStateTyping: () => Promise<void>,
    /** un-archives this chat */
    unarchive: () => Promise<void>,
    /** Unmutes this chat */
    unmute: () => Promise<void>,
    /** Returns the Contact that corresponds to this Chat. */
    getContact: () => Promise<Contact>,
    /** Marks this Chat as unread */
    markUnread: () => Promise<void>
    /** Returns array of all Labels assigned to this Chat */
    getLabels: () => Promise<Label[]>
  }

  export interface MessageSearchOptions {
    /**
     * The amount of messages to return.
     * Note that the actual number of returned messages may be smaller if there aren't enough messages in the conversation.
     * Set this to Infinity to load all messages.
     * @default 50
     */
    limit?: number
  }

  /**
   * Id that represents the chat
   *
   * @example
   * id: {
   *   server: 'c.us',
   *   user: '554199999999',
   *   _serialized: `554199999999@c.us`
   * },
   */
  export interface ChatId {
    /**
     * Whatsapp server domain
     * @example `c.us`
     */
    server: string,
    /**
     * User whatsapp number
     * @example `554199999999`
     */
    user: string,
    /**
     * Serialized id
     * @example `554199999999@c.us`
     */
    _serialized: string,
  }

  export interface PrivateChat extends Chat {

  }

  export type GroupParticipant = {
    id: ContactId,
    isAdmin: boolean
    isSuperAdmin: boolean
  }

  /** Promotes or demotes participants by IDs to regular users or admins */
  export type ChangeParticipantsPermisions =
      (participantIds: Array<string>) => Promise<{ status: number }>

  /** Adds or removes a list of participants by ID to the group */
  export type ChangeGroupParticipants =
      (participantIds: Array<string>) => Promise<{
        status: number;
        participants: Array<{
          [key: string]: {
            code: number
          }
        }>
      } & {
        [key: string]: number;
      }>

  export interface GroupChat extends Chat {
    /** Group owner */
    owner: ContactId;
    /** Date at which the group was created */
    createdAt: Date;
    /** Group description */
    description: string;
    /** Group participants */
    participants: Array<GroupParticipant>;
    /** Adds a list of participants by ID to the group */
    addParticipants: ChangeGroupParticipants;
    /** Removes a list of participants by ID to the group */
    removeParticipants: ChangeGroupParticipants;
    /** Promotes participants by IDs to admins */
    promoteParticipants: ChangeParticipantsPermisions;
    /** Demotes participants by IDs to regular users */
    demoteParticipants: ChangeParticipantsPermisions;
    /** Updates the group subject */
    setSubject: (subject: string) => Promise<void>;
    /** Updates the group description */
    setDescription: (description: string) => Promise<void>;
    /** Updates the group settings to only allow admins to send messages
     * @param {boolean} [adminsOnly=true] Enable or disable this option
     * @returns {Promise<boolean>} Returns true if the setting was properly updated. This can return false if the user does not have the necessary permissions.
     */
    setMessagesAdminsOnly: (adminsOnly?: boolean) => Promise<boolean>;
    /**
     * Updates the group settings to only allow admins to edit group info (title, description, photo).
     * @param {boolean} [adminsOnly=true] Enable or disable this option
     * @returns {Promise<boolean>} Returns true if the setting was properly updated. This can return false if the user does not have the necessary permissions.
     */
    setInfoAdminsOnly: (adminsOnly?: boolean) => Promise<boolean>;
    /** Gets the invite code for a specific group */
    getInviteCode: () => Promise<string>;
    /** Invalidates the current group invite code and generates a new one */
    revokeInvite: () => Promise<void>;
    /** Makes the bot leave the group */
    leave: () => Promise<void>;
  }

  /**
   * Represents the metadata associated with a given product
   *
   */
  export interface ProductMetadata {
    /** Product Id */
    id: string,
    /** Product Name */
    name: string,
    /** Product Description */
    description: string,
    /** Retailer ID */
    retailer_id?: string
  }

  /**
   * Represents a Product on Whatsapp
   * @example
   * {
   * "id": "123456789",
   * "price": "150000",
   * "thumbnailId": "123456789",
   * "thumbnailUrl": "https://mmg.whatsapp.net",
   * "currency": "GTQ",
   * "name": "Store Name",
   * "quantity": 1
   * }
   */
  export interface Product {
    /** Product Id */
    id: string,
    /** Price */
    price?: string,
    /** Product Thumbnail*/
    thumbnailUrl: string,
    /** Currency */
    currency: string,
    /** Product Name */
    name: string,
    /** Product Quantity*/
    quantity: number,
    /** Gets the Product metadata */
    getData: () => Promise<ProductMetadata>
  }

  /**
   * Represents a Order on WhatsApp
   *
   * @example
   * {
   * "products": [
   * {
   * "id": "123456789",
   * "price": "150000",
   * "thumbnailId": "123456789",
   * "thumbnailUrl": "https://mmg.whatsapp.net",
   * "currency": "GTQ",
   * "name": "Store Name",
   * "quantity": 1
   * }
   * ],
   * "subtotal": "150000",
   * "total": "150000",
   * "currency": "GTQ",
   * "createdAt": 1610136796,
   * "sellerJid": "55555555@s.whatsapp.net"
   * }
   */
  export interface Order {
    /** List of products*/
    products: Array<Product>,
    /** Order Subtotal */
    subtotal: string,
    /** Order Total */
    total: string,
    /** Order Currency */
    currency: string,
    /** Order Created At*/
    createdAt: number;
  }

  /** Message type List */
  export class List {
    body: string
    buttonText: string
    sections: Array<any>
    title?: string | null
    footer?: string | null

    constructor(body: string, buttonText: string, sections: Array<any>, title?: string | null, footer?: string | null)
  }

  /** Message type buttons */
  export class Buttons {
    body: string | MessageMedia
    buttons: Array<Array<string>>
    title?: string | null
    footer?: string | null

    constructor(body: string, buttons: Array<Array<string>>, title?: string | null, footer?: string | null)
  }
}

export = WAWebJS
