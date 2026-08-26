import { CircleHelp, CreditCard, Info, Route } from "lucide-react-native";
import { useState, type Key } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  MenuTrigger,
  type MenuSize,
} from "@/components/ui/Menu";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

const sizes: MenuSize[] = ["sm", "md"];

const meta = {
  title: "UI/Menu",
  component: Menu,
  render: MenuStory,
} satisfies Meta<typeof Menu>;

export default meta;

/** Story object inferred from the Menu metadata. */
type Story = StoryObj<typeof meta>;

/** Interactive menu with icons, a separator, and a disabled action. */
export const Default: Story = {};

/** Both supported menu sizes. */
export const Sizes: Story = {
  render: MenuSizesStory,
};

/** Menu whose surface follows its trigger width and reports item actions. */
export const MatchTriggerWidth: Story = {
  render: MatchTriggerWidthStory,
};

/** Renders one representative menu. */
function MenuStory() {
  return <MenuExample disabled size="sm" />;
}

/** Renders one trigger for each supported size. */
function MenuSizesStory() {
  return (
    <View className="flex-row items-start gap-8">
      {sizes.map((size) => (
        <View className="items-center gap-3" key={size}>
          <Text size="sm" weight="semibold">
            {size}
          </Text>
          <MenuExample size={size} />
        </View>
      ))}
    </View>
  );
}

/** Demonstrates trigger-width matching and collection-key actions. */
function MatchTriggerWidthStory() {
  const [selectedKey, setSelectedKey] = useState<Key>();

  return (
    <View className="items-start gap-3">
      <Text size="sm">Last action: {selectedKey?.toString() ?? "None"}</Text>
      <MenuExample
        matchTriggerWidth
        onAction={setSelectedKey}
        size="sm"
        triggerClassName="w-64"
      />
    </View>
  );
}

/** Shared shadcn composition used by the Menu stories. */
function MenuExample({
  disabled = false,
  matchTriggerWidth = false,
  onAction,
  size,
  triggerClassName,
}: {
  disabled?: boolean;
  matchTriggerWidth?: boolean;
  onAction?: (key: Key) => void;
  size: MenuSize;
  triggerClassName?: string;
}) {
  return (
    <Menu matchTriggerWidth={matchTriggerWidth} onAction={onAction} size={size}>
      <MenuTrigger asChild>
        <Button className={triggerClassName} size="sm" variant="outline">
          <Text>Open menu</Text>
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem key="account" textValue="Add account">
          <MenuItemIcon as={CreditCard} />
          <MenuItemLabel>Add account</MenuItemLabel>
        </MenuItem>
        <MenuItem key="help" textValue="Help">
          <MenuItemIcon as={CircleHelp} />
          <MenuItemLabel>Help</MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem disabled={disabled} key="plugins" textValue="Plugins">
          <MenuItemIcon as={Info} />
          <MenuItemLabel>Plugins</MenuItemLabel>
        </MenuItem>
        <MenuItem key="routes" textValue="Routes">
          <MenuItemIcon as={Route} />
          <MenuItemLabel>Routes</MenuItemLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
