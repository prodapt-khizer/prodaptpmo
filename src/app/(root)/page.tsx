"use client"
import Sidebar from "@/app/(components)/Sidebar";
import axios from "axios";
import { useEffect } from "react";
// const getMessages = async () =>{
//   try {
//     const res = await fetch("/api/messages");
    
//     return res.json();
//   } catch (error) {
//     console.log("Error while fetching", error)
//   }
//  }
export default function Home() {
  // const {messages} = await getMessages();
  return (
    <main>
      {/* <Sidebar messages={messages[0]} /> */}
      <Sidebar />
    </main>
  )
}
