import { useState } from "react";
import InvoiceTabs from "./InvoiceTabs";

export default function Salesp() {
  const [tabs, setTabs] = useState([
    {
      id: "default",
      title: "Hóa đơn 1",
      closable: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("default");

  // ❌ KHÔNG cho xóa tab không closable
  const handleCloseTab = (tabId) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab?.closable) return;

    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleAddTab = () => {
    const newTab = {
      id: `hd-${Date.now()}`,
      title: `Hóa đơn ${tabs.length + 1}`,
      closable: true,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  return (
    <InvoiceTabs
      tabs={tabs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onCloseTab={handleCloseTab}
      onAddTab={handleAddTab}
    />
  );
}
