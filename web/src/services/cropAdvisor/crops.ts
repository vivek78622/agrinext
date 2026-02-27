import { Crop } from "./types";

/**
 * Comprehensive Crop database for Maharashtra with detailed agronomy data.
 * Organized by categories: Food grains, Pulses, Oilseeds, Fibre/Commercial, 
 * Horticulture (Fruits, Vegetables, Spices, Flowers), Plantation crops, Others.
 */
export const CROP_DATABASE: Crop[] = [
    // ============================================
    // FOOD GRAINS - Cereals & Millets
    // ============================================
    {
        id: "1", name: "Soybean", scientificName: "Glycine max",
        season: ["Kharif"], durationDays: { min: 90, max: 110 },
        waterRequirement: { minMm: 450, maxMm: 700 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 28 },
        soilPreference: ["Black", "Loamy"],
        inputCostPerAcre: { min: 12000, max: 18000 }, marketPotential: "High",
        yieldPerAcre: { min: 8.0, max: 12.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "2", name: "Rice (Paddy)", scientificName: "Oryza sativa",
        season: ["Kharif"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 1200, maxMm: 2000 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Clay", "Alluvial", "Loamy"],
        inputCostPerAcre: { min: 18000, max: 28000 }, marketPotential: "High",
        yieldPerAcre: { min: 18.0, max: 30.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "3", name: "Jowar (Sorghum)", scientificName: "Sorghum bicolor",
        season: ["Kharif", "Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 300, maxMm: 550 },
        tempRequirement: { minC: 15, maxC: 40, optimalC: 30 },
        soilPreference: ["Black", "Red", "Loamy"],
        inputCostPerAcre: { min: 8000, max: 12000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 10.0, max: 15.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "4", name: "Bajra (Pearl Millet)", scientificName: "Pennisetum glaucum",
        season: ["Kharif"], durationDays: { min: 75, max: 95 },
        waterRequirement: { minMm: 250, maxMm: 450 },
        tempRequirement: { minC: 20, maxC: 42, optimalC: 32 },
        soilPreference: ["Sandy", "Loamy", "Red"],
        inputCostPerAcre: { min: 6000, max: 10000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 8.0, max: 14.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "5", name: "Wheat", scientificName: "Triticum aestivum",
        season: ["Rabi"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 300, maxMm: 500 },
        tempRequirement: { minC: 10, maxC: 30, optimalC: 20 },
        soilPreference: ["Alluvial", "Loamy", "Clay"],
        inputCostPerAcre: { min: 15000, max: 22000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 15.0, max: 22.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "6", name: "Maize (Corn)", scientificName: "Zea mays",
        season: ["Kharif", "Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 500, maxMm: 800 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial", "Black"],
        inputCostPerAcre: { min: 12000, max: 18000 }, marketPotential: "High",
        yieldPerAcre: { min: 20.0, max: 35.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "7", name: "Finger Millet (Ragi)", scientificName: "Eleusine coracana",
        season: ["Kharif"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 350, maxMm: 600 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 27 },
        soilPreference: ["Red", "Loamy", "Sandy"],
        inputCostPerAcre: { min: 8000, max: 12000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 8.0, max: 12.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "8", name: "Foxtail Millet", scientificName: "Setaria italica",
        season: ["Kharif"], durationDays: { min: 75, max: 90 },
        waterRequirement: { minMm: 250, maxMm: 400 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 28 },
        soilPreference: ["Loamy", "Sandy", "Red"],
        inputCostPerAcre: { min: 6000, max: 9000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 6.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // PULSES
    // ============================================
    {
        id: "10", name: "Tur (Pigeonpea)", scientificName: "Cajanus cajan",
        season: ["Kharif"], durationDays: { min: 150, max: 200 },
        waterRequirement: { minMm: 350, maxMm: 600 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Black", "Red", "Loamy"],
        inputCostPerAcre: { min: 10000, max: 15000 }, marketPotential: "High",
        yieldPerAcre: { min: 5.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "11", name: "Mung (Green Gram)", scientificName: "Vigna radiata",
        season: ["Kharif", "Zaid"], durationDays: { min: 60, max: 75 },
        waterRequirement: { minMm: 200, maxMm: 350 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 8000, max: 12000 }, marketPotential: "High",
        yieldPerAcre: { min: 4.0, max: 7.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "12", name: "Urad (Black Gram)", scientificName: "Vigna mungo",
        season: ["Kharif"], durationDays: { min: 70, max: 90 },
        waterRequirement: { minMm: 250, maxMm: 400 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Black", "Alluvial"],
        inputCostPerAcre: { min: 8000, max: 13000 }, marketPotential: "High",
        yieldPerAcre: { min: 4.0, max: 7.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "13", name: "Gram (Chickpea)", scientificName: "Cicer arietinum",
        season: ["Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 200, maxMm: 350 },
        tempRequirement: { minC: 10, maxC: 30, optimalC: 22 },
        soilPreference: ["Black", "Loamy", "Clay"],
        inputCostPerAcre: { min: 10000, max: 16000 }, marketPotential: "High",
        yieldPerAcre: { min: 6.0, max: 12.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "14", name: "Cowpea (Lobia)", scientificName: "Vigna unguiculata",
        season: ["Kharif", "Zaid"], durationDays: { min: 60, max: 90 },
        waterRequirement: { minMm: 200, maxMm: 400 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Sandy", "Loamy"],
        inputCostPerAcre: { min: 6000, max: 10000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 5.0, max: 8.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "15", name: "Horse Gram (Kulthi)", scientificName: "Macrotyloma uniflorum",
        season: ["Kharif", "Rabi"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 150, maxMm: 350 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 25 },
        soilPreference: ["Red", "Sandy", "Loamy"],
        inputCostPerAcre: { min: 5000, max: 8000 }, marketPotential: "Low",
        yieldPerAcre: { min: 4.0, max: 6.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // OILSEEDS
    // ============================================
    {
        id: "20", name: "Groundnut", scientificName: "Arachis hypogaea",
        season: ["Kharif", "Zaid"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 400, maxMm: 650 },
        tempRequirement: { minC: 20, maxC: 38, optimalC: 28 },
        soilPreference: ["Sandy", "Loamy", "Red"],
        inputCostPerAcre: { min: 15000, max: 22000 }, marketPotential: "High",
        yieldPerAcre: { min: 8.0, max: 15.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "21", name: "Sunflower", scientificName: "Helianthus annuus",
        season: ["Kharif", "Rabi"], durationDays: { min: 80, max: 110 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 26 },
        soilPreference: ["Black", "Loamy", "Alluvial"],
        inputCostPerAcre: { min: 10000, max: 15000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 5.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "22", name: "Safflower (Kardi)", scientificName: "Carthamus tinctorius",
        season: ["Rabi"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 200, maxMm: 400 },
        tempRequirement: { minC: 10, maxC: 32, optimalC: 22 },
        soilPreference: ["Black", "Loamy"],
        inputCostPerAcre: { min: 8000, max: 12000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 4.0, max: 8.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "23", name: "Mustard", scientificName: "Brassica juncea",
        season: ["Rabi"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 200, maxMm: 400 },
        tempRequirement: { minC: 10, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Alluvial", "Clay"],
        inputCostPerAcre: { min: 10000, max: 15000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 6.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "24", name: "Sesame (Til)", scientificName: "Sesamum indicum",
        season: ["Kharif"], durationDays: { min: 80, max: 100 },
        waterRequirement: { minMm: 250, maxMm: 400 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Black"],
        inputCostPerAcre: { min: 6000, max: 10000 }, marketPotential: "High",
        yieldPerAcre: { min: 2.0, max: 4.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "25", name: "Castor", scientificName: "Ricinus communis",
        season: ["Kharif"], durationDays: { min: 150, max: 200 },
        waterRequirement: { minMm: 300, maxMm: 550 },
        tempRequirement: { minC: 18, maxC: 40, optimalC: 28 },
        soilPreference: ["Loamy", "Red", "Black"],
        inputCostPerAcre: { min: 8000, max: 14000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 6.0, max: 12.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // FIBRE & COMMERCIAL CROPS
    // ============================================
    {
        id: "30", name: "Cotton", scientificName: "Gossypium",
        season: ["Kharif"], durationDays: { min: 150, max: 180 },
        waterRequirement: { minMm: 700, maxMm: 1200 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 32 },
        soilPreference: ["Black", "Loamy"],
        inputCostPerAcre: { min: 20000, max: 35000 }, marketPotential: "High",
        yieldPerAcre: { min: 8.0, max: 12.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "31", name: "Sugarcane", scientificName: "Saccharum officinarum",
        season: ["Annual"], durationDays: { min: 365, max: 450 },
        waterRequirement: { minMm: 1500, maxMm: 2500 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Black", "Alluvial", "Loamy"],
        inputCostPerAcre: { min: 45000, max: 65000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 40.0, max: 60.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "32", name: "Tobacco", scientificName: "Nicotiana tabacum",
        season: ["Rabi"], durationDays: { min: 90, max: 130 },
        waterRequirement: { minMm: 400, maxMm: 600 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 25 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 25000, max: 40000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 8.0, max: 15.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // FRUITS
    // ============================================
    {
        id: "40", name: "Mango", scientificName: "Mangifera indica",
        season: ["Annual"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 600, maxMm: 1000 },
        tempRequirement: { minC: 20, maxC: 42, optimalC: 30 },
        soilPreference: ["Loamy", "Alluvial", "Red"],
        inputCostPerAcre: { min: 25000, max: 45000 }, marketPotential: "High",
        yieldPerAcre: { min: 4.0, max: 10.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "41", name: "Banana", scientificName: "Musa",
        season: ["Annual"], durationDays: { min: 300, max: 365 },
        waterRequirement: { minMm: 1800, maxMm: 2500 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial", "Clay"],
        inputCostPerAcre: { min: 60000, max: 100000 }, marketPotential: "High",
        yieldPerAcre: { min: 25.0, max: 50.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "42", name: "Orange (Nagpur Santra)", scientificName: "Citrus sinensis",
        season: ["Annual"], durationDays: { min: 240, max: 300 },
        waterRequirement: { minMm: 900, maxMm: 1400 },
        tempRequirement: { minC: 15, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial"],
        inputCostPerAcre: { min: 40000, max: 70000 }, marketPotential: "High",
        yieldPerAcre: { min: 8.0, max: 20.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "43", name: "Grapes", scientificName: "Vitis vinifera",
        season: ["Annual"], durationDays: { min: 180, max: 240 },
        waterRequirement: { minMm: 500, maxMm: 900 },
        tempRequirement: { minC: 15, maxC: 38, optimalC: 25 },
        soilPreference: ["Loamy", "Sandy", "Red"],
        inputCostPerAcre: { min: 80000, max: 150000 }, marketPotential: "High",
        yieldPerAcre: { min: 10.0, max: 25.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "44", name: "Pomegranate", scientificName: "Punica granatum",
        season: ["Annual"], durationDays: { min: 180, max: 210 },
        waterRequirement: { minMm: 400, maxMm: 700 },
        tempRequirement: { minC: 15, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Black"],
        inputCostPerAcre: { min: 50000, max: 90000 }, marketPotential: "High",
        yieldPerAcre: { min: 6.0, max: 15.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "45", name: "Sapota (Chiku)", scientificName: "Manilkara zapota",
        season: ["Annual"], durationDays: { min: 180, max: 240 },
        waterRequirement: { minMm: 800, maxMm: 1200 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial"],
        inputCostPerAcre: { min: 30000, max: 50000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 8.0, max: 18.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "46", name: "Papaya", scientificName: "Carica papaya",
        season: ["Annual"], durationDays: { min: 270, max: 365 },
        waterRequirement: { minMm: 1200, maxMm: 1800 },
        tempRequirement: { minC: 18, maxC: 40, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial", "Sandy"],
        inputCostPerAcre: { min: 40000, max: 70000 }, marketPotential: "High",
        yieldPerAcre: { min: 30.0, max: 60.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "47", name: "Guava", scientificName: "Psidium guajava",
        season: ["Annual"], durationDays: { min: 150, max: 180 },
        waterRequirement: { minMm: 600, maxMm: 1000 },
        tempRequirement: { minC: 15, maxC: 40, optimalC: 28 },
        soilPreference: ["Loamy", "Alluvial", "Red"],
        inputCostPerAcre: { min: 25000, max: 45000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 10.0, max: 25.0, unit: "Tonnes" }, isPerishable: true
    },
    // ============================================
    // VEGETABLES
    // ============================================
    {
        id: "50", name: "Onion", scientificName: "Allium cepa",
        season: ["Kharif", "Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 12, maxC: 32, optimalC: 22 },
        soilPreference: ["Loamy", "Alluvial", "Sandy"],
        inputCostPerAcre: { min: 35000, max: 55000 }, marketPotential: "High",
        yieldPerAcre: { min: 100.0, max: 200.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "51", name: "Tomato", scientificName: "Solanum lycopersicum",
        season: ["Kharif", "Rabi"], durationDays: { min: 90, max: 110 },
        waterRequirement: { minMm: 400, maxMm: 600 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 25 },
        soilPreference: ["Loamy", "Red"],
        inputCostPerAcre: { min: 30000, max: 50000 }, marketPotential: "High",
        yieldPerAcre: { min: 150.0, max: 350.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "52", name: "Potato", scientificName: "Solanum tuberosum",
        season: ["Rabi"], durationDays: { min: 80, max: 110 },
        waterRequirement: { minMm: 400, maxMm: 600 },
        tempRequirement: { minC: 10, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 40000, max: 60000 }, marketPotential: "High",
        yieldPerAcre: { min: 80.0, max: 150.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "53", name: "Brinjal (Eggplant)", scientificName: "Solanum melongena",
        season: ["Kharif", "Rabi"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 400, maxMm: 700 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Black", "Alluvial"],
        inputCostPerAcre: { min: 25000, max: 40000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 100.0, max: 200.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "54", name: "Chilli", scientificName: "Capsicum annuum",
        season: ["Kharif", "Rabi"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 400, maxMm: 650 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Black", "Red"],
        inputCostPerAcre: { min: 30000, max: 50000 }, marketPotential: "High",
        yieldPerAcre: { min: 30.0, max: 60.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "55", name: "Okra (Bhindi)", scientificName: "Abelmoschus esculentus",
        season: ["Kharif", "Zaid"], durationDays: { min: 60, max: 90 },
        waterRequirement: { minMm: 300, maxMm: 500 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 20000, max: 35000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 50.0, max: 100.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "56", name: "Cabbage", scientificName: "Brassica oleracea var. capitata",
        season: ["Rabi"], durationDays: { min: 80, max: 110 },
        waterRequirement: { minMm: 350, maxMm: 500 },
        tempRequirement: { minC: 10, maxC: 25, optimalC: 18 },
        soilPreference: ["Loamy", "Clay", "Alluvial"],
        inputCostPerAcre: { min: 25000, max: 40000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 100.0, max: 200.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "57", name: "Cauliflower", scientificName: "Brassica oleracea var. botrytis",
        season: ["Rabi"], durationDays: { min: 80, max: 120 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 10, maxC: 26, optimalC: 18 },
        soilPreference: ["Loamy", "Clay", "Alluvial"],
        inputCostPerAcre: { min: 30000, max: 45000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 80.0, max: 150.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "58", name: "Bottle Gourd (Lauki)", scientificName: "Lagenaria siceraria",
        season: ["Kharif", "Zaid"], durationDays: { min: 60, max: 90 },
        waterRequirement: { minMm: 400, maxMm: 650 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 15000, max: 25000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 100.0, max: 180.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "59", name: "Bitter Gourd (Karela)", scientificName: "Momordica charantia",
        season: ["Kharif", "Zaid"], durationDays: { min: 55, max: 75 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 22, maxC: 40, optimalC: 32 },
        soilPreference: ["Loamy", "Sandy"],
        inputCostPerAcre: { min: 18000, max: 30000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 40.0, max: 80.0, unit: "Quintals" }, isPerishable: true
    },
    // ============================================
    // SPICES
    // ============================================
    {
        id: "60", name: "Turmeric (Haldi)", scientificName: "Curcuma longa",
        season: ["Kharif"], durationDays: { min: 240, max: 300 },
        waterRequirement: { minMm: 1200, maxMm: 1800 },
        tempRequirement: { minC: 20, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Red", "Alluvial"],
        inputCostPerAcre: { min: 50000, max: 80000 }, marketPotential: "High",
        yieldPerAcre: { min: 80.0, max: 150.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "61", name: "Ginger", scientificName: "Zingiber officinale",
        season: ["Kharif"], durationDays: { min: 210, max: 270 },
        waterRequirement: { minMm: 1500, maxMm: 2200 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 28 },
        soilPreference: ["Loamy", "Sandy", "Red"],
        inputCostPerAcre: { min: 60000, max: 100000 }, marketPotential: "High",
        yieldPerAcre: { min: 80.0, max: 150.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "62", name: "Garlic", scientificName: "Allium sativum",
        season: ["Rabi"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 12, maxC: 30, optimalC: 20 },
        soilPreference: ["Loamy", "Alluvial", "Sandy"],
        inputCostPerAcre: { min: 40000, max: 60000 }, marketPotential: "High",
        yieldPerAcre: { min: 40.0, max: 80.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "63", name: "Coriander", scientificName: "Coriandrum sativum",
        season: ["Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 200, maxMm: 400 },
        tempRequirement: { minC: 10, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Black", "Alluvial"],
        inputCostPerAcre: { min: 12000, max: 20000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 4.0, max: 8.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "64", name: "Cumin (Jeera)", scientificName: "Cuminum cyminum",
        season: ["Rabi"], durationDays: { min: 100, max: 130 },
        waterRequirement: { minMm: 150, maxMm: 300 },
        tempRequirement: { minC: 8, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Sandy"],
        inputCostPerAcre: { min: 15000, max: 25000 }, marketPotential: "High",
        yieldPerAcre: { min: 3.0, max: 6.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "65", name: "Fenugreek (Methi)", scientificName: "Trigonella foenum-graecum",
        season: ["Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 200, maxMm: 350 },
        tempRequirement: { minC: 10, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Clay", "Alluvial"],
        inputCostPerAcre: { min: 10000, max: 18000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 5.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // FLOWERS
    // ============================================
    {
        id: "70", name: "Marigold", scientificName: "Tagetes",
        season: ["Kharif", "Rabi"], durationDays: { min: 75, max: 100 },
        waterRequirement: { minMm: 350, maxMm: 550 },
        tempRequirement: { minC: 15, maxC: 35, optimalC: 25 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 25000, max: 40000 }, marketPotential: "High",
        yieldPerAcre: { min: 8.0, max: 15.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "71", name: "Rose", scientificName: "Rosa",
        season: ["Annual"], durationDays: { min: 120, max: 180 },
        waterRequirement: { minMm: 600, maxMm: 1000 },
        tempRequirement: { minC: 12, maxC: 32, optimalC: 22 },
        soilPreference: ["Loamy", "Clay"],
        inputCostPerAcre: { min: 50000, max: 100000 }, marketPotential: "High",
        yieldPerAcre: { min: 5.0, max: 12.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "72", name: "Jasmine", scientificName: "Jasminum",
        season: ["Annual"], durationDays: { min: 150, max: 200 },
        waterRequirement: { minMm: 500, maxMm: 800 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Sandy"],
        inputCostPerAcre: { min: 40000, max: 70000 }, marketPotential: "High",
        yieldPerAcre: { min: 3.0, max: 6.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "73", name: "Tuberose", scientificName: "Polianthes tuberosa",
        season: ["Kharif"], durationDays: { min: 120, max: 150 },
        waterRequirement: { minMm: 500, maxMm: 800 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 25 },
        soilPreference: ["Loamy", "Sandy", "Alluvial"],
        inputCostPerAcre: { min: 45000, max: 75000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 4.0, max: 8.0, unit: "Tonnes" }, isPerishable: true
    },
    {
        id: "74", name: "Chrysanthemum", scientificName: "Chrysanthemum",
        season: ["Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 400, maxMm: 600 },
        tempRequirement: { minC: 10, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Sandy"],
        inputCostPerAcre: { min: 35000, max: 60000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 6.0, max: 12.0, unit: "Tonnes" }, isPerishable: true
    },
    // ============================================
    // PLANTATION CROPS
    // ============================================
    {
        id: "80", name: "Cashew", scientificName: "Anacardium occidentale",
        season: ["Annual"], durationDays: { min: 180, max: 240 },
        waterRequirement: { minMm: 1000, maxMm: 1600 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 28 },
        soilPreference: ["Sandy", "Red", "Loamy"],
        inputCostPerAcre: { min: 20000, max: 35000 }, marketPotential: "High",
        yieldPerAcre: { min: 4.0, max: 10.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "81", name: "Coconut", scientificName: "Cocos nucifera",
        season: ["Annual"], durationDays: { min: 300, max: 365 },
        waterRequirement: { minMm: 1200, maxMm: 2000 },
        tempRequirement: { minC: 20, maxC: 38, optimalC: 28 },
        soilPreference: ["Sandy", "Loamy", "Alluvial"],
        inputCostPerAcre: { min: 25000, max: 45000 }, marketPotential: "High",
        yieldPerAcre: { min: 8000.0, max: 15000.0, unit: "Nuts" }, isPerishable: false
    },
    {
        id: "82", name: "Arecanut", scientificName: "Areca catechu",
        season: ["Annual"], durationDays: { min: 300, max: 365 },
        waterRequirement: { minMm: 1500, maxMm: 2200 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 28 },
        soilPreference: ["Loamy", "Red", "Alluvial"],
        inputCostPerAcre: { min: 30000, max: 55000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 8.0, max: 15.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "83", name: "Cocoa", scientificName: "Theobroma cacao",
        season: ["Annual"], durationDays: { min: 300, max: 365 },
        waterRequirement: { minMm: 1500, maxMm: 2500 },
        tempRequirement: { minC: 18, maxC: 35, optimalC: 26 },
        soilPreference: ["Loamy", "Clay", "Alluvial"],
        inputCostPerAcre: { min: 35000, max: 60000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 3.0, max: 8.0, unit: "Quintals" }, isPerishable: false
    },
    // ============================================
    // MEDICINAL & AROMATIC PLANTS
    // ============================================
    {
        id: "90", name: "Ashwagandha", scientificName: "Withania somnifera",
        season: ["Kharif"], durationDays: { min: 150, max: 180 },
        waterRequirement: { minMm: 200, maxMm: 400 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Sandy", "Loamy", "Red"],
        inputCostPerAcre: { min: 12000, max: 20000 }, marketPotential: "High",
        yieldPerAcre: { min: 4.0, max: 7.0, unit: "Quintals" }, isPerishable: false
    },
    {
        id: "91", name: "Lemongrass", scientificName: "Cymbopogon citratus",
        season: ["Kharif"], durationDays: { min: 150, max: 200 },
        waterRequirement: { minMm: 600, maxMm: 1000 },
        tempRequirement: { minC: 20, maxC: 40, optimalC: 30 },
        soilPreference: ["Loamy", "Sandy", "Red"],
        inputCostPerAcre: { min: 15000, max: 25000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 50.0, max: 100.0, unit: "Kg Oil" }, isPerishable: false
    },
    {
        id: "92", name: "Tulsi (Holy Basil)", scientificName: "Ocimum tenuiflorum",
        season: ["Kharif", "Rabi"], durationDays: { min: 90, max: 120 },
        waterRequirement: { minMm: 300, maxMm: 500 },
        tempRequirement: { minC: 18, maxC: 38, optimalC: 28 },
        soilPreference: ["Loamy", "Sandy"],
        inputCostPerAcre: { min: 10000, max: 18000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 80.0, max: 150.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "93", name: "Aloe Vera", scientificName: "Aloe barbadensis miller",
        season: ["Annual"], durationDays: { min: 240, max: 365 },
        waterRequirement: { minMm: 200, maxMm: 450 },
        tempRequirement: { minC: 18, maxC: 40, optimalC: 28 },
        soilPreference: ["Sandy", "Loamy"],
        inputCostPerAcre: { min: 15000, max: 28000 }, marketPotential: "High",
        yieldPerAcre: { min: 150.0, max: 300.0, unit: "Quintals" }, isPerishable: true
    },
    // ============================================
    // FODDER CROPS
    // ============================================
    {
        id: "95", name: "Fodder Sorghum", scientificName: "Sorghum bicolor",
        season: ["Kharif", "Zaid"], durationDays: { min: 60, max: 90 },
        waterRequirement: { minMm: 250, maxMm: 450 },
        tempRequirement: { minC: 18, maxC: 40, optimalC: 30 },
        soilPreference: ["Black", "Loamy", "Red"],
        inputCostPerAcre: { min: 5000, max: 10000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 200.0, max: 400.0, unit: "Quintals" }, isPerishable: true
    },
    {
        id: "96", name: "Berseem", scientificName: "Trifolium alexandrinum",
        season: ["Rabi"], durationDays: { min: 120, max: 180 },
        waterRequirement: { minMm: 600, maxMm: 1000 },
        tempRequirement: { minC: 8, maxC: 28, optimalC: 18 },
        soilPreference: ["Loamy", "Clay", "Alluvial"],
        inputCostPerAcre: { min: 8000, max: 15000 }, marketPotential: "Medium",
        yieldPerAcre: { min: 300.0, max: 500.0, unit: "Quintals" }, isPerishable: true
    },
];
