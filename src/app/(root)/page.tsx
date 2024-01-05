// Assuming you're using 'websocket' library, make sure to install it with `npm install websocket` if you haven't already

"use client";
import Sidebar from "@/app/(components)/Sidebar";
import Login from "@/app/(components)/Login"
import axios from "axios";
import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from 'websocket';


export default function Home() {
  

  return (
    <main>
      <Sidebar />
      {/* <Login/> */}

    </main>
  );
}
