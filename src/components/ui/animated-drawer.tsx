"use client";

import { useState, useMemo } from "react";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  BannedIcon,
  DangerIcon,
  FaceIDIcon,
  LockIcon,
  PassIcon,
  PhraseIcon,
  RecoveryPhraseIcon,
  ShieldIcon,
  WarningIcon,
} from "@/components/ui/animated-drawer-utils/demo-icons";

export const AnimatedDrawer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState("default");
  const [elementRef, bounds] = useMeasure();

  const content = useMemo(() => {
    switch (view) {
      case "default":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-bold text-white">
                Terminal Security Settings
              </h2>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-gray-400" size={18} />
              </Button>
            </div>

            <div className="mt-4 flex flex-col items-start gap-3">
              <button
                onClick={() => setView("key")}
                className="bg-[#071522] hover:bg-[#0b1d2e] border border-tgb-navyborder text-white font-medium flex items-center gap-2.5 w-full rounded-2xl px-4 py-3.5 transition-colors text-xs"
              >
                <LockIcon />
                View Operator Private Key
              </button>
              <button
                onClick={() => setView("pharse")}
                className="bg-[#071522] hover:bg-[#0b1d2e] border border-tgb-navyborder text-white font-medium flex items-center gap-2.5 w-full rounded-2xl px-4 py-3.5 transition-colors text-xs"
              >
                <PassIcon />
                View Terminal Recovery Phrase
              </button>
              <button
                onClick={() => setView("remove")}
                className="bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-rose-400 font-medium flex items-center gap-2.5 w-full rounded-2xl px-4 py-3.5 transition-colors text-xs"
              >
                <WarningIcon />
                Deauthorize Terminal
              </button>
            </div>
          </div>
        );
      case "remove":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <DangerIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-gray-400" size={18} />
              </Button>
            </div>
            <h2 className="font-bold text-lg text-white">
              Deauthorize Terminal?
            </h2>

            <p className="text-gray-400 font-light text-xs leading-relaxed">
              This action requires supervisor authorization. Make sure you&apos;ve backed up your
              recovery credentials before proceeding.
            </p>
            <div className="flex items-center justify-start gap-3 pt-2">
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs transition-colors font-bold"
              >
                Deauthorize
              </Button>
            </div>
          </div>
        );
      case "pharse":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <RecoveryPhraseIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-gray-400" size={18} />
              </Button>
            </div>
            <h2 className="font-bold text-lg text-white">
              Terminal Recovery Phrase
            </h2>
            <p className="text-gray-400 font-light text-xs leading-relaxed">
              Your recovery phrase is the master authorization key for this POS terminal.
            </p>
            <div className="border-t border-tgb-navyborder space-y-3 text-gray-400 text-xs pt-3">
              <div className="flex items-center gap-3">
                <ShieldIcon />
                <span>Store it in a certified Texas Gold Buyers safe</span>
              </div>
              <div className="flex items-center gap-3">
                <PhraseIcon />
                <span>Never disclose to unauthorized personnel</span>
              </div>
              <div className="flex items-center gap-3">
                <BannedIcon />
                <span>Immutable cryptographic key</span>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 pt-2">
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs flex items-center justify-center gap-2 transition-colors font-bold"
              >
                <FaceIDIcon />
                Show Phrase
              </Button>
            </div>
          </div>
        );
      case "key":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <RecoveryPhraseIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-gray-400" size={18} />
              </Button>
            </div>
            <h2 className="font-bold text-lg text-white">
              Operator Private Key
            </h2>
            <p className="text-gray-400 font-light text-xs leading-relaxed">
              Your private key signs every bullion and jewelry intake record.
            </p>

            <div className="border-t border-tgb-navyborder space-y-3 text-gray-400 text-xs pt-3">
              <div className="flex items-center gap-3">
                <ShieldIcon />
                <span>Store in certified hardware security module</span>
              </div>
              <div className="flex items-center gap-3">
                <PhraseIcon />
                <span>DPS compliance auditable signature</span>
              </div>
              <div className="flex items-center gap-3">
                <BannedIcon />
                <span>Never export plaintext keys</span>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 pt-2">
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="flex-1 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs flex items-center justify-center gap-2 transition-colors font-bold"
              >
                <FaceIDIcon />
                Show Key
              </Button>
            </div>
          </div>
        );
    }
  }, [view]);

  return (
    <>
      <Button
        className="px-4 py-2 text-xs font-bold rounded-xl bg-tgb-navy hover:bg-tgb-navylight text-white border border-tgb-navyborder transition-all"
        onClick={() => setIsOpen(true)}
      >
        Security Drawer
      </Button>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <Drawer.Content
            asChild
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md overflow-hidden rounded-3xl bg-[#0a1827] border border-tgb-gold/40 text-white outline-none"
          >
            <motion.div animate={{ height: bounds.height }}>
              <div className="p-6" ref={elementRef}>
                {content}
              </div>
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

export default AnimatedDrawer;
