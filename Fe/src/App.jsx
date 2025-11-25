import { useState } from "react";
import CoachManagement from "./components/CoachManagement";
import MemberManagement from "./components/MemberManagement";

function App() {
  const [activePage, setActivePage] = useState("coach");

  const handleSelectMenu = (menuKey) => {
    setActivePage(menuKey);
  };

  return activePage === "coach" ? (
    <CoachManagement onSelectMenu={handleSelectMenu} />
  ) : (
    <MemberManagement onSelectMenu={handleSelectMenu} />
  );
}

export default App;
