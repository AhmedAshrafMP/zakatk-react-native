import { observer } from "mobx-react-lite"
import * as React from "react"
import { Image, View, ViewStyle, ActivityIndicator } from "react-native"
import { Button, Text } from "../"

const LOADING_CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}
const SAP: ViewStyle = {
  height: 30,
}

export interface ConnectionErrorProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  tryToReconnect(force: boolean): void
  showReconnect?: boolean
}

/**
 * Describe your component here
 */
export const ConnectionError = observer(function ConnectionError(props: ConnectionErrorProps) {
  const { style, tryToReconnect, showReconnect } = props

  return (
    <View style={LOADING_CONTAINER}>
      <Image
        source={require("./Bitmap.png")}
        style={{ width: 130, height: 100 }}
        resizeMode="contain"
      />
      <View style={SAP} />
      <Text preset="header" text="انقطع الاتصال" />

      {showReconnect ? (
        <>
          <Text preset="fieldLabel" text="حدث خطأ اثناء محاوله الاتصال. برجاء اعادة المحاوله" />
          <View style={SAP} />
          <Button
            text="محاوله اعادة الاتصال"
            onPress={() => tryToReconnect && tryToReconnect(true)}
          />
        </>
      ) : (
        <>
          <Text preset="fieldLabel" text="جاري محاوله اعادة الاتصال" />
          <ActivityIndicator />
        </>
      )}
    </View>
  )
})
