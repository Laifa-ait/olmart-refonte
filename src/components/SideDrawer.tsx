import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  icon: ReactNode;
  children: ReactNode;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, title, icon, children }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[240]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#fbf9fc] z-[250] shadow-2xl flex flex-col overscroll-contain border-l border-[#e8e1e9] pb-0"
            style={{ maxHeight: "100dvh", overflowY: "auto" }}
          >
            <div className="p-5 sm:p-6 border-b border-[#eee8ef] flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight rtl:tracking-normal text-[#302638]">
                {icon} {title}
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-[#f5f1f6] hover:bg-[#ece5ef] rounded-full text-[#6b5874] transition-colors cursor-pointer border-none"
                title={t("Fermer") || "Fermer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
