"use client";
import React, { useState } from "react";
import {
  Reply,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Edit2,
  MessageCircleX,
} from "lucide-react";
import CommentsBar from "../Forms/CommentsForm";
import { Comment, ReplyType } from "@/app/lib/api/types";
import { formatDistanceToNow } from "date-fns";
import { deleteCommentAction } from "@/app/actions/actions";
import Link from "next/link";

const CommentComponent: React.FC<{
  comment: Comment | ReplyType;
  depth: number;
  userId: string;
  token: string;
  blogId: string;
  sessionId: string;
}> = ({ comment, depth, userId, token, blogId, sessionId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdateForm, setshowUpdateForm] = useState(false);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  function getRepliesCount(comment: Comment): number {
    let count: number = comment.replies.length;
    comment.replies.forEach((reply: ReplyType) => {
      count += getRepliesCount(reply);
    });
    return count;
  }

  const maxDepth = 3;

  return (
    <div
      className={`my-2 relative ${
        depth > 0 ? "border-l-2 border-gray-200 pl-2 sm:pl-4" : ""
      }`}
    >
      <div className="p-3 bg-white rounded-lg transition-shadow hover:shadow-md">
        <div className="flex items-start space-x-3">
          <Link href={`/user/${comment.userId._id}`}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md flex-shrink-0 overflow-hidden">
              <img
                src={comment.userId.profilePicUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <Link href={`/user/${comment.userId._id}`}>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {comment.userId.username}
                  </p>
                  <span className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>

              <div className="relative">
                {comment.userId._id === sessionId && (
                  <MoreVertical
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={toggleOptions}
                  />
                )}
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setshowUpdateForm(!showUpdateForm);
                          toggleOptions();
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Update
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        onClick={async () => {
                          await deleteCommentAction(blogId, comment._id, token);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!showUpdateForm && (
              <p className="text-gray-600 mt-1 text-sm leading-relaxed break-words">
                {comment.body}
              </p>
            )}
            {showUpdateForm && (
              <div className="text-gray-600 mt-1 text-sm leading-relaxed break-words">
                <button
                  className="px-2 ml-4 py-1 bg-red-400 text-white text-xsm rounded-md hover:bg-red-500 flex justify-center items-center"
                  onClick={() => setshowUpdateForm((prev) => !prev)}
                >
                  Cancel <MessageCircleX className="ml-1" size="18" />
                </button>
                <CommentsBar
                  userId={userId}
                  blogId={blogId}
                  token={token}
                  commentId={comment._id}
                  defaultValue={comment.body}
                  setUpdateForm={setshowUpdateForm}
                />
              </div>
            )}
            <div className="flex items-center mt-2 space-x-4 text-xs">
              <button
                onClick={toggleReplyForm}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Reply size={12} className="mr-1" />
                Reply
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <ThumbsUp size={12} className="mr-1" />
                Like
              </button>
            </div>
            {showReplyForm && (
              <div className="mt-2 w-full">
                <CommentsBar
                  userId={userId}
                  blogId={blogId}
                  token={token}
                  parentId={comment._id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {"replies" in comment && comment.replies.length > 0 && (
        <div className="mt-2">
          <button
            onClick={toggleReplies}
            className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-2"
          >
            {showReplies ? (
              <ChevronUp size={12} className="mr-1" />
            ) : (
              <ChevronDown size={12} className="mr-1" />
            )}
            {showReplies ? "Hide" : "Show"} {getRepliesCount(comment)}{" "}
            {getRepliesCount(comment) === 1 ? "reply" : "replies"}
          </button>
          {showReplies && (
            <div className={depth >= maxDepth ? "pl-2" : ""}>
              {comment.replies.map((reply) => (
                <CommentComponent
                  key={reply._id}
                  comment={reply}
                  depth={depth + 1}
                  userId={userId}
                  token={token}
                  blogId={blogId}
                  sessionId={sessionId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NestedComments: React.FC<{
  comments: Comment[];
  userId: string;
  blogId: string;
  token: string;
  sessionId: string;
}> = ({ comments, userId, blogId, token, sessionId }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
        <MessageCircle className="mr-2" />
        Comments ({comments.length})
      </h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent
            key={comment._id}
            comment={comment}
            depth={0}
            userId={userId}
            token={token}
            blogId={blogId}
            sessionId={sessionId}
          />
        ))}
      </div>
    </div>
  );
};

export default NestedComments;
