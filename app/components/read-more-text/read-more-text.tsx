import * as React from "react"
import { TextStyle, ViewStyle, Text as RNText, ScrollView } from "react-native"
import { Text } from "../"
import { color, spacing, typography } from "../../theme"
import { palette } from "../../theme/palette"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT_STYLE: TextStyle = {
  marginBottom: spacing[4],
}

const readMoreStyle: TextStyle = {
  color: palette.white,
  fontSize: 16,
  backgroundColor: palette.orangeDarker,
  width: "100%",
  textAlign: "center",
  padding: spacing[2],
}

export interface ReadMoreTextProps {
  /**
   * An optional style override useful for padding & margin.
   */
  textStyle?: TextStyle
  text: string
}

/**
 * Describe your component here
 */

export const ReadMoreText = ({ text, textStyle }: ReadMoreTextProps) => {
  const [showMoreButton, setShowMoreButton] = React.useState(false)
  const [textShown, setTextShown] = React.useState(false)
  const [numLines, setNumLines] = React.useState(undefined)

  const toggleTextShown = () => {
    setTextShown(!textShown)
  }

  React.useEffect(() => {
    setNumLines(textShown ? undefined : 5)
  }, [textShown])

  const onTextLayout = React.useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > 5 && !textShown) {
        setShowMoreButton(true)
        setNumLines(5)
      }
    },
    [textShown],
  )

  return (
    <>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={numLines}
        style={[textStyle, TEXT_STYLE]}
        ellipsizeMode="tail"
        onPress={() => numLines >= 5 && toggleTextShown()}
        selectable
      >
        {text}
      </Text>

      {!!showMoreButton && (
        <Text
          preset="fieldLabel"
          onPress={toggleTextShown}
          style={textShown ? { opacity: 0 } : readMoreStyle}
        >
          {textShown ? "عرض اقل" : "عرض المزيد"}
        </Text>
      )}
    </>
  )
}
