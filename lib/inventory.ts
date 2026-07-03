import type { Marque } from "./brands";

export interface Vehicle {
  id: string;
  brand: Marque;
  model: string;
  year: number;
  highlight: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
}

export const inventory: Vehicle[] = [
  {
    id: "rr-cullinan-2024",
    brand: "Rolls-Royce",
    model: "Cullinan Black Badge",
    year: 2024,
    highlight: "Bespoke interior · Night-ready presence",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/rr-cullinan-2024.webp",
    imageAlt: "Rolls-Royce Cullinan luxury SUV",
  },
  {
    id: "ferrari-296-gtb",
    brand: "Ferrari",
    model: "296 GTB",
    year: 2024,
    highlight: "Plug-in hybrid V6 · Track-bred elegance",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/ferrari-296-gtb.webp",
    imageAlt: "Ferrari 296 GTB sports car",
  },
  {
    id: "lambo-urus-se",
    brand: "Lamborghini",
    model: "Urus SE",
    year: 2025,
    highlight: "Hybrid performance SUV · Off-market allocation",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/lambo-urus-se.webp",
    imageAlt: "Lamborghini Urus SE performance SUV",
  },
  {
    id: "mb-g63-2024",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    year: 2024,
    highlight: "Manufaktur package · Iconic silhouette",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/mb-g63-2024.webp",
    imageAlt: "Mercedes-AMG G 63 luxury off-roader",
  },
  {
    id: "porsche-911-turbo-s",
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2024,
    highlight: "Sport Chrono · Precision engineering",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/porsche-911-turbo-s.webp",
    imageAlt: "Porsche 911 Turbo S sports car",
  },
  {
    id: "bentley-continental-gt",
    brand: "Bentley",
    model: "Continental GT Speed",
    year: 2024,
    highlight: "Mulliner appointments · Grand tourer",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/bentley-continental-gt.webp",
    imageAlt: "Bentley Continental GT Speed grand tourer",
  },
  {
    id: "corvette-z06",
    brand: "Corvette",
    model: "Z06 3LZ",
    year: 2024,
    highlight: "Flat-plane V8 · American exotic",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/corvette-z06.webp",
    imageAlt: "Chevrolet Corvette Z06 sports car",
  },
  {
    id: "rr-ghost-2023",
    brand: "Rolls-Royce",
    model: "Ghost Extended",
    year: 2023,
    highlight: "Starlight headliner · Whisper-quiet cabin",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/rr-ghost-2023.webp",
    imageAlt: "Rolls-Royce Ghost Extended luxury sedan",
  },
  {
    id: "ferrari-roma",
    brand: "Ferrari",
    model: "Roma Spider",
    year: 2024,
    highlight: "Open-air grand touring · Timeless lines",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/ferrari-roma.webp",
    imageAlt: "Ferrari Roma Spider convertible",
  },
  {
    id: "mb-s580",
    brand: "Mercedes-Benz",
    model: "S 580 4MATIC",
    year: 2024,
    highlight: "Executive rear suite · Flagship comfort",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/mb-s580.webp",
    imageAlt: "Mercedes-Benz S-Class luxury sedan",
  },
  {
    id: "lambo-huracan-sterrato",
    brand: "Lamborghini",
    model: "Huracán Sterrato",
    year: 2023,
    highlight: "Rally-bred supercar · Limited production",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/lambo-huracan-sterrato.webp",
    imageAlt: "Lamborghini Huracán Sterrato supercar",
  },
  {
    id: "porsche-cayenne-turbo-gt",
    brand: "Porsche",
    model: "Cayenne Turbo GT",
    year: 2024,
    highlight: "Track-tuned SUV · Uncompromising pace",
    priceLabel: "Upon Inquiry",
    imageSrc: "/vehicles/porsche-cayenne-turbo-gt.webp",
    imageAlt: "Porsche Cayenne Turbo GT performance SUV",
  },
];
