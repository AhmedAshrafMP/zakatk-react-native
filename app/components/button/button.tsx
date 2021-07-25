import * as React from "react"
import { TouchableOpacity, ImageBackground } from "react-native"
import { Text } from "../text/text"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { mergeAll, flatten } from "ramda"
import { palette } from "../../theme/palette"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    disabled,
    ...rest
  } = props

  const viewStyle = mergeAll(flatten([viewPresets[preset] || viewPresets.primary, styleOverride]))
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, textStyleOverride]),
  )

  const content = children || (
    <Text adjustsFontSizeToFit numberOfLines={2} tx={tx} text={text} style={textStyle} />
  )

  const combinedStyle = [viewStyle]
  // if (disabled) {
  //   combinedStyle.push({ opacity: 0.1 })
  // }

  if (preset === "link") {
    return (
      <TouchableOpacity disabled={disabled} style={combinedStyle} {...rest}>
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground
      source={require("./btn-bg.png")}
      style={{
        backgroundColor: palette.default,
        opacity: disabled ? 0.6 : 1,
      }}
      resizeMode="cover"
    >
      <TouchableOpacity disabled={disabled} style={combinedStyle} {...rest}>
        {content}
      </TouchableOpacity>
    </ImageBackground>
  )
}
