/* eslint-disable camelcase */
import { observer } from "mobx-react-lite"
import React from "react"
import { ViewStyle, Image, ImageStyle, ImageBackground, Dimensions, View } from "react-native"
import { map } from "rxjs/operators"
import {
  Button,
  ConnectionError,
  GoBackButton,
  Header,
  RenderQuickReplies,
  RenderTextInput,
  RestartFlow,
  Screen,
} from "../../components"
import { BotkitWSInstance, SocketMessage, SocketStatus } from "../../services/sockets"
import { spacing } from "../../theme"
import { palette } from "../../theme/palette"

const WS = BotkitWSInstance.getInstance()
let welcomeSent = 0
const ROOT_SCREEN: ViewStyle = {
  flex: 1,
  backgroundColor: palette.white,
  flexDirection: "column",
}

const PAGE_BACKGROUND_HOLDER: ImageStyle = {
  width: Dimensions.get("window").width / 2,
  height: 280,
  position: "absolute",
  bottom: 0,
}

const LEFT_SMALL_LOGO: ImageStyle = {
  height: 70,
  width: 70,
  alignSelf: "center",
}
const IMAGE_HOLDER: ViewStyle = {
  paddingVertical: spacing[2],
}

const VIEW_HOLDER: ViewStyle = {
  height: 25,
}

const SPLASH_HOLDER: ViewStyle = {}
const SPLASH_IMAGE: ImageStyle = {
  width: "100%",
  height: 400,
}

export const WelcomeScreen = observer(function WelcomeScreen() {
  const [lastMessage, setLastMessage] = React.useState<SocketMessage>(null)
  const [canGoBack, setCanGoBack] = React.useState<boolean>(false)
  const [sending, setSending] = React.useState(false)
  const [connectionStatus, setConnectionStatus] = React.useState<SocketStatus>("CONNECTING")

  const updateLastMessage = (msg: SocketMessage) => {
    const hasBackOptions =
      msg?.message?.quick_replies?.filter((el) => el.payload === "on_go_back").length > 0
    if (hasBackOptions) {
      setCanGoBack(true)
    } else {
      setCanGoBack(false)
    }
    setLastMessage(msg)
  }

  const pointToLastMessage = () =>
    WS.messagesList$()
      .pipe(
        // get the last message from bot only
        map((data) => data.filter((msg) => msg.from === "BOT")),
        map((data) => data[data.length - 1]),
      )
      .subscribe((msg) => {
        setSending(false)
        setLastMessage(null)
        updateLastMessage(msg)
      })

  const initFlow = () => {
    WS.onRestart()
    welcomeSent = 1
    setSending(false)
  }
  const forceReconnect = (force) => {
    WS.tryToReconnect(force)
    welcomeSent = 0
    setSending(false)
  }

  const sendUserMessage = (msg) => {
    const currentMessageList = WS.messagesList()
    const lastMessage = currentMessageList[currentMessageList.length - 1]
    if (lastMessage.from === "BOT") {
      // only replay if last message was from bot
      WS.sendMessage(msg)
      setSending(true)
    }
  }

  React.useEffect(() => {
    /**
     * Start convo
     */
    WS.connectionStatus$().subscribe((status) => {
      if (status === "OPEN" && connectionStatus === "CONNECTING" && welcomeSent === 0) {
        initFlow()
      }
      console.log("CURRENTSTATE", status)
      setConnectionStatus(status)
    })
    /**
     * Listen for last message
     */
    pointToLastMessage()
  }, [])

  const renderMessageByType = (message: SocketMessage) => {
    if (message.message.quick_replies && message.message.quick_replies.length > 0) {
      return (
        <RenderQuickReplies
          message={message}
          isSending={sending}
          onReply={(msg) => sendUserMessage(msg)}
        />
      )
    } else {
      return (
        <RenderTextInput
          message={message}
          isSending={sending}
          onReply={(msg) => sendUserMessage(msg)}
        />
      )
    }
  }

  if (connectionStatus === "CLOSED" || connectionStatus === "CLOSING") {
    return (
      <ConnectionError
        tryToReconnect={(force) => forceReconnect(force)}
        showReconnect={connectionStatus === "CLOSED"}
      />
    )
  }
  return (
    <Screen style={ROOT_SCREEN} preset="fixed" statusBar="dark-content">
      {WS && WS.messagesList().length > 2 ? (
        <>
          <Header
            renderLeft={() => {
              if (canGoBack) {
                return <GoBackButton onBack={() => sendUserMessage("on_go_back")} />
              } else {
                return <View style={VIEW_HOLDER} />
              }
            }}
            renderRight={() => (
              <RestartFlow
                onRestart={() => {
                  WS.onRestart()
                }}
              />
            )}
          />
          <View style={IMAGE_HOLDER}>
            <Image resizeMode="contain" style={LEFT_SMALL_LOGO} source={require("./logo.png")} />
          </View>
        </>
      ) : (
        <>
          <View style={SPLASH_HOLDER}>
            <Image
              source={require("./splash_icon.png")}
              resizeMode="contain"
              style={SPLASH_IMAGE}
            />
          </View>
        </>
      )}

      <ImageBackground
        source={require("./page-bg.png")}
        style={PAGE_BACKGROUND_HOLDER}
        resizeMode="contain"
      />
      {lastMessage && lastMessage.message ? (
        renderMessageByType(lastMessage)
      ) : (
        <ConnectionError tryToReconnect={() => initFlow()} />
      )}
    </Screen>
  )
})
