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

const fiqehResearch: TextStyle = {
  color: palette.white,
  fontSize: 16,
  backgroundColor: palette.defaultLight,
  width: "100%",
  textAlign: "center",
  padding: spacing[2],
}

export interface ReadMoreTextProps {
  /**
   * An optional style override useful for padding & margin.
   */
  textStyle?: TextStyle
  style?: ViewStyle,
  text: string
  nid?: string
  attachments: any[]
}

/**
 * Describe your component here
 */

const AlwaysVisibleNodes = ["NODE_030", "NODE_000", "NODE_014", "NODE_041", "NODE_040"]

export const ReadMoreText = ({ text, textStyle, attachments }: ReadMoreTextProps) => {
  const [showMoreButton, setShowMoreButton] = React.useState(false)
  const [textShown, setTextShown] = React.useState(false)

  const toggleTextShown = () => {
    setTextShown(!textShown)
    setShowMoreButton(!showMoreButton)
  }

  React.useEffect(() => {
    if (attachments[0] && AlwaysVisibleNodes.includes(attachments[0].title)) {
      console.log("[ReadMoreText] AlwaysVisibleNodes", attachments[0].title)
      return
    }
    const txtLines = text.split("\n")
    if (txtLines.length > 1 && text.split("\n")[0].length > 0) {
      setShowMoreButton(true)
    }
  }, [text])

  const firstLine = text.split("\n")[0]
  const lineCount = text.split("\n").length
  console.log("[linecount]", lineCount)
  return (
    <>
      <Text style={[textStyle, TEXT_STYLE]} ellipsizeMode="tail" selectable>
        {showMoreButton ? firstLine : text}
      </Text>

      {!!showMoreButton && (
        <Text
          preset="fieldLabel"
          onPress={toggleTextShown}
          style={lineCount < 4 ? readMoreStyle : fiqehResearch}
        >
          {lineCount < 4 ? "عرض المزيد" : "مباحث الفقه"}
        </Text>
      )}
    </>
  )
}
