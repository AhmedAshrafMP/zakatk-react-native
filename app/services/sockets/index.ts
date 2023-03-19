/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { BehaviorSubject, Observable } from "rxjs"
import { RootStore } from "../../models"
import uuid from "react-native-uuid"

export interface BotkitSocketsType {
  connectionStatus$(): Observable<SocketStatus>
  messagesList$(): Observable<SocketMessage[]>
  sendMessage(msg: string): void
  getBotkitUser(): BotkitUser
  socketInstance(): WebSocket
  tryToReconnect(force: boolean): void
  messagesList(): SocketMessage[]
  onRestart(): void
}

export type SocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED"

export interface BotkitDefaultAttachment {
  title: string
  contentType: string
}

export interface BotkitAttachmentInput {
  title: string
  contentType: "application/vnd.microsoft.input"
  content: {
    type: string
    validation: string
  }
}

export interface BotkitAttachmentCalendar {
  title: string
  contentType: "application/vnd.microsoft.card.calendar"
  content: {
    type: string
    calendar_type: "HIJRI" | "GEORGIAN"
  }
}

export interface QuickReply {
  payload: string
  title: string
}
export interface BotkitMessageQR {
  attachment?: BotkitDefaultAttachment[] | any[]
  attachments?: BotkitDefaultAttachment[] | any[]
  quick_replies?: QuickReply[]
  text: string
  type: "MESSAGE"
}
export interface BotkitMessageInput {
  attachment?:
    | BotkitDefaultAttachment[]
    | BotkitAttachmentInput[]
    | BotkitAttachmentCalendar[]
    | any[]
  attachments?:
    | BotkitDefaultAttachment[]
    | BotkitAttachmentInput[]
    | BotkitAttachmentCalendar[]
    | any[]
  quick_replies?: QuickReply[]
  text: string
  type: "MESSAGE"
}

export interface SocketMessage {
  sent?: boolean
  from: "BOT" | "USER"
  message: BotkitMessageQR | BotkitMessageInput
}
export interface UserMessage {
  message: string
}
interface Options {
  retries?: number
}

interface BotkitUser {
  uuid: string
  channel: string
}

export class BotkitSockets implements BotkitSocketsType {
  _rootStore: RootStore
  _retries: number
  _failedTrials: number
  _user: BotkitUser

  _socket: WebSocket

  _messages$: BehaviorSubject<SocketMessage[]>
  _socketStatus$: BehaviorSubject<SocketStatus>

  myInstance = null

  getInstance(): BotkitSocketsType {
    if (this.myInstance === null) {
      this.myInstance = new BotkitSockets()
    }
    return this.myInstance
  }

  constructor() {
    this._retries = 5
    this._failedTrials = 1

    this.initUser()
    this.initObs()
    this.initSocket()
  }

  onRestart(): void {
    this._messages$.next([])
    this.initUser()
    this.sendMessage("Hello")
  }

  messagesList(): SocketMessage[] {
    return this._messages$.getValue()
  }

  initUser() {
    this._user = {
      uuid: `${uuid.v4()}`,
      channel: "default",
    }
  }

  initObs(): void {
    this._messages$ = new BehaviorSubject([])
    this._socketStatus$ = new BehaviorSubject("CONNECTING")
  }

  initSocket(): WebSocket | null {
    if (this._retries > this._failedTrials) {
      if (__DEV__) {
        this._socket = new WebSocket("ws://167.99.141.120")
      } else {
        this._socket = new WebSocket("ws://167.99.141.120")
      }

      if (this._socket) {
        this._bindSocketEvents()
      }
      return this._socket
    } else {
      return null
    }
  }

  socketInstance(): WebSocket {
    return this._socket
  }

  connectionStatus$(): Observable<SocketStatus> {
    return this._socketStatus$
  }

  messagesList$(): Observable<SocketMessage[]> {
    return this._messages$.asObservable()
  }

  sendMessage(msg: string) {
    if (this._socket.readyState > 0) {
      const MsgObj = {
        type: "message",
        user: this._user.uuid,
        text: msg,
        channel: "websocket",
      }
      this._socket.send(JSON.stringify(MsgObj))
      this._addMessage({
        sent: true,
        from: "USER",
        message: {
          text: `${msg}`,
          type: "MESSAGE",
        },
      })
    }
  }

  getBotkitUser() {
    return this._user
  }

  onConnectionStatusChange(status: SocketStatus): void {
    this._socketStatus$.next(status)
  }

  /**
   * socket events
   */

  _bindSocketEvents() {
    this._socket.onopen = this._OnSocketOpen.bind(this)
    this._socket.onclose = this._OnSocketClose.bind(this)
    this._socket.onerror = this._OnSocketError.bind(this)
    this._socket.onmessage = this._OnSocketMessage.bind(this)
  }

  _OnSocketOpen() {
    this.onConnectionStatusChange("OPEN")
    this._stopReconnectTrials()
    this._failedTrials = 1
    // this._messages$.next([])
    // this._socket.send(
    //   JSON.stringify({
    //     type: "welcome_back",
    //     user: this._user.uuid,
    //     channel: "socket",
    //     user_profile: null,
    //   }),
    // )
  }

  _OnSocketClose(reason: WebSocketCloseEvent) {
    if (this._failedTrials === this._retries) {
      this.onConnectionStatusChange("CLOSED")
    } else {
      this.trialInterval = setTimeout(() => {
        this.tryToReconnect(false)
        this._failedTrials++
      }, 5000)
    }

    // first close connection failed
  }

  _OnSocketError(err: WebSocketErrorEvent) {
    this.onConnectionStatusChange("CLOSING")

    return err
  }

  _OnSocketMessage(event: WebSocketMessageEvent) {
    this._addMessage({
      from: "BOT",
      sent: true,
      message: JSON.parse(event.data),
    })
  }

  trialInterval
  tryToReconnect(force: boolean): void {
    if (force) {
      this._failedTrials = 1
    }
    this.initSocket()

    console.log("TryingToReconnect trial <" + this._failedTrials + ">")
  }

  _stopReconnectTrials() {
    this.trialInterval && clearTimeout(this.trialInterval)
  }

  /**
   * Messages
   */
  _addMessage(message: SocketMessage) {
    const messageArray = this._messages$.getValue()
    messageArray.push(message)
    this._messages$.next(messageArray)
  }
}

export const BotkitWSInstance = new BotkitSockets()
