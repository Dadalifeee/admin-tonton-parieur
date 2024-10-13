import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Composant réutilisable pour afficher un message de connexion
const LoginRequiredCard = () => {
  return (
    <div className="text-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Paris</CardTitle>
          <CardDescription>
            Vous devez être connecté pour parier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRequiredCard;
