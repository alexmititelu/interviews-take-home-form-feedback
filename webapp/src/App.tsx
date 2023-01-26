import React from "react";
import FeedbackForm from "./screens/FeedbackForm";
import FeedbackResults from "./screens/FeedbackResults";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const FeedbackFormScreen = () => <FeedbackForm />;
const FeedbackResultsScreen = () => <FeedbackResults />;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/feedback" element={<FeedbackFormScreen />} />
          <Route path="/results" element={<FeedbackResultsScreen />} />
          <Route path="*" element={<Navigate to="/feedback" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
