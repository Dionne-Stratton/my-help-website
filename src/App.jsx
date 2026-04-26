import { useState } from "react";
import CrisisHelpBadge from "./components/CrisisHelpBadge";
import HelpFlow from "./features/help/HelpFlow";

function App() {
  const [showCrisisHelpBadge, setShowCrisisHelpBadge] = useState(true);

  return (
    <>
      {showCrisisHelpBadge && (
        <CrisisHelpBadge onClose={() => setShowCrisisHelpBadge(false)} />
      )}

      <HelpFlow />
    </>
  );
}

export default App;
