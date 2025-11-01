import { Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { LandingPage, ConversationWorkspacePage } from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="c/:conversationIdOrSlug" element={<ConversationWorkspacePage />} />
      </Route>
    </Routes>
  );
}

export default App;
