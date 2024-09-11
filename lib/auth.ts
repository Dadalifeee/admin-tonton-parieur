import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub]
});


export async function verifyCredentials(email: string, password: string) {
  // Remplace cette logique par ta propre méthode d'authentification
  const user = await getUserFromDatabase(email); // Une fonction qui récupère l'utilisateur de la base de données

  if (user && user.password === hashPassword(password)) {
    // Vérifie le mot de passe ici, par exemple en utilisant bcrypt
    return user;
  } else {
    return null;
  }
}

function getUserFromDatabase(email: string) {
  // Simule la récupération de l'utilisateur depuis la base de données
  return {
    email: 'test@example.com',
    password: 'hashedpassword123' // Remplace par un mot de passe hashé
  };
}

function hashPassword(password: string) {
  // Simule un hachage de mot de passe, utilise bcrypt ou une autre bibliothèque pour sécuriser
  return 'hashedpassword123'; // C'est juste un exemple, tu devrais utiliser bcrypt ou argon2 pour le vrai hash
}

