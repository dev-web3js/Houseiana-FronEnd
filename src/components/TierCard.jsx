import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function TierCard({ tier = "standard", bullets = [], hint = "" }) {
  const tierConfig = {
    standard: {
      badge: "default",
      button: "outline",
      title: "Standard",
      description: "Good value monthly stays with essential comforts."
    },
    gold: {
      badge: "secondary", 
      button: "default",
      title: "Gold",
      description: "Upgraded amenities for families and remote work."
    },
    premium: {
      badge: "default",
      button: "default",
      title: "Premium",
      description: "Top-tier locations & amenities for longer stays."
    }
  };

  const config = tierConfig[tier];

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{config.title}</CardTitle>
          <Badge variant={config.badge}>{tier.toUpperCase()}</Badge>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{bullet}</span>
            </li>
          ))}
        </ul>
        {hint && (
          <p className="mt-4 text-sm text-muted-foreground">{hint}</p>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant={config.button} className="w-full" asChild>
          <Link href={`/search?tier=${tier}`}>View homes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}