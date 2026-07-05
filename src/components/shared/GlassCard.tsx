/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", id }) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(148,163,184,0.18)] ${className}`}
    >
      {children}
    </div>
  );
};
