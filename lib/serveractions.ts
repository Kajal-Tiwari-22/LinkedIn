"use server"

import { Post } from "@/models/post.model";
import { IUser, User } from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server"
import { v2 as cloudinary } from 'cloudinary';
import connectDB from "./db";
import { revalidatePath } from "next/cache";
import { Comment } from "@/models/comment.model";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// creating post using server actions
export const createPostAction = async (inputText: string, selectedFile: string) => {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error('User not athenticated');
    if (!inputText) throw new Error('Input field is required');

    const image = selectedFile;


    const userDatabase: IUser = {
        firstName: user.firstName || "Patel",
        lastName: user.lastName || "Mern Stack",
        userId: user.id,
        profilePhoto: user.imageUrl
    }
    let uploadResponse;
    try {
        if (image) {
            //1. create post with image
            uploadResponse = await cloudinary.uploader.upload(image);
            await Post.create({
                description: inputText,
                user: userDatabase,
                imageUrl: uploadResponse?.secure_url // yha pr image url ayega from cloudinary
            })
        } else {
            //2. create post with text only
            await Post.create({
                description: inputText,
                user: userDatabase
            })
        }
        revalidatePath("/");
    } catch (error: any) {
        throw new Error(error);
    }
}
// get all post using server actions
export const getAllPosts = async () => {
    try {
        await connectDB();
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'comments', options: { sort: { createdAt: -1 } } });
        if(!posts) return [];
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.log(error);
    }
}

// delete post by id
export const deletePostAction = async (postId: string) => {
    await connectDB();
    const user = await currentUser();
    if (!user) throw new Error('User not authenticated.');
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found.');

    // keval apni hi post delete kr payega.
    if (post.user.userId !== user.id) {
        throw new Error('You are not an owner of this Post.');
    }
    try {
        await Post.deleteOne({ _id: postId });
        revalidatePath("/");
    } catch (error: any) {
        throw new Error('An error occurred', error);
    }
}

export const createCommentAction = async (postId: string, formData: FormData) => {
    try {
        const user = await currentUser();
        if (!user) throw new Error("User not authenticated");
        const inputText = formData.get('inputText') as string;
        if (!inputText) throw new Error("Field is required");
        if (!postId) throw new Error("Post id required");

        const userDatabase: IUser = {
            firstName: user.firstName || "Patel",
            lastName: user.lastName || "Mern Stack",
            userId: user.id,
            profilePhoto: user.imageUrl
        }
        const post = await Post.findById({ _id: postId });
        if (!post) throw new Error('Post not found');

        const comment = await Comment.create({
            textMessage: inputText,
            user: userDatabase,
        });

        post.comments?.push(comment._id);
        await post.save();

        revalidatePath("/");
    } catch (error) {
        throw new Error('An error occurred')
    }
}

// update user bio
export const updateUserBioAction = async (bio: string) => {
    "use server";
    
    try {
        await connectDB();
        const user = await currentUser();
        if (!user) throw new Error("User not authenticated");
        
        // Find existing user or create new one
        let existingUser = await User.findOne({ userId: user.id });
        
        if (existingUser) {
            // Update existing user
            existingUser.bio = bio;
            existingUser.email = user.emailAddresses?.[0]?.emailAddress || existingUser.email || "";
            await existingUser.save();
        } else {
            // Create new user
            const userDatabase: IUser = {
                firstName: user.firstName || "First",
                lastName: user.lastName || "Last",
                userId: user.id,
                profilePhoto: user.imageUrl,
                bio: bio,
                email: user.emailAddresses?.[0]?.emailAddress || ""
            }
            
            await User.create(userDatabase);
        }
        
        revalidatePath("/");
    } catch (error) {
        throw new Error('An error occurred while updating bio')
    }
}

// update user profile
export const updateUserProfileAction = async (profileData: any) => {
    "use server";
    
    try {
        await connectDB();
        const user = await currentUser();
        if (!user) throw new Error("User not authenticated");
        
        // Find existing user or create new one
        let existingUser = await User.findOne({ userId: user.id });
        
        if (existingUser) {
            // Update existing user
            existingUser.firstName = profileData.firstName;
            existingUser.lastName = profileData.lastName;
            existingUser.bio = profileData.bio;
            existingUser.location = profileData.location;
            existingUser.contactInfo = profileData.contactInfo;
            existingUser.jobTitle = profileData.jobTitle;
            existingUser.skills = profileData.skills;
            existingUser.education = profileData.education;
            existingUser.workHistory = profileData.workHistory;
            existingUser.portfolioLink = profileData.portfolioLink;
            existingUser.websiteLink = profileData.websiteLink;
            existingUser.socialMediaLinks = profileData.socialMediaLinks;
            
            // Update profile photo if provided
            if (profileData.profilePhoto) {
                // If it's a data URL (base64), upload to Cloudinary
                if (profileData.profilePhoto.startsWith('data:image')) {
                    const uploadResponse = await cloudinary.uploader.upload(profileData.profilePhoto);
                    existingUser.profilePhoto = uploadResponse.secure_url;
                } else {
                    // If it's already a URL, just use it
                    existingUser.profilePhoto = profileData.profilePhoto;
                }
            }
            
            existingUser.email = user.emailAddresses?.[0]?.emailAddress || existingUser.email || "";
            
            await existingUser.save();
        } else {
            // Create new user
            let profilePhotoUrl = user.imageUrl;
            
            // If profile photo is provided and it's a data URL, upload to Cloudinary
            if (profileData.profilePhoto && profileData.profilePhoto.startsWith('data:image')) {
                const uploadResponse = await cloudinary.uploader.upload(profileData.profilePhoto);
                profilePhotoUrl = uploadResponse.secure_url;
            } else if (profileData.profilePhoto) {
                // If it's already a URL, just use it
                profilePhotoUrl = profileData.profilePhoto;
            }
            
            const userDatabase: IUser = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                userId: user.id,
                profilePhoto: profilePhotoUrl,
                bio: profileData.bio,
                email: user.emailAddresses?.[0]?.emailAddress || "",
                location: profileData.location,
                contactInfo: profileData.contactInfo,
                jobTitle: profileData.jobTitle,
                skills: profileData.skills,
                education: profileData.education,
                workHistory: profileData.workHistory,
                portfolioLink: profileData.portfolioLink,
                websiteLink: profileData.websiteLink,
                socialMediaLinks: profileData.socialMediaLinks
            }
            
            await User.create(userDatabase);
        }
        
        revalidatePath("/");
    } catch (error) {
        throw new Error('An error occurred while updating profile')
    }
}

// Helper function to convert file to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}
