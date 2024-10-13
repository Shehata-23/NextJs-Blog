"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePictureProps {
  profilePicUrl: string;
  username: string;
  sessionUserName: string;
}

export default function ProfilePicture({
  profilePicUrl,
  username,
  sessionUserName,
}: ProfilePictureProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={profilePicUrl}
        alt={username}
        className="w-20 h-20 rounded-full mr-4 object-cover border-2 border-indigo-300"
      />
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <p className="text-sm whitespace-nowrap">
              Hey {sessionUserName}! 👋
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
