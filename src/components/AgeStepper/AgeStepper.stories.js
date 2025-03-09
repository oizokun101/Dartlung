import { AgeStepper } from ".";

export default {
  title: "Components/AgeStepper",
  component: AgeStepper,

  argTypes: {
    property1: {
      options: ["two", "one", "three", "four"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    property1: "two",
    className: {},
  },
};
