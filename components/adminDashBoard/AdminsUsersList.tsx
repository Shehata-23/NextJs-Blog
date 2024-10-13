"use client";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/lib/api/types";
import { toggleRole, deleteUserAction } from "@/app/actions/actions";
const AdminsUsersList = ({
  users,
  token,
}: {
  users: User[];
  token: string;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full mr-4 overflow-hidden w-[64px] h-[64px]">
                  <Image
                    src={user.profilePicUrl}
                    alt={user.username}
                    width={64}
                    height={64}
                    className="cursor-pointer object-cover transition-transform hover:scale-110 w-full h-full"
                  />
                </div>
                <div>
                  <Link
                    href={`/user/${user._id}`}
                    className="text-xl font-semibold hover:underline"
                  >
                    {user.username}
                  </Link>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="font-semibold">{user.likes.length}</p>
                  <p className="text-gray-600 text-sm">Likes</p>
                </div>
                <div>
                  <p className="font-semibold">{user.followers.length}</p>
                  <p className="text-gray-600 text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-semibold">{user.following.length}</p>
                  <p className="text-gray-600 text-sm">Following</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Admin Status
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.isAdmin}
                    onChange={async () =>
                      await toggleRole(user, token, "/Dashboard/Admin")
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between">
                <button
                  onClick={async () =>
                    await deleteUserAction(user._id, token, "/Dashboard/Admin")
                  }
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        </div>
      ))}
    </div>
  );
};

export default AdminsUsersList;
