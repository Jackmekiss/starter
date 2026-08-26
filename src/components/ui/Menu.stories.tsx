import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/Button";
import {
  Menu,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/Menu";
import {
  MenuCreditCardIcon,
  MenuHelpIcon,
  MenuInfoIcon,
  MenuPathIcon,
} from "@/components/ui/MenuIcons";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";
import type { ComponentProps } from "react";

/** Props exposed by the Menu story playground. */
type MenuProps = ComponentProps<typeof Menu>;

/** Extra controls used by the Menu story playground. */
interface MenuStoryArgs extends MenuProps {
  disabled: boolean;
}

const sizes = ["sm", "md"] as const;

const meta = {
  title: "UI/Menu",
  component: Menu,
  args: {
    disabled: false,
    offset: 8,
    placement: "bottom left",
    size: "sm",
    trigger: renderMenuTrigger,
    useRNModal: true,
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right", "bottom left"],
    },
    size: { control: "select", options: sizes },
  },
  render: MenuPlayground,
} satisfies Meta<MenuStoryArgs>;

export default meta;

/** Story object inferred from the Menu metadata. */
type Story = StoryObj<typeof meta>;

/** Controllable Menu example. */
export const Playground: Story = {};

/** Menu opened by default to showcase icons, a separator, and item states. */
export const WithIcons: Story = {
  args: {
    defaultIsOpen: true,
    disabled: true,
  },
};

/** Both Figma menu sizes. */
export const Sizes: Story = {
  render: MenuSizesStory,
};

/** Renders one controllable Menu. */
function MenuPlayground({ disabled, ...props }: MenuStoryArgs) {
  return (
    <StoryFrame>
      <Menu {...props} disabledKeys={disabled ? ["plugins"] : undefined}>
        <MenuItem key="account" textValue="Add account">
          <MenuItemIcon as={MenuCreditCardIcon} />
          <MenuItemLabel>Add account</MenuItemLabel>
        </MenuItem>
        <MenuItem key="help" textValue="Help">
          <MenuItemIcon as={MenuHelpIcon} />
          <MenuItemLabel>Help</MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem key="plugins" textValue="Plugins">
          <MenuItemIcon as={MenuInfoIcon} />
          <MenuItemLabel>Plugins</MenuItemLabel>
        </MenuItem>
        <MenuItem key="settings" textValue="Settings">
          <MenuItemIcon as={MenuPathIcon} />
          <MenuItemLabel>Settings</MenuItemLabel>
        </MenuItem>
      </Menu>
    </StoryFrame>
  );
}

/** Renders triggers for both supported menu sizes. */
function MenuSizesStory() {
  return (
    <StoryFrame>
      {sizes.map((size) => (
        <View className="items-center gap-3" key={size}>
          <Text className="text-typography-900" size="sm" weight="semibold">
            {size}
          </Text>
          <Menu size={size} trigger={renderMenuTrigger} useRNModal>
            <MenuItem key={`${size}-account`} textValue="Add account">
              <MenuItemIcon as={MenuCreditCardIcon} />
              <MenuItemLabel>Add account</MenuItemLabel>
            </MenuItem>
            <MenuItem key={`${size}-help`} textValue="Help">
              <MenuItemIcon as={MenuHelpIcon} />
              <MenuItemLabel>Help</MenuItemLabel>
            </MenuItem>
          </Menu>
        </View>
      ))}
    </StoryFrame>
  );
}

/** Renders the button used to open a story menu. */
function renderMenuTrigger(triggerProps: ComponentProps<typeof Button>) {
  return (
    <Button {...triggerProps} size="sm" variant="outline">
      <ButtonText>Open menu</ButtonText>
    </Button>
  );
}

/** Provides a consistent surface and spacing for Menu stories. */
function StoryFrame({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-background-50 min-h-96 w-full flex-row items-start justify-center gap-16 p-8">
      {children}
    </View>
  );
}
