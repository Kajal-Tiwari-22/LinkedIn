# Linkedin Clone

This repository hosts the source code for a LinkedIn clone built with Next.js, TypeScript, MongoDB, and Tailwind CSS. The application replicates core LinkedIn functionalities, providing a platform for users to interact with posts and manage their accounts.

## Demo

- Live Preview: 

## Features

- User Authentication with Clerk (Google, GitHub, email/password)
- Create and Delete Posts
- Like and Comment on Posts
- View Posts (non-logged-in users)
- Responsive Design
- Cloudinary Integration for Media Management

## Run Locally

Clone the project

```bash
https://github.com/Kajal-Tiwari-22/LinkedIn.git
```
Go to the project directory

```bash
    cd Linkedin-Clone
```
Install dependencies

```bash
    npm install
```

Setup Environment Vaiables

```Make .env file in "root" folder and store environment Variables
  MONGO_URI=YOUR-MONGO_URL
  CLOUD_NAME = YOUR-CLOUDINARY-NAME
  API_KEY = YOUR-CLOUDINARY-API-KEY
  API_SECRET = YOUR-CLOUDINARY-API-SECRET
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = YOUR-CLERK-PUBLISHABLE-KEY
  CLERK_SECRET_KEY = YOUR-CLERK-SECRET-KEY
 ```

Start the server

```bash
    npm run dev
```

## Tech Stack
* [Nextjs](https://nextjs.org/)
* [Mongodb](https://www.mongodb.com/)
* [Cloudinary](https://cloudinary.com/)
* [Clerk](https://clerk.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Tailwind](https://tailwindcss.com/)
* [Shadcn Ui](https://ui.shadcn.com/)

## Deployment

The application is deployed on Vercel.
