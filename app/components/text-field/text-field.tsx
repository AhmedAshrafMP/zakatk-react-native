import React from "react"
import { View, TextInput, TextStyle, ViewStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import { translate } from "../../i18n"
import { Text } from "../text/text"
import { TextFieldProps } from "./text-field.props"
import { mergeAll, flatten } from "ramda"
import CurrencyInput from "react-native-currency-input"

// the base styling for the container
const CONTAINER: ViewStyle = {
  paddingVertical: spacing[3],
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  minHeight: 44,
  fontSize: 18,
  textAlign: "right",
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}
const LABEL_STYLE: ViewStyle = { alignSelf: "flex-start" }
const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]))
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    placeholderTx,
    placeholder,
    labelTx,
    label,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    type,
    ...rest
  } = props

  const [value, setValue] = React.useState(null) // can also be null
  let containerStyle: ViewStyle = { ...CONTAINER, ...PRESETS[preset] }
  containerStyle = enhance(containerStyle, styleOverride)

  let inputStyle: TextStyle = INPUT
  inputStyle = enhance(inputStyle, inputStyleOverride)
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  const numberformat = (amount) =>
    Number(amount)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return (
    <View style={containerStyle}>
      <Text preset="fieldLabel" tx={labelTx} text={label} style={LABEL_STYLE} />
      {type === "MONEY" && (
        <CurrencyInput
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyle}
          ref={forwardedRef}
          value={value}
          onChangeValue={(v) => {
            if (v >= 0) {
              setValue(v)
              rest.onChangeText(`${v}`)
            } else {
              rest.onChangeText(null)
            }
          }}
          delimiter=","
          separator="."
          precision={0}
          onChangeText={(formattedValue) => {
            console.log(formattedValue)
          }}
        />
      )}

      {type === "NUMBER" && (
        <CurrencyInput
          keyboardType="numeric"
          keyboardAppearance="dark"
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyle}
          ref={forwardedRef}
          value={value}
          onChangeValue={(v) => {
            if (v >= 0) {
              setValue(v)
              rest.onChangeText(`${v}`)
            } else {
              rest.onChangeText(null)
            }
          }}
          precision={0}
          onChangeText={(formattedValue) => {
            console.log(formattedValue)
          }}
        />
      )}

      {type === "TEXT" && (
        <TextInput
          keyboardType="default"
          keyboardAppearance="dark"
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyle}
          ref={forwardedRef}
          onChangeText={(formattedValue) => {
            if (formattedValue.length > 0) {
              rest.onChangeText(formattedValue)
            } else {
              rest.onChangeText(null)
            }
          }}
        />
      )}
    </View>
  )
}
