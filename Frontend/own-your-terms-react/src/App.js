import "./App.css";
import ListView from "./components/ListView/ListView";
import ChatView from "./components/ChatView/ChatView";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FileUpload } from "./components/FileUpload/FileUpload";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/fupload" element={<FileUpload />} />
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/chat" element={<ChatView />} />
          <Route exact path="/mydocs" element={<ListView />} />
          <Route exact path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
