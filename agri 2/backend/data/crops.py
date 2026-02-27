"""
Comprehensive Crop database for Maharashtra with detailed agronomy data.
Organized by categories: Food grains, Pulses, Oilseeds, Fibre/Commercial, 
Horticulture (Fruits, Vegetables, Spices, Flowers), Plantation crops, Others.
"""

from ..pydantic_models import Crop, Season, SoilType


CROP_DATABASE: list[Crop] = [
    # ============================================
    # FOOD GRAINS - Cereals & Millets
    # ============================================
    Crop(
        id="1", name="Soybean", scientificName="Glycine max",
        season=[Season.KHARIF], durationDays={"min": 90, "max": 110},
        waterRequirement={"min": 450, "max": 700},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 28},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY],
        inputCostPerAcre={"min": 12000, "max": 18000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=4600, isPerishable=False
    ),
    Crop(
        id="2", name="Rice (Paddy)", scientificName="Oryza sativa",
        season=[Season.KHARIF], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 1200, "max": 2000},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.CLAY, SoilType.ALLUVIAL, SoilType.LOAMY],
        inputCostPerAcre={"min": 18000, "max": 28000}, marketPotential="High",
        yieldPerAcre={"min": 18.0, "max": 30.0, "unit": "Quintals"}, marketPricePerQuintal=2183, isPerishable=False
    ),
    Crop(
        id="3", name="Jowar (Sorghum)", scientificName="Sorghum bicolor",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 300, "max": 550},
        tempRequirement={"minC": 15, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.BLACK, SoilType.RED, SoilType.LOAMY],
        inputCostPerAcre={"min": 8000, "max": 12000}, marketPotential="Medium",
        yieldPerAcre={"min": 10.0, "max": 15.0, "unit": "Quintals"}, marketPricePerQuintal=3180, isPerishable=False
    ),
    Crop(
        id="4", name="Bajra (Pearl Millet)", scientificName="Pennisetum glaucum",
        season=[Season.KHARIF], durationDays={"min": 75, "max": 95},
        waterRequirement={"min": 250, "max": 450},
        tempRequirement={"minC": 20, "maxC": 42, "optimalC": 32},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 6000, "max": 10000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 14.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=False
    ),
    Crop(
        id="5", name="Wheat", scientificName="Triticum aestivum",
        season=[Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 10, "maxC": 30, "optimalC": 20},
        soilPreference=[SoilType.ALLUVIAL, SoilType.LOAMY, SoilType.CLAY],
        inputCostPerAcre={"min": 15000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 15.0, "max": 22.0, "unit": "Quintals"}, marketPricePerQuintal=2275, isPerishable=False
    ),
    Crop(
        id="6", name="Maize (Corn)", scientificName="Zea mays",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.BLACK],
        inputCostPerAcre={"min": 12000, "max": 18000}, marketPotential="High",
        yieldPerAcre={"min": 20.0, "max": 35.0, "unit": "Quintals"}, marketPricePerQuintal=2090, isPerishable=False
    ),
    Crop(
        id="7", name="Finger Millet (Ragi)", scientificName="Eleusine coracana",
        season=[Season.KHARIF], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 350, "max": 600},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 27},
        soilPreference=[SoilType.RED, SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 8000, "max": 12000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=3846, isPerishable=False
    ),
    Crop(
        id="8", name="Foxtail Millet", scientificName="Setaria italica",
        season=[Season.KHARIF], durationDays={"min": 75, "max": 90},
        waterRequirement={"min": 250, "max": 400},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 6000, "max": 9000}, marketPotential="Medium",
        yieldPerAcre={"min": 6.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=False
    ),
    # ============================================
    # PULSES
    # ============================================
    Crop(
        id="10", name="Tur (Pigeonpea)", scientificName="Cajanus cajan",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 350, "max": 600},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.BLACK, SoilType.RED, SoilType.LOAMY],
        inputCostPerAcre={"min": 10000, "max": 15000}, marketPotential="High",
        yieldPerAcre={"min": 5.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=7000, isPerishable=False
    ),
    Crop(
        id="11", name="Mung (Green Gram)", scientificName="Vigna radiata",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 75},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 8000, "max": 12000}, marketPotential="High",
        yieldPerAcre={"min": 4.0, "max": 7.0, "unit": "Quintals"}, marketPricePerQuintal=8558, isPerishable=False
    ),
    Crop(
        id="12", name="Urad (Black Gram)", scientificName="Vigna mungo",
        season=[Season.KHARIF], durationDays={"min": 70, "max": 90},
        waterRequirement={"min": 250, "max": 400},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.BLACK, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 8000, "max": 13000}, marketPotential="High",
        yieldPerAcre={"min": 4.0, "max": 7.0, "unit": "Quintals"}, marketPricePerQuintal=7400, isPerishable=False
    ),
    Crop(
        id="13", name="Gram (Chickpea)", scientificName="Cicer arietinum",
        season=[Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 10, "maxC": 30, "optimalC": 22},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY, SoilType.CLAY],
        inputCostPerAcre={"min": 10000, "max": 16000}, marketPotential="High",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=5440, isPerishable=False
    ),
    Crop(
        id="14", name="Cowpea (Lobia)", scientificName="Vigna unguiculata",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY],
        inputCostPerAcre={"min": 6000, "max": 10000}, marketPotential="Medium",
        yieldPerAcre={"min": 5.0, "max": 8.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    Crop(
        id="15", name="Horse Gram (Kulthi)", scientificName="Macrotyloma uniflorum",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 150, "max": 350},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.RED, SoilType.SANDY, SoilType.LOAMY],
        inputCostPerAcre={"min": 5000, "max": 8000}, marketPotential="Low",
        yieldPerAcre={"min": 4.0, "max": 6.0, "unit": "Quintals"}, marketPricePerQuintal=4000, isPerishable=False
    ),
    # ============================================
    # OILSEEDS
    # ============================================
    Crop(
        id="20", name="Groundnut", scientificName="Arachis hypogaea",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 20, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 15000, "max": 22000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Quintals"}, marketPricePerQuintal=6377, isPerishable=False
    ),
    Crop(
        id="21", name="Sunflower", scientificName="Helianthus annuus",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 80, "max": 110},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 26},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 10000, "max": 15000}, marketPotential="Medium",
        yieldPerAcre={"min": 5.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=6760, isPerishable=False
    ),
    Crop(
        id="22", name="Safflower (Kardi)", scientificName="Carthamus tinctorius",
        season=[Season.RABI], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 10, "maxC": 32, "optimalC": 22},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY],
        inputCostPerAcre={"min": 8000, "max": 12000}, marketPotential="Medium",
        yieldPerAcre={"min": 4.0, "max": 8.0, "unit": "Quintals"}, marketPricePerQuintal=5800, isPerishable=False
    ),
    Crop(
        id="23", name="Mustard", scientificName="Brassica juncea",
        season=[Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.CLAY],
        inputCostPerAcre={"min": 10000, "max": 15000}, marketPotential="Medium",
        yieldPerAcre={"min": 6.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=5650, isPerishable=False
    ),
    Crop(
        id="24", name="Sesame (Til)", scientificName="Sesamum indicum",
        season=[Season.KHARIF], durationDays={"min": 80, "max": 100},
        waterRequirement={"min": 250, "max": 400},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.BLACK],
        inputCostPerAcre={"min": 6000, "max": 10000}, marketPotential="High",
        yieldPerAcre={"min": 2.0, "max": 4.0, "unit": "Quintals"}, marketPricePerQuintal=9000, isPerishable=False
    ),
    Crop(
        id="25", name="Castor", scientificName="Ricinus communis",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 300, "max": 550},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.BLACK],
        inputCostPerAcre={"min": 8000, "max": 14000}, marketPotential="Medium",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=6170, isPerishable=False
    ),
    # ============================================
    # FIBRE & COMMERCIAL CROPS
    # ============================================
    Crop(
        id="30", name="Cotton", scientificName="Gossypium",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 180},
        waterRequirement={"min": 700, "max": 1200},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 32},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY],
        inputCostPerAcre={"min": 20000, "max": 35000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=6620, isPerishable=False
    ),
    Crop(
        id="31", name="Sugarcane", scientificName="Saccharum officinarum",
        season=[Season.ANNUAL], durationDays={"min": 365, "max": 450},
        waterRequirement={"min": 1500, "max": 2500},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.BLACK, SoilType.ALLUVIAL, SoilType.LOAMY],
        inputCostPerAcre={"min": 45000, "max": 65000}, marketPotential="Medium",
        yieldPerAcre={"min": 40.0, "max": 60.0, "unit": "Tonnes"}, marketPricePerQuintal=315, isPerishable=True
    ),
    Crop(
        id="32", name="Tobacco", scientificName="Nicotiana tabacum",
        season=[Season.RABI], durationDays={"min": 90, "max": 130},
        waterRequirement={"min": 400, "max": 600},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 40000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Quintals"}, marketPricePerQuintal=12000, isPerishable=False
    ),
    # ============================================
    # FRUITS
    # ============================================
    Crop(
        id="40", name="Mango", scientificName="Mangifera indica",
        season=[Season.ANNUAL], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 20, "maxC": 42, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.RED],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="High",
        yieldPerAcre={"min": 4.0, "max": 10.0, "unit": "Tonnes"}, marketPricePerQuintal=4000, isPerishable=True
    ),
    Crop(
        id="41", name="Banana", scientificName="Musa",
        season=[Season.ANNUAL], durationDays={"min": 300, "max": 365},
        waterRequirement={"min": 1800, "max": 2500},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.CLAY],
        inputCostPerAcre={"min": 60000, "max": 100000}, marketPotential="High",
        yieldPerAcre={"min": 25.0, "max": 50.0, "unit": "Tonnes"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="42", name="Orange (Nagpur Santra)", scientificName="Citrus sinensis",
        season=[Season.ANNUAL], durationDays={"min": 240, "max": 300},
        waterRequirement={"min": 900, "max": 1400},
        tempRequirement={"minC": 15, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 40000, "max": 70000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 20.0, "unit": "Tonnes"}, marketPricePerQuintal=3500, isPerishable=True
    ),
    Crop(
        id="43", name="Grapes", scientificName="Vitis vinifera",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 500, "max": 900},
        tempRequirement={"minC": 15, "maxC": 38, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 80000, "max": 150000}, marketPotential="High",
        yieldPerAcre={"min": 10.0, "max": 25.0, "unit": "Tonnes"}, marketPricePerQuintal=8000, isPerishable=True
    ),
    Crop(
        id="44", name="Pomegranate", scientificName="Punica granatum",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 210},
        waterRequirement={"min": 400, "max": 700},
        tempRequirement={"minC": 15, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.BLACK],
        inputCostPerAcre={"min": 50000, "max": 90000}, marketPotential="High",
        yieldPerAcre={"min": 6.0, "max": 15.0, "unit": "Tonnes"}, marketPricePerQuintal=10000, isPerishable=True
    ),
    Crop(
        id="45", name="Sapota (Chiku)", scientificName="Manilkara zapota",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 800, "max": 1200},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 30000, "max": 50000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 18.0, "unit": "Tonnes"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    Crop(
        id="46", name="Papaya", scientificName="Carica papaya",
        season=[Season.ANNUAL], durationDays={"min": 270, "max": 365},
        waterRequirement={"min": 1200, "max": 1800},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.SANDY],
        inputCostPerAcre={"min": 40000, "max": 70000}, marketPotential="High",
        yieldPerAcre={"min": 30.0, "max": 60.0, "unit": "Tonnes"}, marketPricePerQuintal=2500, isPerishable=True
    ),
    Crop(
        id="47", name="Guava", scientificName="Psidium guajava",
        season=[Season.ANNUAL], durationDays={"min": 150, "max": 180},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 15, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.RED],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 10.0, "max": 25.0, "unit": "Tonnes"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    # ============================================
    # VEGETABLES
    # ============================================
    Crop(
        id="50", name="Onion", scientificName="Allium cepa",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 12, "maxC": 32, "optimalC": 22},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.SANDY],
        inputCostPerAcre={"min": 35000, "max": 55000}, marketPotential="High",
        yieldPerAcre={"min": 100.0, "max": 200.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="51", name="Tomato", scientificName="Solanum lycopersicum",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 110},
        waterRequirement={"min": 400, "max": 600},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 30000, "max": 50000}, marketPotential="High",
        yieldPerAcre={"min": 150.0, "max": 350.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=True
    ),
    Crop(
        id="52", name="Potato", scientificName="Solanum tuberosum",
        season=[Season.RABI], durationDays={"min": 80, "max": 110},
        waterRequirement={"min": 400, "max": 600},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 40000, "max": 60000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="53", name="Brinjal (Eggplant)", scientificName="Solanum melongena",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 400, "max": 700},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.BLACK, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 40000}, marketPotential="Medium",
        yieldPerAcre={"min": 100.0, "max": 200.0, "unit": "Quintals"}, marketPricePerQuintal=1800, isPerishable=True
    ),
    Crop(
        id="54", name="Chilli", scientificName="Capsicum annuum",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.BLACK, SoilType.RED],
        inputCostPerAcre={"min": 30000, "max": 50000}, marketPotential="High",
        yieldPerAcre={"min": 30.0, "max": 60.0, "unit": "Quintals"}, marketPricePerQuintal=8000, isPerishable=True
    ),
    Crop(
        id="55", name="Okra (Bhindi)", scientificName="Abelmoschus esculentus",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 20000, "max": 35000}, marketPotential="Medium",
        yieldPerAcre={"min": 50.0, "max": 100.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=True
    ),
    Crop(
        id="56", name="Cabbage", scientificName="Brassica oleracea var. capitata",
        season=[Season.RABI], durationDays={"min": 80, "max": 110},
        waterRequirement={"min": 350, "max": 500},
        tempRequirement={"minC": 10, "maxC": 25, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 40000}, marketPotential="Medium",
        yieldPerAcre={"min": 100.0, "max": 200.0, "unit": "Quintals"}, marketPricePerQuintal=1200, isPerishable=True
    ),
    Crop(
        id="57", name="Cauliflower", scientificName="Brassica oleracea var. botrytis",
        season=[Season.RABI], durationDays={"min": 80, "max": 120},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 10, "maxC": 26, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 30000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="58", name="Bottle Gourd (Lauki)", scientificName="Lagenaria siceraria",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 15000, "max": 25000}, marketPotential="Medium",
        yieldPerAcre={"min": 100.0, "max": 180.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="59", name="Bitter Gourd (Karela)", scientificName="Momordica charantia",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 55, "max": 75},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 22, "maxC": 40, "optimalC": 32},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 18000, "max": 30000}, marketPotential="Medium",
        yieldPerAcre={"min": 40.0, "max": 80.0, "unit": "Quintals"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    # ============================================
    # SPICES
    # ============================================
    Crop(
        id="60", name="Turmeric (Haldi)", scientificName="Curcuma longa",
        season=[Season.KHARIF], durationDays={"min": 240, "max": 300},
        waterRequirement={"min": 1200, "max": 1800},
        tempRequirement={"minC": 20, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 50000, "max": 80000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=7000, isPerishable=False
    ),
    Crop(
        id="61", name="Ginger", scientificName="Zingiber officinale",
        season=[Season.KHARIF], durationDays={"min": 210, "max": 270},
        waterRequirement={"min": 1500, "max": 2200},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 60000, "max": 100000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=True
    ),
    Crop(
        id="62", name="Garlic", scientificName="Allium sativum",
        season=[Season.RABI], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 12, "maxC": 30, "optimalC": 20},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.SANDY],
        inputCostPerAcre={"min": 40000, "max": 60000}, marketPotential="High",
        yieldPerAcre={"min": 40.0, "max": 80.0, "unit": "Quintals"}, marketPricePerQuintal=8000, isPerishable=False
    ),
    Crop(
        id="63", name="Coriander", scientificName="Coriandrum sativum",
        season=[Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.BLACK, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 12000, "max": 20000}, marketPotential="Medium",
        yieldPerAcre={"min": 4.0, "max": 8.0, "unit": "Quintals"}, marketPricePerQuintal=6000, isPerishable=False
    ),
    Crop(
        id="64", name="Cumin (Jeera)", scientificName="Cuminum cyminum",
        season=[Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 150, "max": 300},
        tempRequirement={"minC": 8, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 15000, "max": 25000}, marketPotential="High",
        yieldPerAcre={"min": 3.0, "max": 6.0, "unit": "Quintals"}, marketPricePerQuintal=20000, isPerishable=False
    ),
    Crop(
        id="65", name="Fenugreek (Methi)", scientificName="Trigonella foenum-graecum",
        season=[Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 10000, "max": 18000}, marketPotential="Medium",
        yieldPerAcre={"min": 5.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    # ============================================
    # FLOWERS
    # ============================================
    Crop(
        id="70", name="Marigold", scientificName="Tagetes",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 75, "max": 100},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 40000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Tonnes"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    Crop(
        id="71", name="Rose", scientificName="Rosa",
        season=[Season.ANNUAL], durationDays={"min": 120, "max": 180},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 12, "maxC": 32, "optimalC": 22},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY],
        inputCostPerAcre={"min": 50000, "max": 100000}, marketPotential="High",
        yieldPerAcre={"min": 5.0, "max": 12.0, "unit": "Tonnes"}, marketPricePerQuintal=15000, isPerishable=True
    ),
    Crop(
        id="72", name="Jasmine", scientificName="Jasminum",
        season=[Season.ANNUAL], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 40000, "max": 70000}, marketPotential="High",
        yieldPerAcre={"min": 3.0, "max": 6.0, "unit": "Tonnes"}, marketPricePerQuintal=20000, isPerishable=True
    ),
    Crop(
        id="73", name="Tuberose", scientificName="Polianthes tuberosa",
        season=[Season.KHARIF], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 45000, "max": 75000}, marketPotential="Medium",
        yieldPerAcre={"min": 4.0, "max": 8.0, "unit": "Tonnes"}, marketPricePerQuintal=12000, isPerishable=True
    ),
    Crop(
        id="74", name="Chrysanthemum", scientificName="Chrysanthemum",
        season=[Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 400, "max": 600},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 35000, "max": 60000}, marketPotential="Medium",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Tonnes"}, marketPricePerQuintal=8000, isPerishable=True
    ),
    # ============================================
    # PLANTATION CROPS
    # ============================================
    Crop(
        id="80", name="Cashew", scientificName="Anacardium occidentale",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 1000, "max": 1600},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.SANDY, SoilType.RED, SoilType.LOAMY],
        inputCostPerAcre={"min": 20000, "max": 35000}, marketPotential="High",
        yieldPerAcre={"min": 4.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=12000, isPerishable=False
    ),
    Crop(
        id="81", name="Coconut", scientificName="Cocos nucifera",
        season=[Season.ANNUAL], durationDays={"min": 300, "max": 365},
        waterRequirement={"min": 1200, "max": 2000},
        tempRequirement={"minC": 20, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="High",
        yieldPerAcre={"min": 8000.0, "max": 15000.0, "unit": "Nuts"}, marketPricePerQuintal=2000, isPerishable=False
    ),
    Crop(
        id="82", name="Arecanut", scientificName="Areca catechu",
        season=[Season.ANNUAL], durationDays={"min": 300, "max": 365},
        waterRequirement={"min": 1500, "max": 2200},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 30000, "max": 55000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Quintals"}, marketPricePerQuintal=40000, isPerishable=False
    ),
    Crop(
        id="83", name="Cocoa", scientificName="Theobroma cacao",
        season=[Season.ANNUAL], durationDays={"min": 300, "max": 365},
        waterRequirement={"min": 1500, "max": 2500},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 26},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 35000, "max": 60000}, marketPotential="Medium",
        yieldPerAcre={"min": 3.0, "max": 8.0, "unit": "Quintals"}, marketPricePerQuintal=8000, isPerishable=False
    ),
    # ============================================
    # MEDICINAL & AROMATIC PLANTS
    # ============================================
    Crop(
        id="90", name="Ashwagandha", scientificName="Withania somnifera",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 180},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 12000, "max": 20000}, marketPotential="High",
        yieldPerAcre={"min": 4.0, "max": 7.0, "unit": "Quintals"}, marketPricePerQuintal=15000, isPerishable=False
    ),
    Crop(
        id="91", name="Lemongrass", scientificName="Cymbopogon citratus",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 15000, "max": 25000}, marketPotential="Medium",
        yieldPerAcre={"min": 50.0, "max": 100.0, "unit": "Kg Oil"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    Crop(
        id="92", name="Tulsi (Holy Basil)", scientificName="Ocimum tenuiflorum",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 10000, "max": 18000}, marketPotential="Medium",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    Crop(
        id="93", name="Aloe Vera", scientificName="Aloe barbadensis miller",
        season=[Season.ANNUAL], durationDays={"min": 240, "max": 365},
        waterRequirement={"min": 200, "max": 450},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY],
        inputCostPerAcre={"min": 15000, "max": 28000}, marketPotential="High",
        yieldPerAcre={"min": 150.0, "max": 300.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    # ============================================
    # FODDER CROPS
    # ============================================
    Crop(
        id="95", name="Fodder Sorghum", scientificName="Sorghum bicolor",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 250, "max": 450},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.BLACK, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 5000, "max": 10000}, marketPotential="Medium",
        yieldPerAcre={"min": 200.0, "max": 400.0, "unit": "Quintals"}, marketPricePerQuintal=500, isPerishable=True
    ),
    Crop(
        id="96", name="Berseem", scientificName="Trifolium alexandrinum",
        season=[Season.RABI], durationDays={"min": 120, "max": 180},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 8, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 8000, "max": 15000}, marketPotential="Medium",
        yieldPerAcre={"min": 300.0, "max": 500.0, "unit": "Quintals"}, marketPricePerQuintal=600, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Citrus Fruits
    # ============================================
    Crop(
        id="100", name="Lemon (Nimbu)", scientificName="Citrus limon",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 270},
        waterRequirement={"min": 700, "max": 1100},
        tempRequirement={"minC": 15, "maxC": 38, "optimalC": 26},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.SANDY],
        inputCostPerAcre={"min": 35000, "max": 60000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Tonnes"}, marketPricePerQuintal=4000, isPerishable=True
    ),
    Crop(
        id="101", name="Sweet Lime (Mosambi)", scientificName="Citrus limetta",
        season=[Season.ANNUAL], durationDays={"min": 200, "max": 280},
        waterRequirement={"min": 800, "max": 1300},
        tempRequirement={"minC": 15, "maxC": 38, "optimalC": 27},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 40000, "max": 70000}, marketPotential="High",
        yieldPerAcre={"min": 10.0, "max": 20.0, "unit": "Tonnes"}, marketPricePerQuintal=3500, isPerishable=True
    ),
    Crop(
        id="102", name="Custard Apple (Sitaphal)", scientificName="Annona squamosa",
        season=[Season.ANNUAL], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.BLACK],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 4.0, "max": 8.0, "unit": "Tonnes"}, marketPricePerQuintal=5000, isPerishable=True
    ),
    Crop(
        id="103", name="Fig (Anjeer)", scientificName="Ficus carica",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 400, "max": 700},
        tempRequirement={"minC": 15, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.BLACK],
        inputCostPerAcre={"min": 50000, "max": 90000}, marketPotential="High",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Tonnes"}, marketPricePerQuintal=12000, isPerishable=True
    ),
    Crop(
        id="104", name="Ber (Indian Jujube)", scientificName="Ziziphus mauritiana",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 300, "max": 600},
        tempRequirement={"minC": 15, "maxC": 45, "optimalC": 32},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 20000, "max": 40000}, marketPotential="Medium",
        yieldPerAcre={"min": 8.0, "max": 15.0, "unit": "Tonnes"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    Crop(
        id="105", name="Jamun (Java Plum)", scientificName="Syzygium cumini",
        season=[Season.ANNUAL], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 700, "max": 1100},
        tempRequirement={"minC": 18, "maxC": 42, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.BLACK],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Tonnes"}, marketPricePerQuintal=4000, isPerishable=True
    ),
    Crop(
        id="106", name="Amla (Indian Gooseberry)", scientificName="Phyllanthus emblica",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 240},
        waterRequirement={"min": 500, "max": 900},
        tempRequirement={"minC": 15, "maxC": 45, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 30000, "max": 55000}, marketPotential="High",
        yieldPerAcre={"min": 8.0, "max": 18.0, "unit": "Tonnes"}, marketPricePerQuintal=3500, isPerishable=True
    ),
    Crop(
        id="107", name="Tamarind (Imli)", scientificName="Tamarindus indica",
        season=[Season.ANNUAL], durationDays={"min": 240, "max": 365},
        waterRequirement={"min": 400, "max": 800},
        tempRequirement={"minC": 18, "maxC": 45, "optimalC": 32},
        soilPreference=[SoilType.BLACK, SoilType.RED, SoilType.LOAMY],
        inputCostPerAcre={"min": 20000, "max": 40000}, marketPotential="Medium",
        yieldPerAcre={"min": 10.0, "max": 25.0, "unit": "Tonnes"}, marketPricePerQuintal=6000, isPerishable=False
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Melons & Gourds
    # ============================================
    Crop(
        id="110", name="Watermelon (Tarbooz)", scientificName="Citrullus lanatus",
        season=[Season.ZAID, Season.KHARIF], durationDays={"min": 70, "max": 95},
        waterRequirement={"min": 400, "max": 700},
        tempRequirement={"minC": 22, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="High",
        yieldPerAcre={"min": 150.0, "max": 300.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="111", name="Muskmelon (Kharbooja)", scientificName="Cucumis melo",
        season=[Season.ZAID, Season.KHARIF], durationDays={"min": 60, "max": 85},
        waterRequirement={"min": 350, "max": 600},
        tempRequirement={"minC": 22, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY],
        inputCostPerAcre={"min": 22000, "max": 40000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="112", name="Cucumber (Kakdi)", scientificName="Cucumis sativus",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 50, "max": 70},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 18000, "max": 32000}, marketPotential="Medium",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="113", name="Pumpkin (Kaddu)", scientificName="Cucurbita moschata",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 15000, "max": 28000}, marketPotential="Medium",
        yieldPerAcre={"min": 100.0, "max": 200.0, "unit": "Quintals"}, marketPricePerQuintal=1200, isPerishable=True
    ),
    Crop(
        id="114", name="Ridge Gourd (Turai)", scientificName="Luffa acutangula",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 55, "max": 75},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 16000, "max": 28000}, marketPotential="Medium",
        yieldPerAcre={"min": 50.0, "max": 100.0, "unit": "Quintals"}, marketPricePerQuintal=1800, isPerishable=True
    ),
    Crop(
        id="115", name="Snake Gourd (Padwal)", scientificName="Trichosanthes cucumerina",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 60, "max": 80},
        waterRequirement={"min": 400, "max": 600},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 15000, "max": 26000}, marketPotential="Medium",
        yieldPerAcre={"min": 60.0, "max": 120.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="116", name="Sponge Gourd (Gilki)", scientificName="Luffa cylindrica",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 50, "max": 70},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 14000, "max": 25000}, marketPotential="Medium",
        yieldPerAcre={"min": 60.0, "max": 120.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="117", name="Ash Gourd (Petha)", scientificName="Benincasa hispida",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 15000, "max": 28000}, marketPotential="Medium",
        yieldPerAcre={"min": 120.0, "max": 250.0, "unit": "Quintals"}, marketPricePerQuintal=1200, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Leafy Vegetables
    # ============================================
    Crop(
        id="120", name="Spinach (Palak)", scientificName="Spinacia oleracea",
        season=[Season.RABI, Season.KHARIF], durationDays={"min": 35, "max": 50},
        waterRequirement={"min": 250, "max": 400},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 12000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 60.0, "max": 100.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="121", name="Amaranth (Rajgira/Chaulai)", scientificName="Amaranthus",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 30, "max": 45},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 10000, "max": 18000}, marketPotential="Medium",
        yieldPerAcre={"min": 50.0, "max": 90.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="122", name="Fenugreek Leaves (Methi)", scientificName="Trigonella foenum-graecum",
        season=[Season.RABI], durationDays={"min": 25, "max": 40},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 12000, "max": 20000}, marketPotential="Medium",
        yieldPerAcre={"min": 40.0, "max": 70.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="123", name="Drumstick (Moringa)", scientificName="Moringa oleifera",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 300},
        waterRequirement={"min": 400, "max": 700},
        tempRequirement={"minC": 20, "maxC": 45, "optimalC": 32},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.RED],
        inputCostPerAcre={"min": 20000, "max": 40000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=4000, isPerishable=True
    ),
    Crop(
        id="124", name="Curry Leaf (Kadi Patta)", scientificName="Murraya koenigii",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 365},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 18, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="High",
        yieldPerAcre={"min": 30.0, "max": 60.0, "unit": "Quintals"}, marketPricePerQuintal=8000, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Root Vegetables
    # ============================================
    Crop(
        id="130", name="Carrot (Gajar)", scientificName="Daucus carota",
        season=[Season.RABI], durationDays={"min": 80, "max": 110},
        waterRequirement={"min": 350, "max": 500},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 40000}, marketPotential="High",
        yieldPerAcre={"min": 100.0, "max": 180.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="131", name="Radish (Mooli)", scientificName="Raphanus sativus",
        season=[Season.RABI, Season.KHARIF], durationDays={"min": 30, "max": 55},
        waterRequirement={"min": 250, "max": 400},
        tempRequirement={"minC": 10, "maxC": 30, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 15000, "max": 28000}, marketPotential="Medium",
        yieldPerAcre={"min": 100.0, "max": 200.0, "unit": "Quintals"}, marketPricePerQuintal=1200, isPerishable=True
    ),
    Crop(
        id="132", name="Beetroot (Chukandar)", scientificName="Beta vulgaris",
        season=[Season.RABI], durationDays={"min": 70, "max": 100},
        waterRequirement={"min": 300, "max": 450},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 20000, "max": 35000}, marketPotential="Medium",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=1500, isPerishable=True
    ),
    Crop(
        id="133", name="Sweet Potato (Shakarkand)", scientificName="Ipomoea batatas",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 100, "max": 140},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 18000, "max": 32000}, marketPotential="Medium",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=1800, isPerishable=True
    ),
    Crop(
        id="134", name="Colocasia (Arbi/Taro)", scientificName="Colocasia esculenta",
        season=[Season.KHARIF], durationDays={"min": 150, "max": 200},
        waterRequirement={"min": 800, "max": 1200},
        tempRequirement={"minC": 20, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 60.0, "max": 120.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Legumes & Beans
    # ============================================
    Crop(
        id="140", name="Green Peas (Matar)", scientificName="Pisum sativum",
        season=[Season.RABI], durationDays={"min": 70, "max": 100},
        waterRequirement={"min": 300, "max": 450},
        tempRequirement={"minC": 10, "maxC": 25, "optimalC": 16},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 30000, "max": 50000}, marketPotential="High",
        yieldPerAcre={"min": 40.0, "max": 80.0, "unit": "Quintals"}, marketPricePerQuintal=4000, isPerishable=True
    ),
    Crop(
        id="141", name="French Beans (Farasbi)", scientificName="Phaseolus vulgaris",
        season=[Season.RABI, Season.KHARIF], durationDays={"min": 50, "max": 75},
        waterRequirement={"min": 350, "max": 500},
        tempRequirement={"minC": 15, "maxC": 30, "optimalC": 22},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="High",
        yieldPerAcre={"min": 50.0, "max": 100.0, "unit": "Quintals"}, marketPricePerQuintal=3500, isPerishable=True
    ),
    Crop(
        id="142", name="Cluster Beans (Guar)", scientificName="Cyamopsis tetragonoloba",
        season=[Season.KHARIF], durationDays={"min": 80, "max": 120},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 22, "maxC": 42, "optimalC": 32},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY],
        inputCostPerAcre={"min": 8000, "max": 15000}, marketPotential="High",
        yieldPerAcre={"min": 6.0, "max": 12.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    Crop(
        id="143", name="Lentil (Masoor)", scientificName="Lens culinaris",
        season=[Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.BLACK],
        inputCostPerAcre={"min": 10000, "max": 18000}, marketPotential="High",
        yieldPerAcre={"min": 5.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=6000, isPerishable=False
    ),
    Crop(
        id="144", name="Moth Bean (Matki)", scientificName="Vigna aconitifolia",
        season=[Season.KHARIF], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 150, "max": 300},
        tempRequirement={"minC": 20, "maxC": 42, "optimalC": 32},
        soilPreference=[SoilType.SANDY, SoilType.LOAMY, SoilType.RED],
        inputCostPerAcre={"min": 6000, "max": 12000}, marketPotential="Medium",
        yieldPerAcre={"min": 3.0, "max": 6.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    Crop(
        id="145", name="Field Bean (Val/Sem)", scientificName="Lablab purpureus",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 90, "max": 150},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.BLACK],
        inputCostPerAcre={"min": 12000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 40.0, "max": 80.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Spices & Condiments
    # ============================================
    Crop(
        id="150", name="Mint (Pudina)", scientificName="Mentha",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 20000, "max": 35000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=True
    ),
    Crop(
        id="151", name="Fennel (Saunf)", scientificName="Foeniculum vulgare",
        season=[Season.RABI], durationDays={"min": 130, "max": 170},
        waterRequirement={"min": 300, "max": 500},
        tempRequirement={"minC": 10, "maxC": 30, "optimalC": 20},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.BLACK],
        inputCostPerAcre={"min": 15000, "max": 28000}, marketPotential="High",
        yieldPerAcre={"min": 5.0, "max": 10.0, "unit": "Quintals"}, marketPricePerQuintal=8000, isPerishable=False
    ),
    Crop(
        id="152", name="Ajwain (Carom Seeds)", scientificName="Trachyspermum ammi",
        season=[Season.RABI], durationDays={"min": 120, "max": 150},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 10, "maxC": 30, "optimalC": 20},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 12000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 3.0, "max": 6.0, "unit": "Quintals"}, marketPricePerQuintal=10000, isPerishable=False
    ),
    Crop(
        id="153", name="Black Pepper (Kali Mirch)", scientificName="Piper nigrum",
        season=[Season.ANNUAL], durationDays={"min": 240, "max": 365},
        waterRequirement={"min": 1500, "max": 2500},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 27},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 80000, "max": 150000}, marketPotential="High",
        yieldPerAcre={"min": 2.0, "max": 5.0, "unit": "Quintals"}, marketPricePerQuintal=50000, isPerishable=False
    ),
    Crop(
        id="154", name="Cardamom (Elaichi)", scientificName="Elettaria cardamomum",
        season=[Season.ANNUAL], durationDays={"min": 300, "max": 365},
        waterRequirement={"min": 1500, "max": 2500},
        tempRequirement={"minC": 15, "maxC": 32, "optimalC": 24},
        soilPreference=[SoilType.LOAMY, SoilType.CLAY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 100000, "max": 200000}, marketPotential="High",
        yieldPerAcre={"min": 0.8, "max": 2.0, "unit": "Quintals"}, marketPricePerQuintal=200000, isPerishable=False
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Oilseeds & Commercial
    # ============================================
    Crop(
        id="160", name="Flax (Linseed/Javasu)", scientificName="Linum usitatissimum",
        season=[Season.RABI], durationDays={"min": 100, "max": 130},
        waterRequirement={"min": 200, "max": 400},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.BLACK, SoilType.CLAY],
        inputCostPerAcre={"min": 8000, "max": 15000}, marketPotential="Medium",
        yieldPerAcre={"min": 4.0, "max": 8.0, "unit": "Quintals"}, marketPricePerQuintal=5500, isPerishable=False
    ),
    Crop(
        id="161", name="Niger (Karale)", scientificName="Guizotia abyssinica",
        season=[Season.KHARIF], durationDays={"min": 90, "max": 120},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 15, "maxC": 32, "optimalC": 25},
        soilPreference=[SoilType.RED, SoilType.LOAMY, SoilType.BLACK],
        inputCostPerAcre={"min": 6000, "max": 12000}, marketPotential="Medium",
        yieldPerAcre={"min": 2.0, "max": 5.0, "unit": "Quintals"}, marketPricePerQuintal=5941, isPerishable=False
    ),
    Crop(
        id="162", name="Jute (San)", scientificName="Corchorus",
        season=[Season.KHARIF], durationDays={"min": 100, "max": 150},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 22, "maxC": 40, "optimalC": 32},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.CLAY],
        inputCostPerAcre={"min": 12000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 15.0, "max": 25.0, "unit": "Quintals"}, marketPricePerQuintal=3500, isPerishable=False
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Small Fruits
    # ============================================
    Crop(
        id="170", name="Strawberry", scientificName="Fragaria × ananassa",
        season=[Season.RABI], durationDays={"min": 90, "max": 150},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 8, "maxC": 25, "optimalC": 16},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 150000, "max": 300000}, marketPotential="High",
        yieldPerAcre={"min": 60.0, "max": 120.0, "unit": "Quintals"}, marketPricePerQuintal=25000, isPerishable=True
    ),
    Crop(
        id="171", name="Mulberry", scientificName="Morus",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 365},
        waterRequirement={"min": 600, "max": 1000},
        tempRequirement={"minC": 15, "maxC": 38, "optimalC": 26},
        soilPreference=[SoilType.LOAMY, SoilType.RED, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 30000, "max": 55000}, marketPotential="Medium",
        yieldPerAcre={"min": 15.0, "max": 30.0, "unit": "Tonnes"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Other Vegetables
    # ============================================
    Crop(
        id="175", name="Capsicum (Shimla Mirch)", scientificName="Capsicum annuum",
        season=[Season.RABI, Season.KHARIF], durationDays={"min": 80, "max": 120},
        waterRequirement={"min": 400, "max": 650},
        tempRequirement={"minC": 15, "maxC": 35, "optimalC": 25},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 45000, "max": 80000}, marketPotential="High",
        yieldPerAcre={"min": 80.0, "max": 150.0, "unit": "Quintals"}, marketPricePerQuintal=5000, isPerishable=True
    ),
    Crop(
        id="176", name="Ivy Gourd (Tondli)", scientificName="Coccinia grandis",
        season=[Season.KHARIF, Season.RABI], durationDays={"min": 60, "max": 90},
        waterRequirement={"min": 350, "max": 550},
        tempRequirement={"minC": 18, "maxC": 38, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY],
        inputCostPerAcre={"min": 18000, "max": 32000}, marketPotential="Medium",
        yieldPerAcre={"min": 50.0, "max": 100.0, "unit": "Quintals"}, marketPricePerQuintal=2000, isPerishable=True
    ),
    Crop(
        id="177", name="Pointed Gourd (Parwal)", scientificName="Trichosanthes dioica",
        season=[Season.KHARIF, Season.ZAID], durationDays={"min": 90, "max": 150},
        waterRequirement={"min": 500, "max": 800},
        tempRequirement={"minC": 20, "maxC": 40, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.SANDY],
        inputCostPerAcre={"min": 25000, "max": 45000}, marketPotential="Medium",
        yieldPerAcre={"min": 60.0, "max": 120.0, "unit": "Quintals"}, marketPricePerQuintal=2500, isPerishable=True
    ),
    Crop(
        id="178", name="Dill (Suva/Shepu)", scientificName="Anethum graveolens",
        season=[Season.RABI], durationDays={"min": 40, "max": 60},
        waterRequirement={"min": 200, "max": 350},
        tempRequirement={"minC": 10, "maxC": 28, "optimalC": 18},
        soilPreference=[SoilType.LOAMY, SoilType.SANDY, SoilType.ALLUVIAL],
        inputCostPerAcre={"min": 12000, "max": 22000}, marketPotential="Medium",
        yieldPerAcre={"min": 30.0, "max": 60.0, "unit": "Quintals"}, marketPricePerQuintal=3000, isPerishable=True
    ),
    # ============================================
    # ADDITIONAL MAHARASHTRA CROPS - Plantation/Tree Crops
    # ============================================
    Crop(
        id="180", name="Betel Leaf (Paan)", scientificName="Piper betle",
        season=[Season.ANNUAL], durationDays={"min": 180, "max": 365},
        waterRequirement={"min": 1200, "max": 1800},
        tempRequirement={"minC": 18, "maxC": 35, "optimalC": 26},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.CLAY],
        inputCostPerAcre={"min": 80000, "max": 150000}, marketPotential="High",
        yieldPerAcre={"min": 40.0, "max": 80.0, "unit": "Lakh Leaves"}, marketPricePerQuintal=50000, isPerishable=True
    ),
    Crop(
        id="181", name="Bamboo", scientificName="Bambusoideae",
        season=[Season.ANNUAL], durationDays={"min": 365, "max": 730},
        waterRequirement={"min": 1000, "max": 2000},
        tempRequirement={"minC": 15, "maxC": 40, "optimalC": 28},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.RED],
        inputCostPerAcre={"min": 25000, "max": 50000}, marketPotential="High",
        yieldPerAcre={"min": 10.0, "max": 25.0, "unit": "Tonnes"}, marketPricePerQuintal=5000, isPerishable=False
    ),
    Crop(
        id="182", name="Teak (Sagwan)", scientificName="Tectona grandis",
        season=[Season.ANNUAL], durationDays={"min": 365, "max": 730},
        waterRequirement={"min": 1200, "max": 2000},
        tempRequirement={"minC": 15, "maxC": 42, "optimalC": 30},
        soilPreference=[SoilType.LOAMY, SoilType.ALLUVIAL, SoilType.BLACK],
        inputCostPerAcre={"min": 40000, "max": 80000}, marketPotential="High",
        yieldPerAcre={"min": 3.0, "max": 8.0, "unit": "Cubic Meters"}, marketPricePerQuintal=80000, isPerishable=False
    ),
]
