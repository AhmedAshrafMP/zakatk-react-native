import { observer } from "mobx-react-lite"
import moment from "moment"
import * as React from "react"
import { ViewStyle, View } from "react-native"
import DatePicker from "react-native-date-picker"

export interface RenderCalendarsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  onValueChange(value: string): void
}

const CALENDAR_HOLDER: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

/**
 * Describe your component here
 */
export const RenderCalendars = observer(function RenderCalendars(props: RenderCalendarsProps) {
  const { style, onValueChange } = props

  const [selectedDate, setselectedDate] = React.useState(new Date())

  return (
    <View style={CALENDAR_HOLDER}>
      <DatePicker
        mode="date"
        locale="ar"
        date={selectedDate}
        onDateChange={(d) => {
          onValueChange && onValueChange(moment(d).format("yyyy-MM-DD"))
          setselectedDate(d)
        }}
        maximumDate={new Date()}
      />
    </View>
  )
})
