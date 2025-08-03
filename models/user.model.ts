import mongoose, { Document, Model } from "mongoose";

export interface IUser{
    firstName: string,
    lastName: string,
    userId: string,
    profilePhoto?: string,
    bio?: string,
    email?: string,
    location?: string,
    contactInfo?: string,
    jobTitle?: string,
    skills?: string[],
    education?: string[],
    workHistory?: string[],
    portfolioLink?: string,
    websiteLink?: string,
    socialMediaLinks?: {
        twitter?: string,
        linkedin?: string,
        github?: string,
    },
    followers?: string[], // Array of user IDs
    following?: string[], // Array of user IDs
    joinedDate?: Date,
    lastActive?: Date,
    achievements?: string[],
    interests?: string[]
}

export interface IUserDocument extends IUser, Document{
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUserDocument>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    contactInfo: {
        type: String,
        default: ""
    },
    jobTitle: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    education: {
        type: [String],
        default: []
    },
    workHistory: {
        type: [String],
        default: []
    },
    portfolioLink: {
        type: String,
        default: ""
    },
    websiteLink: {
        type: String,
        default: ""
    },
    socialMediaLinks: {
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" }
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    achievements: {
        type: [String],
        default: []
    },
    interests: {
        type: [String],
        default: []
    }
}, {timestamps: true});

export const User : Model<IUserDocument> = mongoose.models?.User || mongoose.model<IUserDocument>("User", userSchema);
