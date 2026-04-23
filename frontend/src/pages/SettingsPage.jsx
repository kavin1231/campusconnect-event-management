import Header from "../components/common/Header";
import { PlaceholderPage } from "./PlaceholderPage";
import { Icon } from "../components/common/Icon";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <PlaceholderPage
        title="Settings"
        icon={<Icon.Settings size={28} />}
        desc="Personal and application settings will appear here soon."
      />
    </>
  );
}
