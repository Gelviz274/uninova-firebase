export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  nombres: string;
  apellidos: string;
  universidad: string;
  carrera: string;
  semestre: string;
  descripcion: string;
  fotoportada: string;
  photoURL?: string;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isSuperUser: boolean;
  // Agrega aquí otros campos que necesites
}
