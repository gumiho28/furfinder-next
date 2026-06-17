"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdoptionModal({
  isOpen,
  onClose,
  petId,
  petName,
}: {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("You must be logged in to apply.");
      }

      const user_id = userData.user.id;
      let fileUrl = "";

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
      }

      // Insert application record
      const { error: insertError } = await supabase.from("applications").insert({
        pet_id: petId,
        user_id,
        pet_name: petName,
        status: "Pending",
        id_document_url: fileUrl,
      });

      if (insertError) throw insertError;

      setMessage("Application submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#383844] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-[#003366] dark:text-[#82b1ff] mb-4">
          Adopt {petName}
        </h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${message.includes("success") ? "bg-[#d4edda] text-[#155724]" : "bg-[#f8d7da] text-[#721c24]"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333] dark:text-[#f5f5f5] mb-1">
              Upload Valid ID / Barangay Certificate
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border border-[#e1e4e8] dark:border-[#555566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37] dark:bg-[#2c2c36] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#003366] dark:bg-[#82b1ff] rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
