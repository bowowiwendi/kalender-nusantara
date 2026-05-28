export interface ShioInfo {
  animal: string;
  element: string;
  celestialStem: string;
  earthlyBranch: string;
  fullName: string;
  description?: string;
  compatibility?: string[];
  opposite?: string;
}

const animals: Record<string, string[]> = {
  id: ["Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular", "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi"],
  en: ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
};

const earthlyBranches: Record<string, string[]> = {
  id: ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"],
  en: ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"],
};

const celestialStems: Record<string, string[]> = {
  id: ["甲 (Jia)", "乙 (Yi)", "丙 (Bing)", "丁 (Ding)", "戊 (Wu)", "己 (Ji)", "庚 (Geng)", "辛 (Xin)", "壬 (Ren)", "癸 (Gui)"],
  en: ["Jia (Wood-Yang)", "Yi (Wood-Yin)", "Bing (Fire-Yang)", "Ding (Fire-Yin)", "Wu (Earth-Yang)", "Ji (Earth-Yin)", "Geng (Metal-Yang)", "Xin (Metal-Yin)", "Ren (Water-Yang)", "Gui (Water-Yin)"],
};

const elements: Record<string, string[]> = {
  id: ["Kayu", "Kayu", "Api", "Api", "Tanah", "Tanah", "Logam", "Logam", "Air", "Air"],
  en: ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"],
};

const elementSymbols = ["🌳", "🌳", "🔥", "🔥", "🌍", "🌍", "⚔️", "⚔️", "💧", "💧"];

const animalDescriptions: Record<string, Record<string, string>> = {
  id: {
    Tikus: "Cerdas, karismatik, dan banyak akal. Mudah beradaptasi dalam situasi apapun.",
    Kerbau: "Rajin, dapat diandalkan, dan sabar. Kuat dan teliti dalam bekerja.",
    Macan: "Berani, kompetitif, penuh percaya diri. Pemimpin yang karismatik.",
    Kelinci: "Lembut, elegan, penyayang, dan memiliki selera seni tinggi.",
    Naga: "Berwibawa, ambisius, energik, dan pembawa keberuntungan.",
    Ular: "Bijaksana, misterius, intuitif, dan memiliki daya tarik kuat.",
    Kuda: "Bersemangat, mandiri, suka kebebasan, dan pandai bersosialisasi.",
    Kambing: "Kreatif, lembut, damai, dan memiliki jiwa seni yang kuat.",
    Monyet: "Cerdik, lucu, inovatif, dan sangat pandai memecahkan masalah.",
    Ayam: "Observan, percaya diri, pekerja keras, dan tepat waktu.",
    Anjing: "Setia, jujur, melindungi, dan memiliki integritas tinggi.",
    Babi: "Baik hati, murah hati, sabar, dan menikmati hidup.",
  },
};

const compatibilityMap: Record<string, string[]> = {
  Tikus: ["Naga", "Monyet", "Kerbau"],
  Kerbau: ["Ular", "Ayam", "Tikus"],
  Macan: ["Kuda", "Anjing", "Kelinci"],
  Kelinci: ["Kambing", "Babi", "Macan"],
  Naga: ["Monyet", "Tikus", "Ayam"],
  Ular: ["Ayam", "Kerbau", "Monyet"],
  Kuda: ["Anjing", "Macan", "Kambing"],
  Kambing: ["Kelinci", "Babi", "Kuda"],
  Monyet: ["Naga", "Tikus", "Ular"],
  Ayam: ["Ular", "Kerbau", "Naga"],
  Anjing: ["Macan", "Kuda", "Kelinci"],
  Babi: ["Kelinci", "Kambing", "Macan"],
};

const oppositeMap: Record<string, string> = {
  Tikus: "Kuda", Kerbau: "Kambing", Macan: "Monyet",
  Kelinci: "Ayam", Naga: "Anjing", Ular: "Babi",
  Kuda: "Tikus", Kambing: "Kerbau", Monyet: "Macan",
  Ayam: "Kelinci", Anjing: "Naga", Babi: "Ular",
};

export function getShio(year: number, lang: "id" | "en" = "id"): ShioInfo {
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const animal = animals[lang][animalIndex];
  const element = elements[lang][stemIndex];
  const celestialStem = celestialStems[lang][stemIndex];
  const earthlyBranch = earthlyBranches[lang][animalIndex];

  return {
    animal,
    element,
    celestialStem: celestialStem.split(" ")[0],
    earthlyBranch,
    fullName: `${celestialStem.split(" ")[0]}${earthlyBranch}`,
    description: lang === "id" ? (animalDescriptions.id[animal] || "") : "",
    compatibility: compatibilityMap[animals.id[animalIndex]] || [],
    opposite: oppositeMap[animals.id[animalIndex]] || "",
  };
}

export function getShioAnimal(year: number, lang: "id" | "en" = "id"): string {
  const index = ((year - 4) % 12 + 12) % 12;
  return animals[lang][index];
}

export function getFiveElements(year: number): { element: string; symbol: string; yinYang: string } {
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const elementNames = ["Kayu", "Kayu", "Api", "Api", "Tanah", "Tanah", "Logam", "Logam", "Air", "Air"];
  const yinYangLabels = ["Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin"];
  return {
    element: elementNames[stemIndex],
    symbol: elementSymbols[stemIndex],
    yinYang: yinYangLabels[stemIndex],
  };
}

export function estimateChineseNewYear(gregorianYear: number): Date {
  const lookup: Record<number, string> = {
    2020: "2020-01-25", 2021: "2021-02-12", 2022: "2022-02-01",
    2023: "2023-01-22", 2024: "2024-02-10", 2025: "2025-01-29",
    2026: "2026-02-17", 2027: "2027-02-06", 2028: "2028-01-26",
    2029: "2029-02-13", 2030: "2030-02-03", 2031: "2031-01-23",
    2032: "2032-02-11", 2033: "2033-01-31", 2034: "2034-02-19",
    2035: "2035-02-08", 2036: "2036-01-28", 2037: "2037-02-15",
    2038: "2038-02-04", 2039: "2039-01-24", 2040: "2040-02-12",
  };
  if (lookup[gregorianYear]) {
    return new Date(lookup[gregorianYear]);
  }
  const jan21 = new Date(gregorianYear, 0, 21);
  const feb20 = new Date(gregorianYear, 1, 20);
  return new Date(jan21.getTime() + Math.random() * (feb20.getTime() - jan21.getTime()));
}

export function isImlekHoliday(date: Date): boolean {
  const y = date.getFullYear();
  const cny = estimateChineseNewYear(y);
  if (date.getMonth() === cny.getMonth() && date.getDate() === cny.getDate()) return true;
  const capGoMe = new Date(cny);
  capGoMe.setDate(capGoMe.getDate() + 14);
  if (date.getMonth() === capGoMe.getMonth() && date.getDate() === capGoMe.getDate()) return true;
  const nextCny = estimateChineseNewYear(y + 1);
  if (date.getMonth() === nextCny.getMonth() && date.getDate() === nextCny.getDate()) return true;
  return false;
}
