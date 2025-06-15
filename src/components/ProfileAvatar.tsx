
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";

const defaultAvatar =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=256&h=256&facepad=2"; // fallback demo image

export default function ProfileAvatar({
  src,
  onChange,
}: {
  src?: string;
  onChange: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | undefined>(src || "");
  const fileInput = useRef<HTMLInputElement>(null);

  function handleEditClick() {
    fileInput.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="relative w-24 h-24 mx-auto">
      <Avatar className="w-24 h-24 ring-2 ring-green-200 shadow">
        <AvatarImage src={preview || src || defaultAvatar} alt="Profile" />
        <AvatarFallback>👤</AvatarFallback>
      </Avatar>
      <button
        className="absolute bottom-1 right-1 bg-white/90 border rounded-full shadow p-1 hover:bg-green-100 transition"
        type="button"
        aria-label="Edit Profile Picture"
        onClick={handleEditClick}
      >
        <Edit className="w-5 h-5 text-green-700" />
      </button>
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
