"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  User, 
  Briefcase, 
  GraduationCap,
  Twitter,
  Linkedin,
  Github,
  Edit,
  Save,
  X,
  Camera
} from "lucide-react";
import { updateUserProfileAction, convertFileToBase64 } from "@/lib/serveractions";

interface ProfileViewProps {
  user: any;
  posts: any[];
}

const ProfileView = ({ user, posts }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    contactInfo: user?.contactInfo || "",
    jobTitle: user?.jobTitle || "",
    skills: user?.skills || [],
    education: user?.education || [],
    workHistory: user?.workHistory || [],
    portfolioLink: user?.portfolioLink || "",
    websiteLink: user?.websiteLink || "",
    socialMediaLinks: {
      twitter: user?.socialMediaLinks?.twitter || "",
      linkedin: user?.socialMediaLinks?.linkedin || "",
      github: user?.socialMediaLinks?.github || "",
    },
    profilePhoto: user?.imageUrl || "/default-avatar.png",
    newSkill: "",
    newEducation: "",
    newWorkHistory: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [newWorkHistory, setNewWorkHistory] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        contactInfo: user.contactInfo || "",
        jobTitle: user.jobTitle || "",
        skills: user.skills || [],
        education: user.education || [],
        workHistory: user.workHistory || [],
        portfolioLink: user.portfolioLink || "",
        websiteLink: user.websiteLink || "",
        profilePhoto: user.imageUrl || "/default-avatar.png",
        socialMediaLinks: {
          twitter: user.socialMediaLinks?.twitter || "",
          linkedin: user.socialMediaLinks?.linkedin || "",
          github: user.socialMediaLinks?.github || "",
        },
        newSkill: "",
        newEducation: "",
        newWorkHistory: ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUserProfileAction(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setPreviewImage(base64);
        setProfileData({ ...profileData, profilePhoto: base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = [...profileData.skills];
    newSkills.splice(index, 1);
    setProfileData({ ...profileData, skills: newSkills });
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setProfileData({
        ...profileData,
        education: [...profileData.education, newEducation.trim()]
      });
      setNewEducation("");
    }
  };

  const removeEducation = (index: number) => {
    const newEducationList = [...profileData.education];
    newEducationList.splice(index, 1);
    setProfileData({ ...profileData, education: newEducationList });
  };

  const addWorkHistory = () => {
    if (newWorkHistory.trim()) {
      setProfileData({
        ...profileData,
        workHistory: [...profileData.workHistory, newWorkHistory.trim()]
      });
      setNewWorkHistory("");
    }
  };

  const removeWorkHistory = (index: number) => {
    const newWorkHistoryList = [...profileData.workHistory];
    newWorkHistoryList.splice(index, 1);
    setProfileData({ ...profileData, workHistory: newWorkHistoryList });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Image
              src={previewImage || profileData.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full border-4 border-white bg-white"
            />
            {isEditing && (
              <div 
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100"
                onClick={handleImageClick}
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-600">@{user?.username || "username"}</p>
            {profileData.jobTitle && (
              <p className="text-gray-700 mt-1">{profileData.jobTitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} variant="default">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div>
            <span className="font-bold">Posts</span>
            <p>{posts?.length || 0}</p>
          </div>
          <div>
            <span className="font-bold">Followers</span>
            <p>{user?.followers?.length || 0}</p>
          </div>
          <div>
            <span className="font-bold">Following</span>
            <p>{user?.following?.length || 0}</p>
          </div>
          <div>
            <span className="font-bold">Joined</span>
            <p>{user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-6 space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={previewImage || profileData.profilePhoto || "/default-avatar.png"}
                    alt="Profile Preview"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-gray-300"
                  />
                </div>
                <Button type="button" onClick={handleImageClick} variant="outline" size="sm">
                  Change Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Location & Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                <Input
                  value={profileData.contactInfo}
                  onChange={(e) => setProfileData({ ...profileData, contactInfo: e.target.value })}
                  placeholder="Email or phone"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <Input
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                placeholder="Your current position"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button 
                      onClick={() => removeSkill(index)}
                      className="text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="sm">Add</Button>
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <div className="space-y-2 mb-2">
                {profileData.education.map((edu: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{edu}</span>
                    <button 
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education"
                  onKeyPress={(e) => e.key === 'Enter' && addEducation()}
                />
                <Button onClick={addEducation} size="sm">Add</Button>
              </div>
            </div>

            {/* Work History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work History</label>
              <div className="space-y-2 mb-2">
                {profileData.workHistory.map((work: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{work}</span>
                    <button 
                      onClick={() => removeWorkHistory(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newWorkHistory}
                  onChange={(e) => setNewWorkHistory(e.target.value)}
                  placeholder="Add work history"
                  onKeyPress={(e) => e.key === 'Enter' && addWorkHistory()}
                />
                <Button onClick={addWorkHistory} size="sm">Add</Button>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Link</label>
                <Input
                  value={profileData.portfolioLink}
                  onChange={(e) => setProfileData({ ...profileData, portfolioLink: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Input
                  value={profileData.websiteLink}
                  onChange={(e) => setProfileData({ ...profileData, websiteLink: e.target.value })}
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>

            {/* Social Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Social Media</label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <Input
                    value={profileData.socialMediaLinks.twitter}
                    onChange={(e) => setProfileData({ 
                      ...profileData, 
                      socialMediaLinks: { 
                        ...profileData.socialMediaLinks, 
                        twitter: e.target.value 
                      } 
                    })}
                    placeholder="Twitter handle"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <Input
                    value={profileData.socialMediaLinks.linkedin}
                    onChange={(e) => setProfileData({ 
                      ...profileData, 
                      socialMediaLinks: { 
                        ...profileData.socialMediaLinks, 
                        linkedin: e.target.value 
                      } 
                    })}
                    placeholder="LinkedIn profile"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <Input
                    value={profileData.socialMediaLinks.github}
                    onChange={(e) => setProfileData({ 
                      ...profileData, 
                      socialMediaLinks: { 
                        ...profileData.socialMediaLinks, 
                        github: e.target.value 
                      } 
                    })}
                    placeholder="GitHub profile"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Bio */}
            {profileData.bio && (
              <div>
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{profileData.bio}</p>
              </div>
            )}

            {/* Location & Contact */}
            <div className="flex flex-wrap gap-4">
              {profileData.location && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </div>
              )}
              {profileData.contactInfo && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.contactInfo}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {profileData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profileData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Education</h2>
                <ul className="space-y-1">
                  {profileData.education.map((edu: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Work History */}
            {profileData.workHistory.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Work History</h2>
                <ul className="space-y-1">
                  {profileData.workHistory.map((work: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {profileData.portfolioLink && (
                <a 
                  href={profileData.portfolioLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
              {profileData.websiteLink && (
                <a 
                  href={profileData.websiteLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              {profileData.socialMediaLinks.twitter && (
                <a 
                  href={`https://twitter.com/${profileData.socialMediaLinks.twitter}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
              {profileData.socialMediaLinks.linkedin && (
                <a 
                  href={profileData.socialMediaLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profileData.socialMediaLinks.github && (
                <a 
                  href={profileData.socialMediaLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
