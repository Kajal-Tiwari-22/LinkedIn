import React from "react";
import ProfileView from "@/components/ProfileView";
import { currentUser } from "@clerk/nextjs/server";
import { getAllPosts } from "@/lib/serveractions";
import { User } from "@/models/user.model";
import connectDB from "@/lib/db";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  await connectDB();
  
  // Get the user profile data
  const userProfile = await User.findOne({ userId: params.userId });
  
  // Get current logged in user
  const currentUserData = await currentUser();
  
  // Get posts by this user
  const userPosts = await getAllPosts();
  const filteredPosts = userPosts.filter((post: any) => post.user.userId === params.userId);
  
    // Create a serializable user object
    const serializableUser = userProfile ? {
      id: userProfile.userId,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      username: currentUserData?.username || `${userProfile.firstName} ${userProfile.lastName}` || userProfile.userId, // Use Clerk username if available, else fallback
      imageUrl: userProfile.profilePhoto || "/default-avatar.png",
      emailAddresses: [{ emailAddress: userProfile.email || "" }],
      bio: userProfile.bio,
      location: userProfile.location,
      contactInfo: userProfile.contactInfo,
      jobTitle: userProfile.jobTitle,
      skills: userProfile.skills,
      education: userProfile.education,
      workHistory: userProfile.workHistory,
      portfolioLink: userProfile.portfolioLink,
      websiteLink: userProfile.websiteLink,
      socialMediaLinks: userProfile.socialMediaLinks,
      followers: userProfile.followers,
      following: userProfile.following,
      joinedDate: userProfile.createdAt,
      lastActive: userProfile.updatedAt,
      achievements: userProfile.achievements,
      interests: userProfile.interests
    } : null;

  return (
    <div className="pt-20">
      <div className="max-w-6xl mx-auto">
        <ProfileView user={serializableUser} posts={filteredPosts} />
      </div>
    </div>
  );
};

export default ProfilePage;
