Here is the updated README with the repo name changed to "NextJs-Blog":

# NextJs-Blog: Modern Blogging Platform

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)

NextJs-Blog is a feature-rich, modern blogging platform built with cutting-edge technologies. It offers a seamless user experience for both readers and content creators, with robust authentication, real-time interactions, and an intuitive interface.

## Features

- User Authentication: Secure login/signup system using NextAuth.js
- Advanced Authorization: Admin dashboard with enhanced content management capabilities
- Password Management: Forget and reset password functionality
- Rich Text Editing: Quill rich text editor for content creation
- Media Integration: Uploadcare for blog cover photo uploads
- Interactive Comments: Nested comment system
- Social Features: Follow/unfollow users to curate feed
- Content Discovery: Browse blogs by tags and use AI-powered tag suggestions
- Infinite Scrolling: Content loading with react-intersection-observer
- Responsive Design: Fully responsive layout using Tailwind CSS
- Animations: UI transitions powered by Framer Motion

## Technologies

- Next.js: React framework for production
- TypeScript: Static typing for JavaScript
- Tailwind CSS: Utility-first CSS framework
- NextAuth.js: Authentication for Next.js
- Zod: TypeScript-first schema validation
- React Hook Form: Performant, flexible forms
- Lucide React: Icon set
- Framer Motion: Animation library for React
- Uploadcare: File uploading and processing
- Quill: Rich text editor
- react-intersection-observer: React implementation of the Intersection Observer API

## Installation

1. Clone the repository:
   
   ```bash
   git clone https://github.com/shehata-23/NextJs-Blog.git
   ```

2. Navigate to the project directory:
   
   ```bash
   cd NextJs-Blog
   ```

3. Install dependencies:
   
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following environment variables:

   ```bash
   ENVIRONMENT=development
   PORT=3000
   DATABASE_URI=mongodb://localhost:27017/blog
   NEXTAUTH_SECRET=your_nextauth_secret_here
   UPLOADCARE_SECRET=your_uploadcare_secret_here
   NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key_here
   ```

   Replace the placeholder values with your actual configuration:
   - `ENVIRONMENT`: Set to development for local development, production for production deployment
   - `PORT`: The port your application will run on (default is 3000)
   - `DATABASE_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth.js (you can generate one using `openssl rand -base64 32`)
   - `UPLOADCARE_SECRET`: Your Uploadcare secret key
   - `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY`: Your Uploadcare public key

5. Run the development server:
   
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

#Here's the section to mention the API you're working with:

---

## API Routes

This application interacts with the [BlogsHub-API](https://github.com/JooZef315/BlogsHub-API?tab=readme-ov-file#authentication) for various functionalities such as authentication, user management, blog operations, and comments:

- **Authentication**: `/api/v1/auth/*` for login, logout, and token refresh
- **User Management**: `/api/v1/users/*` for user CRUD operations and follow/unfollow
- **Blog Operations**: `/api/v1/blogs/*` for blog CRUD, likes, and comments
- **Comments**: Nested within blog routes for comment management

For detailed API documentation, please refer to the [BlogsHub-API Documentation](https://github.com/JooZef315/BlogsHub-API?tab=readme-ov-file#authentication).


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



