import Feed from "@/components/Feed";
import News from "@/components/News";
import SidebarWrapper from "@/components/SidebarWrapper";
import { currentUser } from "@clerk/nextjs/server";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

 
export default async function Home() {
  const user = await currentUser();
   
  // Create a serializable user object
  const serializableUser = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses?.map((email: any) => ({
      emailAddress: email.emailAddress
    })) || []
  } : null;
   
  return (
     <div className="pt-20">
      <div className="max-w-6xl mx-auto flex justify-between gap-8">
          {/* Sidebar  */}
          <SidebarWrapper user = {serializableUser}/>
          {/* Feed  */}
          <Feed user={user}/>
          {/* News  */}
          <News/>
      </div>
      <ToastContainer />
     </div>
  );
}
