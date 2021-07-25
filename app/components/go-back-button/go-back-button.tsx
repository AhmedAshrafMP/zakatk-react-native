import { observer } from "mobx-react-lite"
import * as React from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { Text } from "../"
import { spacing } from "../../theme"

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
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
export interface GoBackButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  onBack(): void
}

/**
 * Describe your component here
 */
export const GoBackButton = observer(function GoBackButton(props: GoBackButtonProps) {
  const { style, onBack } = props

  return (
    <TouchableOpacity style={CONTAINER} onPress={() => onBack()}>
      <Image source={require("./Bitmap.png")} style={BACK_ICON} resizeMode="contain" />
      <Text
        preset="default"
        numberOfLines={1}
        adjustsFontSizeToFit
        style={TEXT}
        text="الخطوة السابقة"
      />
    </TouchableOpacity>
  )
})
