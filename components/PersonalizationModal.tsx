"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import type { CustomFieldDef } from "../lib/types";

interface PersonalizationModalProps {
  productName: string;
  productImage?: string;
  fields: CustomFieldDef[];
  onClose: () => void;
  onConfirm: (answers: Record<string, string>) => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  productName, productImage, fields, onClose, onConfirm,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const handleConfirm = () => {
    for (const field of fields) {
      if (field.required && !answers[field.key]?.trim()) {
        setError(`"${field.label}" is required.`);
        return;
      }
    }
    onConfirm(answers);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-teal-deep/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          className="bg-white border border-teal-deep/10 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative z-10 text-left"
        >
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-teal-deep/5 text-teal-deep/50">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            {productImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={productImage} alt={productName} className="w-14 h-14 object-cover rounded-xl border border-teal-deep/10 flex-shrink-0" />
            )}
            <div>
              <span className="text-[11px] font-bold text-saffron uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Personalize</span>
              </span>
              <h3 className="font-heading text-base font-bold text-teal-deep leading-tight">{productName}</h3>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-[12px] font-bold text-teal-deep/60">
                  {field.label}{field.required && " *"}
                </label>
                {field.type === "dropdown" ? (
                  <select
                    value={answers[field.key] || ""}
                    onChange={(e) => setAnswers({ ...answers, [field.key]: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-xl px-3 py-2.5 text-xs text-teal-deep focus:outline-none focus:border-rani-pink/40"
                  >
                    <option value="">Select...</option>
                    {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[field.key] || ""}
                    onChange={(e) => setAnswers({ ...answers, [field.key]: e.target.value })}
                    className="w-full bg-background border border-teal-deep/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rani-pink/40"
                  />
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-[12px] text-rani-pink font-semibold">{error}</p>}

          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-teal-deep hover:bg-teal-deep/90 text-white rounded-xl font-bold text-sm shadow transition-all"
          >
            Add to Bag
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
