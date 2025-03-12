import { db } from "./firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ProjectData {
  title: string;
  description: string;
  projectLink: string;
  image: string;
  userId: string;
}

export default async function addProject({ title, description, projectLink, image, userId }: ProjectData) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      title,
      description,
      projectLink,
      image,
      autorId: userId,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error al agregar proyecto:", error);
    return { success: false, error };
  }
}
