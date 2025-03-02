import { auth } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export function checkUserSession(callback: (user: any) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
