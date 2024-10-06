// Fonction utilitaire pour récupérer un cookie spécifique côté client
export function getCookie(name: string): string | null {
  const cookieString = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  
  
  if (cookieString) {
    return cookieString.split('=')[1];
  }

  return null; // Renvoie null si le cookie n'est pas trouvé
}
