import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ListView from "./components/ListView/ListView";
import ChatView from "./components/ChatView/ChatView";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import { FileUpload } from "./components/FileUpload/FileUpload";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function Index() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/chat" element={<ChatView />} />
          <Route exact path="/mydocs" element={<ListView />} />
          <Route exact path="/mydocs/:docid" element={<ListView />} />
          <Route exact path="/fupload" element={<FileUpload />} />
          <Route exact path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
