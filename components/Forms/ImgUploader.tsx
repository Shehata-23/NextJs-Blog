"use client";
import React, { useRef, useState } from "react";
import { uploadFile } from "@uploadcare/upload-client";

interface ImgUploaderProps {
  formData: { coverPhoto: string };
  setFormData: (data: { coverPhoto: string }) => void;
}

const ImgUploader = ({ formData, setFormData }: ImgUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const result = await uploadFile(file, {
          publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string, // change this
          store: "auto",
          metadata: {
            subsystem: "blog-cover-photo",
          },
        });
        if (result.cdnUrl) setFormData({ coverPhoto: result.cdnUrl });
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="coverPhoto"
      />
      <label
        htmlFor="coverPhoto"
        className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        {isUploading ? "Uploading..." : "Upload Cover Photo"}
      </label>
      {formData.coverPhoto && (
        <img
          src={formData.coverPhoto}
          alt="Cover Photo Preview"
          className="mt-4 max-w-xs rounded-lg shadow-md"
        />
      )}
    </div>
  );
};

export default ImgUploader;
