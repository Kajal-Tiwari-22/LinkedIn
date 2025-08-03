import React from "react";
import Sidebar from "./Sidebar";
import { getAllPosts } from "@/lib/serveractions";

const SidebarWrapper = async ({ user }: { user: any }) => {
  const posts = await getAllPosts();
  
  return <Sidebar user={user} posts={posts} />;
};

export default SidebarWrapper;
