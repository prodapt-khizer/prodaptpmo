// Assuming you're using 'websocket' library, make sure to install it with `npm install websocket` if you haven't already

"use client";
import Sidebar from "@/app/(components)/Sidebar";
import Login from "@/app/(components)/Login";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const router = useRouter();
  useEffect(()=>{
    if(!window.localStorage.getItem("user")){
      router.push('/login');
    }
  },[])
  return (
    <main>
      <Sidebar />
    </main>
  );
}
