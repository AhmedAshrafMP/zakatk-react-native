import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { spacing } from "../../theme"
import { translate } from "../../i18n/"
import { palette } from "../../theme/palette"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[3],
  alignItems: "center",
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
  justifyContent: "flex-start",
  backgroundColor: palette.white,
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.1,
  shadowRadius: 7,
  elevation: 7,
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: "30%" }
const RIGHT: ViewStyle = { width: "30%" }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    renderLeft,
    renderRight,
    renderMid,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...ROOT, ...style }}>
      {leftIcon && (
        <Button preset="link" onPress={onLeftPress}>
          <Icon icon={leftIcon} />
        </Button>
      )}
      {renderLeft && <View style={LEFT}>{renderLeft({})}</View>}
      <View style={TITLE_MIDDLE}>
        {renderMid ? renderMid({}) : <Text style={{ ...TITLE, ...titleStyle }} text={header} />}
      </View>
      {rightIcon && (
        <Button preset="link" onPress={onRightPress}>
          <Icon icon={rightIcon} />
        </Button>
      )}

      {renderRight && <View style={RIGHT}>{renderRight({})}</View>}
    </View>
  )
}
