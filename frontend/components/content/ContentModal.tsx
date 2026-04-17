"use client";

import React, { useState, useEffect } from "react";
import { contentService } from "@/services/contentService";
import { Content } from "@/types";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  content: Content | null;
}

const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  content,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setDescription(content.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [content, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (content) {
        await contentService.updateContent(content._id, { title, description });
      } else {
        await contentService.createContent({ title, description });
      }
      toast.success(content ? "Content updated" : "Content created");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">
            {content ? "Edit Content" : "Create New Content"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              placeholder="Enter content title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              placeholder="Describe your content..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : content ? (
                "Update Content"
              ) : (
                "Create Content"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentModal;
