"use client";

import { useSyncExternalStore } from "react";
import { toDateInputValue } from "@/lib/dates";

// "Today" can't be read during render: these pages are statically prerendered,
// so the build date would be baked into the HTML and then disagree with the
// browser on hydration. useSyncExternalStore is the sanctioned way to hold a
// value that legitimately differs between server and client — it renders the
// server snapshot during hydration, then swaps in the client one.

/** The date never changes mid-session for our purposes, so there is nothing to
 *  subscribe to. */
const subscribe = () => () => {};

// Returns a fresh string each call, but useSyncExternalStore compares with
// Object.is and strings compare by value — so this stays stable all day.
const getSnapshot = () => toDateInputValue(new Date());

const getServerSnapshot = () => "";

/** Today as a `YYYY-MM-DD` value for `<input type="date">`. Empty string on the
 *  server and during hydration; the real date thereafter. */
export function useToday(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
