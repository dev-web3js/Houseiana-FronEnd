"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Calendar, Users, Home } from "lucide-react";
import { getAllCities } from "@/lib/locations";

export default function SearchBar() {
  const router = useRouter();
  const cities = getAllCities();
  
  const [location, setLocation] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState("2");
  const [stayType, setStayType] = useState("monthly");
  const [showMap, setShowMap] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    
    if (!location) {
      alert("Please select a city");
      return;
    }
    
    setLoading(true);
    const selectedCity = cities.find(city => city.value === location);
    
    const params = new URLSearchParams({
      location: location,
      from,
      to,
      guests: guests,
      stay: stayType,
      map: showMap ? "1" : "0"
    });

    if (selectedCity) {
      params.set("lat", String(selectedCity.lat));
      params.set("lng", String(selectedCity.lng));
      params.set("city", selectedCity.name);
      params.set("country", selectedCity.country);
    }

    setLoading(false);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Card className="p-6 shadow-lg bg-white/95 backdrop-blur">
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Location */}
          <div className="lg:col-span-1">
            <Label htmlFor="location" className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <div className="font-semibold px-2 py-1.5 text-xs text-muted-foreground">QATAR</div>
                {cities.filter(c => c.country === "Qatar").map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.name}
                  </SelectItem>
                ))}
                <div className="font-semibold px-2 py-1.5 text-xs mt-2 text-muted-foreground">UAE</div>
                {cities.filter(c => c.country === "United Arab Emirates").map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Check-in */}
          <div>
            <Label htmlFor="from" className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Check-in
            </Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Check-out */}
          <div>
            <Label htmlFor="to" className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Check-out
            </Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              min={from}
              className="w-full"
              required
            />
          </div>

          {/* Guests */}
          <div>
            <Label htmlFor="guests" className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Guests
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id="guests" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <SelectItem key={num} value={String(num)}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stay Type */}
          <div>
            <Label htmlFor="stay" className="text-xs uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <Home className="w-3 h-3" />
              Stay Type
            </Label>
            <Select value={stayType} onValueChange={setStayType}>
              <SelectTrigger id="stay" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <Label className="text-xs uppercase tracking-wide text-transparent mb-1">Search</Label>
            <div className="flex gap-2">
              <div className="flex items-center">
                <Checkbox 
                  id="map" 
                  checked={showMap}
                  onCheckedChange={setShowMap}
                  className="mr-2"
                />
                <Label htmlFor="map" className="text-sm cursor-pointer whitespace-nowrap">
                  Map
                </Label>
              </div>
              <Button type="submit" disabled={loading} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                {loading ? "..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}