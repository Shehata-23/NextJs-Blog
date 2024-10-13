"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "@/app/lib/api/types";

const UserListDisplay = ({
  usersList,
  title,
  relation,
}: {
  usersList: User[];
  title: string;
  relation: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  console.log(usersList);

  return (
    <>
      <button
        className="font-medium   transition-colors duration-200 focus:outline-none focus:underline"
        onClick={() => setIsOpen(true)}
        aria-label={`View ${usersList.length} ${relation}`}
      >
        {usersList.length || 0}{" "}
        {usersList.length === 1 ? `${relation}` : `${relation}s`}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 w-screen h-screen text-black bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="max-h-60 overflow-y-auto mb-4">
              {usersList.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-4 mb-4"
                >
                  <div className="rounded-full w-[50px] h-[50px] overflow-hidden mr-4">
                    <Image
                      src={user.profilePicUrl}
                      alt={user.username}
                      width={50}
                      height={50}
                      className="cursor-pointer object-cover transition-transform hover:scale-110 w-full h-full"
                      onClick={() => {
                        router.push(`/user/${user._id}`);
                      }}
                    />
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
              ))}
            </div>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserListDisplay;
