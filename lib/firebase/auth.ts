import { auth } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export function checkUserSession(callback: (user: unknown) => void) {
  return onAuthStateChanged(auth, (user: unknown) => {
    callback(user);
  });
}
