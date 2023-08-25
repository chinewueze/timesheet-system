import React from "react";
import { Route, Routes} from 'react-router-dom';
import  {SignUp}  from "./components/SignUp";
import { SignIn } from "./components/Login";
import { Report } from "./components/Report";

export default function App() {
  
  return (
    <Routes>
       <Route path="/" element={<SignUp/>}/>
      <Route path="/login" element={<SignIn/>}/> 
      <Route path="/reports" element={<Report />}/> 
      
    </Routes>
  );
}


