import { create } from "zustand";
import { type CoatId, writeStoredCoat } from "@/lib/cats";

export type NewtonPhase = "ignorant" | "falling" | "bonk" | "awake";

const HINT: Record<NewtonPhase, string> = {
  ignorant: "He has not discovered gravity",
  falling: "Something is falling",
  bonk: "He discovered gravity",
  awake: "Tap to leap",
};

type NewtonState = {
  phase: NewtonPhase;
  hint: string;
  caught: number;
  reduced: boolean;
  coat: CoatId;
  setPhase: (phase: NewtonPhase) => void;
  addCatch: () => void;
  setCoat: (coat: CoatId) => void;
  reset: (reduced: boolean) => void;
};

export const useNewton = create<NewtonState>((set) => ({
  phase: "ignorant",
  hint: HINT.ignorant,
  caught: 0,
  reduced: false,
  coat: "red",
  setPhase: (phase) => set({ phase, hint: HINT[phase] }),
  addCatch: () => set((s) => ({ caught: s.caught + 1 })),
  setCoat: (coat) => {
    writeStoredCoat(coat);
    set({ coat });
  },
  reset: (reduced) =>
    set({
      reduced,
      phase: reduced ? "awake" : "ignorant",
      hint: reduced ? HINT.awake : HINT.ignorant,
      caught: 0,
    }),
}));

const taps = new Set<() => void>();

export function onOrchardTap(fn: () => void) {
  taps.add(fn);
  return () => {
    taps.delete(fn);
  };
}

export function requestOrchardTap() {
  taps.forEach((fn) => fn());
}
