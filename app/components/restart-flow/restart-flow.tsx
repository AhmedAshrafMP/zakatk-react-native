import { observer } from "mobx-react-lite"
import * as React from "react"
import { Alert, Image, ImageStyle, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Text } from "../"
import { spacing } from "../../theme"

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingVertical: spacing[2],
}

const TEXT: TextStyle = {
  fontSize: 16,
}
const BACK_ICON: ImageStyle = {
  height: 16,
  width: 16,
  marginHorizontal: spacing[1],
}

export interface RestartFlowProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  onRestart?(): void
}

/**
 * Describe your component here
 */
export const RestartFlow = observer(function RestartFlow(props: RestartFlowProps) {
  const { style, onRestart } = props

  const confirmRestart = () =>
    Alert.alert("هل انت متاكد؟", "سيتم مسح جميع القيم و الرجوع الي البدايه من جديد", [
      {
        text: "اكمل",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "موافق", onPress: () => onRestart(), style: "destructive" },
    ])

  return (
    <TouchableOpacity style={CONTAINER} onPress={() => confirmRestart()}>
      <Text preset="default" style={TEXT} text="اعادة" />
      <Image source={require("./Bitmap.png")} style={BACK_ICON} resizeMode="contain" />
    </TouchableOpacity>
  )
})
