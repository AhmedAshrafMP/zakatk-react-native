import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { RenderQuickReplies } from "./render-quick-replies"

storiesOf("RenderQuickReplies", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <RenderQuickReplies style={{ backgroundColor: color.error }} />
      </UseCase>
    </Story>
  ))
