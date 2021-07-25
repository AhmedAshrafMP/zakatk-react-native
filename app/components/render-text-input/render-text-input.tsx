/* eslint-disable camelcase */
import { observer } from "mobx-react-lite"
import * as React from "react"
import {
  KeyboardAvoidingView,
  TextStyle,
  View,
  ViewStyle,
  SafeAreaView,
  ScrollView,
} from "react-native"
import {
  BotkitAttachmentCalendar,
  BotkitAttachmentInput,
  BotkitDefaultAttachment,
  SocketMessage,
} from "../../services/sockets"
import { color, spacing } from "../../theme"
import { ReadMoreText } from "../read-more-text/read-more-text"
import { TextField, Button } from "../"
import { palette } from "../../theme/palette"
import { RenderCalendars } from "../render-calendars/render-calendars"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  flex: 1,
}

const TEXT_CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-end",
  padding: spacing[5],
}
const TEXT_STYLE: TextStyle = {
  fontSize: 19,
  color: palette.default,
  textAlign: "left",
}

const QR_BUTTON: ViewStyle = {
  padding: spacing[4],
  height: 70,
  borderRadius: 0,
}
const INPUT_STYLE: TextStyle = {
  padding: spacing[4],
  backgroundColor: palette.offWhite,
  textAlign: "left",
}

export interface RenderTextInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  message?: SocketMessage
  isSending?: boolean
  onReply?(message: string): void
}

/**
 * Describe your component here
 */
export const RenderTextInput = observer(function RenderTextInput(props: RenderTextInputProps) {
  const { style, message, onReply, isSending } = props

  const [currentValue, setCurrentValue] = React.useState(null)
  const typeAttachment:
    | any
    | BotkitDefaultAttachment
    | BotkitAttachmentCalendar
    | BotkitAttachmentInput =
    message.message?.attachment && message.message?.attachment.length > 0
      ? message.message?.attachment[0]
      : null

  let viewType = "INPUT"
  let inputType = "NUMBER"
  if (typeAttachment && typeAttachment !== undefined) {
    if (typeAttachment.contentType === "application/vnd.microsoft.input") {
      if (typeAttachment.content?.type === "number") {
        inputType = "NUMBER"
      } else if (typeAttachment.content?.type === "money") {
        inputType = "MONEY"
      } else {
        inputType = "TEXT"
      }
    } else if (typeAttachment.contentType === "application/vnd.microsoft.card.calendar") {
      viewType = "CALENDAR"
      inputType = typeAttachment.content?.calendar_type
    } else {
      viewType = "DEFAULT"
    }
  }

  console.log(viewType, inputType)

  return (
    <View style={[CONTAINER, style]}>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={TEXT_CONTAINER}
      >
        <ReadMoreText text={`${message.message.text}`} textStyle={TEXT_STYLE} />
      </ScrollView>
      <KeyboardAvoidingView>
        {viewType === "INPUT" && (
          <TextField
            autoFocus
            style={INPUT_STYLE}
            type={inputType}
            placeholder={`القيمه`}
            label={`${message.message.text}`}
            onChangeText={(v) => setCurrentValue(v)}
          />
        )}
        {viewType === "CALENDAR" && <RenderCalendars onValueChange={(v) => setCurrentValue(v)} />}
        {viewType === "DEFAULT" && <View />}
        <Button
          disabled={!currentValue || currentValue.length < 1 || isSending}
          style={QR_BUTTON}
          text={"ادخال"}
          onPress={() => onReply(currentValue)}
        />
      </KeyboardAvoidingView>
      <SafeAreaView />
    </View>
  )
})
