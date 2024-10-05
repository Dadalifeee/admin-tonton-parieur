"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SquareChevronLeft, SquareChevronRight} from 'lucide-react';

interface Match {
  matchId: number;
  matchday: number;
  matchDate: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  homeTeamTrigram: string;
  homeTeamLogo: string; // Ajout du logo de l'équipe à domicile
  awayTeamName: string;
  awayTeamTrigram: string;
  awayTeamLogo: string; // Ajout du logo de l'équipe à l'extérieur
  oddsHomeTeam: string;
  oddsAwayTeam: string;
  oddsDraw: string;
}

export default function BetsPage() {
  const [matchday, setMatchday] = useState<number>(3);
  const [matchList, setMatchList] = useState<Match[]>([]);
  const [scores, setScores] = useState<
    Record<number, { home?: string; away?: string }>
  >({});

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`/api/matches/${matchday}`);
        if (!res.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data: Match[] = await res.json();
        setMatchList(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMatches();
  }, [matchday]);

  const handleScoreChange = (
    matchId: number,
    team: "home" | "away",
    score: string
  ) => {
    setScores({
      ...scores,
      [matchId]: {
        ...scores[matchId],
        [team]: score,
      },
    });
  };

  const handleBetSubmit = async () => {
    const bets = Object.entries(scores)
      .map(([matchId, scores]) => ({
        matchId: Number(matchId),
        userId: 1, // Remplace par l'ID de l'utilisateur connecté
        predictedScoreHome: scores.home,
        predictedScoreAway: scores.away,
        betPoints: 0,
        betResult: "pending",
        betDate: new Date(),
      }))
      .filter(
        (bet) =>
          bet.predictedScoreHome !== undefined &&
          bet.predictedScoreAway !== undefined
      );

    if (bets.length === 0) {
      alert("Veuillez entrer les scores pour au moins un match.");
      return;
    }

    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bets),
      });

      if (res.ok) {
        alert("Paris soumis avec succès !");
        setScores({}); // Réinitialiser les scores après soumission
      } else {
        alert("Échec de la soumission des paris.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la soumission des paris.");
    }
  };

  const handleMatchdayChange = (direction: "next" | "prev") => {
    setMatchday((prevMatchday) =>
      direction === "next" ? prevMatchday + 1 : prevMatchday - 1
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paris</CardTitle>
        <CardDescription>
          Saisissez vos scores pour le matchday {matchday}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-center">
          {matchday} {matchday === 1 ? "ère journée" : "ème journée"}
        </CardTitle>
        <div className="flex justify-center p-4">
          <div className=" max-w-4xl">
            {matchList.map((match) => (
              <div
                key={match.matchId}
                className="hover:bg-gray-100 p-4 border-b flex items-center"
              >
                <div className="flex items-center justify-between w-full">
                  {/* Équipe à domicile (à gauche) */}
                  <div className="w-1/4 text-left flex items-center">
                    <Image
                      src={match.homeTeamLogo}
                      alt={`${match.homeTeamName} logo`}
                      width={40}
                      height={40}
                      className="mr-2"
                    />
                    <span className="font-semibold">
                      {match.homeTeamName} ({match.homeTeamTrigram})
                    </span>
                  </div>

                  {/* Champs de saisie du score (au milieu) */}
                  <div className="w-2/4 flex items-center justify-center space-x-4">
                    <Input
                      type="number"
                      value={scores[match.matchId]?.home || ""}
                      onChange={(e) =>
                        handleScoreChange(match.matchId, "home", e.target.value)
                      }
                      className="w-20 text-center"
                      placeholder="Home"
                    />
                    <span className="text-2xl">-</span>
                    <Input
                      type="number"
                      value={scores[match.matchId]?.away || ""}
                      onChange={(e) =>
                        handleScoreChange(match.matchId, "away", e.target.value)
                      }
                      className="w-20 text-center"
                      placeholder="Away"
                    />
                  </div>

                  {/* Équipe à l'extérieur (à droite) */}
                  <div className="w-1/4 text-right flex items-center justify-end">
                    <span className="font-semibold mr-2">
                      {match.awayTeamName} ({match.awayTeamTrigram})
                    </span>
                    <Image
                      src={match.awayTeamLogo}
                      alt={`${match.awayTeamName} logo`}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bouton de soumission global */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleBetSubmit}>Parier pour tous les matchs</Button>
        </div>
        {/* Navigation entre les journées de match */}
        <div className="mt-6 flex justify-between items-center">
          {/* Bouton pour journée précédente */}
          <Button
            onClick={() => handleMatchdayChange("prev")}
            disabled={matchday === 1} // Désactiver si matchday = 1
          >
            <SquareChevronLeft className="h-6 w-6" />
            Précédent
          </Button>

          {/* Bouton pour journée suivante */}
          <Button onClick={() => handleMatchdayChange("next")}>
            Suivant
            <SquareChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
