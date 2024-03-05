// Assuming you're using 'websocket' library, make sure to install it with `npm install websocket` if you haven't already

"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    if(!window.localStorage.getItem("user")){
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  },[])
}
