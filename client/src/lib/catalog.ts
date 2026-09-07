import { Cable, Headphones, Radio, Smartphone, Zap } from "lucide-react";

export type Category = "Chargers" | "Phone Cases" | "Cables" | "Earbuds" | "Headphones";
export type Product = { id: number; name: string; category: Category; price: number; image: string; tag: string; description: string };

export const categories: { name: Category; icon: typeof Zap; code: string }[] = [
  { name: "Chargers", icon: Zap, code: "PWR" }, { name: "Phone Cases", icon: Smartphone, code: "SHE" }, { name: "Cables", icon: Cable, code: "LINK" }, { name: "Earbuds", icon: Radio, code: "AUDIO" }, { name: "Headphones", icon: Headphones, code: "SONIC" },
];
const productSeeds: Record<Category, string[]> = {
  Chargers: ["TurboCharge 20W", "NanoVolt 33W", "PowerCore 65W", "FluxCharge 45W", "WallPulse 18W", "GaN Matrix 100W", "QuickBeam 25W", "DualPort Surge", "TravelVolt Mini", "DeskCharge Pro"],
  "Phone Cases": ["Carbon Shell", "Neon Armor", "ClearGuard", "Shockwave Grip", "Midnight Matte", "Pixel Vault", "AeroShield", "Chrome Edge", "SoftCore", "DigiCamo"],
  Cables: ["HyperLink USB-C", "Braided Sync", "FlashLine Lightning", "VoltBridge", "DataStream Pro", "MagLink Cable", "TwinPort Cable", "NightGlow Cable", "TitanCore", "FlexWire"],
  Earbuds: ["Pulse Buds", "AirNode Mini", "SonicDots", "EchoPods ANC", "ByteBuds", "WaveLink Buds", "MetroPods", "QuietCore", "NeonBuds", "Orbit Earbuds"],
  Headphones: ["AeroSound 500", "BassForge", "CyberCans", "QuietGrid ANC", "StudioLink", "Pulse Over-Ear", "NightDrive", "SonicFrame", "Orbit Max", "VoidTone"],
};
export const fallbackImages: Record<Category, string> = {
  Chargers: "https://images.unsplash.com/photo-1609592424672-3b71a4a7f2e0?auto=format&fit=crop&w=800&q=80", "Phone Cases": "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80", Cables: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80", Earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", Headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
};
export function buildCatalog(): Product[] { return categories.flatMap(({ name }) => Array.from({ length: 50 }, (_, index) => { const seed = productSeeds[name][index % 10]; const price = 1290 + ((index * 773 + name.length * 41) % 26800); return { id: categories.findIndex(c => c.name === name) * 50 + index + 1, name: `${seed} // MK-${String(index + 1).padStart(2, "0")}`, category: name, price, image: fallbackImages[name], tag: index < 3 ? "HOT DROP" : index % 7 === 0 ? "LIMITED" : "READY", description: `Field-tested ${name.toLowerCase()} module with Sakith Tech Store quality assurance.` }; })); }
export const initialCatalog = buildCatalog();
export const whatsappNumber = "94759375358";
export const money = (value: number) => `LKR ${value.toLocaleString("en-LK")}`;
