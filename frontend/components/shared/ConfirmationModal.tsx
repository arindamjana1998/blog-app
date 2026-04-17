"use client";

import React from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "success";
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
    danger: "bg-red-600 hover:bg-red-700 shadow-red-600/20",
    success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
  };

  const iconStyles = {
    primary: "bg-blue-50 text-blue-600",
    danger: "bg-red-50 text-red-600",
    success: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 py-3 text-white rounded-xl font-bold transition-all flex items-center justify-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer",
              variantStyles[variant]
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
