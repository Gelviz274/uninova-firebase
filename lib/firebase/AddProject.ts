import { db } from "./firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function addProject({ title, description, projectLink, image, userId }) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      title,
      description,
      projectLink,
      image,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar el proyecto: ", error);
    throw error;
  }
}
