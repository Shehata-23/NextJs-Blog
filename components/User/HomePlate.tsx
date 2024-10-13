"use client";

import { User } from "@/app/lib/api/types";
import React from "react";
import Image from "next/image";
import UserListDisplay from "@/components/adminDashBoard/UserListDisplay";

const HomePlate = ({ userData }: { userData: User }) => {
  return (
    <div className="relative overflow-hidden rounded-xl p-6 shadow-xl w-full h-full bg-white">
      <div className="flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start">
        <div className="h-28 w-28 rounded-full bg-cyan-100 overflow-hidden shadow-md">
          <Image
            src={userData.profilePicUrl}
            alt="User profile"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col w-fit justify-start items-start md:ms-5 mt-4 md:mt-0">
          <p className="text-3xl font-bold mb-2 mx-auto md:mx-0 text-cyan-800">
            {userData ? userData.username : "Guest"}
          </p>
          <div className="flex justify-between items-center text-cyan-600 gap-x-2">
            <div className="flex justify-between items-center text-cyan-600 gap-x-2">
              <div>
                <UserListDisplay
                  usersList={userData.followers as User[]}
                  title={"Followed by"}
                  relation={"Follower"}
                />
              </div>
              <div>
                <UserListDisplay
                  usersList={userData.following as User[]}
                  title={"Following"}
                  relation={"Following"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePlate;
