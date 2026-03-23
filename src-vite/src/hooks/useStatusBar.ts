import { useState } from "react";
import type { StatusBarItem } from "../components/statusbar";


export default function useStatusBar(limit: number = 5) {
  /*
    This hook manages a queue of status bar messages
    Must be used with the StatusBar component
  */
  const [statusBarQueue, setStatusBarQueue] = useState<StatusBarItem[]>([]);

  // Push new status
  // By default messages are limited to 5 items
  // Only first message is displayed and rest is shortened to icons only
  function pushToStatusBar(newStatus: Omit<StatusBarItem, "id">) {
    setStatusBarQueue((prev) => {
      const newItem = {
        ...newStatus,
        id: Date.now() + Math.random(),
      };
      return [newItem, ...prev].slice(0, limit);
    });
  }

  // Remove top item
  function popFromStatusBar() {
    setStatusBarQueue((prev) => prev.slice(1));
  }

  // Promote clicked item to top
  // When clicked on a message or icon, the message is moved to the top of the queue
  //   hence become the currently displayed message
  function promoteInStatusBar(id: number) {
    setStatusBarQueue((prev) => {
      const clicked = prev.find((item) => item.id === id);
      if (!clicked) return prev;
      const filtered = prev.filter((item) => item.id !== id);
      return [clicked, ...filtered];
    });
  }

  // Clears all messages in queue
  function clearStatusBar() {
    setStatusBarQueue([]);
  }

  return {
    statusBarQueue,
    pushToStatusBar,
    popFromStatusBar,
    promoteInStatusBar,
    clearStatusBar,
  };
}
