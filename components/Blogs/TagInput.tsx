"use client";
import React, { useState } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagInput = ({ tags, setTags }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === " " || e.key === "Enter" || e.key === ",") &&
      inputValue.trim() !== ""
    ) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log(tags);

  return (
    <div className="w-full">
      <div className="tag-list flex flex-wrap space-x-3">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="relative tag bg-slate-300 py-2 px-4 rounded-full shadow-lg transition-all duration-200 hover:-translate-y-1 my-2"
          >
            {tag}
            <span
              className="ps-1 text-sm text-red-500 hover:cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => handleRemoveTag(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleRemoveTag(index);
                }
              }}
            >
              ❌
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter tags and press space"
        className="border rounded-lg px-4 py-2 mb-4 w-full"
      />
    </div>
  );
};

export default TagInput;
