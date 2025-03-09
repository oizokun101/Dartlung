import { PausePlay } from ".";

export default {
  title: "Components/PausePlay",
  component: PausePlay,

  argTypes: {
    property1: {
      options: ["pause-button", "play-button"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    property1: "pause-button",
    className: {},
  },
};
