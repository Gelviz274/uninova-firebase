import { db } from "@/lib/firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";

const UserProfile = async ({ params }: { params: { username: string } }) => {
  const username = params.username;
  console.log("Buscando usuario:", username); // 🛠️ Verifica qué valor llega

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return notFound(); // Si no hay coincidencias, muestra 404

    const userData = querySnapshot.docs[0].data();

    return (
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">{userData.name}</h1>
        <p className="text-gray-600">@{username}</p>
        <p className="mt-2">{userData.bio}</p>
      </div>
    );
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return notFound();
  }
};

export default UserProfile;
