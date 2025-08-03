"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import ProfilePhoto from "./shared/ProfilePhoto";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { updateUserBioAction } from "@/lib/serveractions";
import Link from "next/link";

const Sidebar = ({ user, posts }: { user: any; posts?: any[] }) => {
  console.log("Sidebar user prop:", user);
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserBioAction(bio);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  return (
    <div className="hidden md:block w-[20%] h-fit border border-gray-300 bg-white rounded-lg">
      <div className="flex relative flex-col items-center">
        <div className="w-full h-16 overflow-hidden">
          {user && (
            <Image
              src={"/banner.jpg"}
              alt="Banner"
              width={200}
              height={200}
              className="w-full h-full rounded-t"
            />
          )}
        </div>
        <div className="my-1 absolute top-10 left-[40%]">
          <ProfilePhoto src={user ? user?.imageUrl! : "/banner.jpg"} />
        </div>
        <div className="border-b border-b-gray-300">
          <div className="p-2 mt-5 text-center">
            {user ? (
              <Link href={`/profile/${user.id}`}>
                <h1 className="font-bold hover:underline cursor-pointer">
                  @{user.username}
                </h1>
              </Link>
            ) : (
              <h1 className="font-bold hover:underline cursor-pointer">
                Full name
              </h1>
            )}
            <p className="text-xs">@{user?.username || "username"}</p>
            {user?.emailAddresses?.[0]?.emailAddress && (
              <p className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
            )}
            {isEditing ? (
              <div className="mt-2">
                <Input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write your bio here..."
                  className="text-xs mb-2"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="text-xs">
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {bio && <p className="text-xs text-gray-500 mt-1">{bio}</p>}
                {user && (
                  <>
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-xs mt-2">
                      {bio ? "Edit Bio" : "Add Bio"}
                    </Button>
                    <a href={`/profile/${user.id}`} className="inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 mt-2 ml-2">
                      View User Profile
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-xs">
        <div className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 cursor-pointer">
          <p>Post Impression</p>
          <p className="text-blue-500 font-bold">88</p>
        </div>
        <div className="w-full flex justify-between items-center px-3 py-2 hover:bg-gray-200 cursor-pointer">
          <p>Posts</p>
          <p className="text-blue-500 font-bold">{posts?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
