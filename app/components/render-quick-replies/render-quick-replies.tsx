/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { observer } from "mobx-react-lite"
import * as React from "react"
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button } from "../"
import { SocketMessage } from "../../services/sockets"
import { spacing } from "../../theme"
import { palette } from "../../theme/palette"
import { ReadMoreText } from "../read-more-text/read-more-text"

const CONTAINER: ViewStyle = {
  justifyContent: "flex-end",
  flex: 1,
  position: "relative",
}

const LOADING_VIEW: ViewStyle = {
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, .8)",
  alignItems: "center",
  justifyContent: "center",
}
const BUTTONS_GROUP_VIEW: ViewStyle = {
  position: "relative",
}

const TEXT_STYLE: TextStyle = {
  fontSize: 19,
  color: palette.default,
  textAlign: "left",
  paddingHorizontal: spacing[4],
}
const TEXT_CONTAINER: ViewStyle = {
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "flex-end",
  padding: spacing[1],
}
const BUTTON_GROUP_CONTAINER: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "flex-start", // if you want to fill rows left to right
}
const QR_BUTTON: ViewStyle = {
  padding: spacing[4],
  height: 70,
  borderRadius: 0,
}

const BUTTON_GROUP_ITEM: ViewStyle = {
  width: "50%",
  padding: spacing[1],
}
const BUTTON_GROUP_ITEM_LAST: ViewStyle = {
  width: "100%",
}

export interface RenderQuickRepliesProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  message: SocketMessage
  isSending?: boolean
  onReply?(message: string): void
}

/**
 * Describe your component here
 */
export const RenderQuickReplies = observer(function RenderQuickReplies(
  props: RenderQuickRepliesProps,
) {
  const { style, message, onReply, isSending } = props

  console.log()

  return (
    <View style={[CONTAINER, style]}>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={TEXT_CONTAINER}
      >
        <ReadMoreText
          text={`${message.message.text}`}
          attachments={message.message.attachments}
          textStyle={TEXT_STYLE}
        />
      </ScrollView>
      <View style={BUTTONS_GROUP_VIEW}>
        <RenderButtonGroup message={message} onReply={onReply} />
        {isSending && (
          <View style={LOADING_VIEW}>
            <ActivityIndicator color={palette.default} size="large" />
          </View>
        )}
      </View>
      <SafeAreaView />
    </View>
  )
})

interface RenderButtonGroupProps {
  message: SocketMessage
  onReply?(message: string): void
}

export default function RenderButtonGroup(props: RenderButtonGroupProps) {
  const {
    message: {
      message: { quick_replies },
    },
    onReply,
  } = props
  if (!quick_replies || quick_replies.length <= 0) return null

  const onPressButton = (answer) => {
    setTimeout(() => {
      onReply(answer)
    }, 200)
  }

  const filteredQuick_replies = quick_replies.filter((el) => el.payload !== "on_go_back")

  return (
    <View style={BUTTON_GROUP_CONTAINER}>
      {filteredQuick_replies.map((qr, index) => {
        const buttonStyle = [BUTTON_GROUP_ITEM]

        if (filteredQuick_replies.length % 2 !== 0 && index === 0) {
          buttonStyle.push(BUTTON_GROUP_ITEM_LAST)
        }

        return (
          <View key={`qt_${index}_${qr.payload}`} style={buttonStyle}>
            <Button style={QR_BUTTON} text={qr.title} onPress={() => onPressButton(qr.payload)} />
          </View>
        )
      })}
    </View>
  )
}
