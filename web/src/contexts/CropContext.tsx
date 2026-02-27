"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ref, set, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';

const NODE_ID = "field01";

export interface Crop {
    id: string;
    name: string;
    icon: string;
    min: number;   // soil moisture min %
    max: number;   // soil moisture max %
}

interface CropContextType {
    selectedCrop: Crop;
    setSelectedCrop: (crop: Crop) => void;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

// All 90 crops with icons and soil moisture thresholds
export const crops: Crop[] = [
    // Cereals
    { id: 'rice', name: 'Rice', icon: '🌾', min: 60, max: 90 },
    { id: 'wheat', name: 'Wheat', icon: '🌾', min: 40, max: 60 },
    { id: 'maize', name: 'Maize', icon: '🌽', min: 50, max: 70 },
    { id: 'barley', name: 'Barley', icon: '🌾', min: 35, max: 55 },
    { id: 'oats', name: 'Oats', icon: '🌾', min: 40, max: 60 },
    { id: 'sorghum', name: 'Sorghum', icon: '🌾', min: 35, max: 60 },
    { id: 'millet', name: 'Millet', icon: '🌾', min: 30, max: 50 },
    // Oilseeds
    { id: 'soybean', name: 'Soybean', icon: '🫘', min: 55, max: 75 },
    { id: 'groundnut', name: 'Groundnut', icon: '🥜', min: 50, max: 70 },
    { id: 'sunflower', name: 'Sunflower', icon: '🌻', min: 45, max: 65 },
    // Cash Crops
    { id: 'cotton', name: 'Cotton', icon: '☁️', min: 55, max: 75 },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', min: 65, max: 85 },
    // Vegetables
    { id: 'potato', name: 'Potato', icon: '🥔', min: 60, max: 75 },
    { id: 'tomato', name: 'Tomato', icon: '🍅', min: 65, max: 85 },
    { id: 'onion', name: 'Onion', icon: '🧅', min: 50, max: 70 },
    { id: 'garlic', name: 'Garlic', icon: '🧄', min: 45, max: 65 },
    { id: 'carrot', name: 'Carrot', icon: '🥕', min: 55, max: 75 },
    { id: 'cabbage', name: 'Cabbage', icon: '🥬', min: 60, max: 80 },
    { id: 'cauliflower', name: 'Cauliflower', icon: '🥦', min: 60, max: 80 },
    { id: 'brinjal', name: 'Brinjal', icon: '🍆', min: 60, max: 80 },
    { id: 'chilli', name: 'Chilli', icon: '🌶️', min: 55, max: 75 },
    { id: 'capsicum', name: 'Capsicum', icon: '🫑', min: 60, max: 80 },
    { id: 'cucumber', name: 'Cucumber', icon: '🥒', min: 65, max: 85 },
    { id: 'pumpkin', name: 'Pumpkin', icon: '🎃', min: 60, max: 80 },
    { id: 'watermelon', name: 'Watermelon', icon: '🍉', min: 55, max: 75 },
    { id: 'muskmelon', name: 'Muskmelon', icon: '🍈', min: 55, max: 75 },
    { id: 'spinach', name: 'Spinach', icon: '🥬', min: 60, max: 85 },
    { id: 'lettuce', name: 'Lettuce', icon: '🥬', min: 65, max: 85 },
    { id: 'radish', name: 'Radish', icon: '🥕', min: 55, max: 75 },
    { id: 'beetroot', name: 'Beetroot', icon: '🫀', min: 55, max: 75 },
    // Pulses
    { id: 'pea', name: 'Pea', icon: '🫛', min: 50, max: 70 },
    { id: 'chickpea', name: 'Chickpea', icon: '🫘', min: 35, max: 55 },
    { id: 'lentil', name: 'Lentil', icon: '🫘', min: 35, max: 55 },
    { id: 'pigeonpea', name: 'Pigeon Pea', icon: '🫘', min: 40, max: 60 },
    { id: 'blackgram', name: 'Black Gram', icon: '🫘', min: 40, max: 60 },
    { id: 'greengram', name: 'Green Gram', icon: '🫘', min: 40, max: 60 },
    // Other oilseeds
    { id: 'mustard', name: 'Mustard', icon: '🌿', min: 35, max: 55 },
    { id: 'sesame', name: 'Sesame', icon: '🌿', min: 30, max: 50 },
    { id: 'flax', name: 'Flax', icon: '🌿', min: 35, max: 55 },
    { id: 'castor', name: 'Castor', icon: '🌿', min: 40, max: 60 },
    // Fruits
    { id: 'banana', name: 'Banana', icon: '🍌', min: 70, max: 90 },
    { id: 'mango', name: 'Mango', icon: '🥭', min: 50, max: 70 },
    { id: 'apple', name: 'Apple', icon: '🍎', min: 55, max: 75 },
    { id: 'grapes', name: 'Grapes', icon: '🍇', min: 60, max: 80 },
    { id: 'orange', name: 'Orange', icon: '🍊', min: 60, max: 80 },
    { id: 'lemon', name: 'Lemon', icon: '🍋', min: 55, max: 75 },
    { id: 'papaya', name: 'Papaya', icon: '🍈', min: 65, max: 85 },
    { id: 'guava', name: 'Guava', icon: '🟢', min: 55, max: 75 },
    { id: 'pomegranate', name: 'Pomegranate', icon: '🍎', min: 50, max: 70 },
    { id: 'pineapple', name: 'Pineapple', icon: '🍍', min: 65, max: 85 },
    // Plantation
    { id: 'coffee', name: 'Coffee', icon: '☕', min: 60, max: 80 },
    { id: 'tea', name: 'Tea', icon: '🫖', min: 65, max: 85 },
    { id: 'cocoa', name: 'Cocoa', icon: '🍫', min: 70, max: 90 },
    { id: 'rubber', name: 'Rubber', icon: '🌳', min: 70, max: 90 },
    { id: 'arecanut', name: 'Arecanut', icon: '🌴', min: 65, max: 85 },
    { id: 'coconut', name: 'Coconut', icon: '🥥', min: 65, max: 85 },
    { id: 'almond', name: 'Almond', icon: '🌰', min: 45, max: 65 },
    { id: 'cashew', name: 'Cashew', icon: '🌰', min: 45, max: 65 },
    { id: 'walnut', name: 'Walnut', icon: '🌰', min: 50, max: 70 },
    { id: 'hazelnut', name: 'Hazelnut', icon: '🌰', min: 50, max: 70 },
    // More vegetables
    { id: 'broccoli', name: 'Broccoli', icon: '🥦', min: 60, max: 80 },
    { id: 'asparagus', name: 'Asparagus', icon: '🌿', min: 55, max: 75 },
    { id: 'celery', name: 'Celery', icon: '🌿', min: 70, max: 90 },
    { id: 'okra', name: 'Okra', icon: '🌿', min: 55, max: 75 },
    { id: 'zucchini', name: 'Zucchini', icon: '🥒', min: 60, max: 80 },
    { id: 'turnip', name: 'Turnip', icon: '🥕', min: 55, max: 75 },
    { id: 'parsley', name: 'Parsley', icon: '🌿', min: 60, max: 80 },
    { id: 'mint', name: 'Mint', icon: '🌿', min: 65, max: 85 },
    { id: 'coriander', name: 'Coriander', icon: '🌿', min: 60, max: 80 },
    { id: 'fenugreek', name: 'Fenugreek', icon: '🌿', min: 55, max: 75 },
    // Herbs
    { id: 'basil', name: 'Basil', icon: '🌿', min: 60, max: 80 },
    { id: 'thyme', name: 'Thyme', icon: '🌿', min: 40, max: 60 },
    { id: 'rosemary', name: 'Rosemary', icon: '🌿', min: 35, max: 55 },
    { id: 'sage', name: 'Sage', icon: '🌿', min: 40, max: 60 },
    { id: 'lavender', name: 'Lavender', icon: '💜', min: 30, max: 50 },
    // Berries
    { id: 'strawberry', name: 'Strawberry', icon: '🍓', min: 65, max: 85 },
    { id: 'blueberry', name: 'Blueberry', icon: '🫐', min: 70, max: 90 },
    { id: 'raspberry', name: 'Raspberry', icon: '🍓', min: 65, max: 85 },
    { id: 'blackberry', name: 'Blackberry', icon: '🫐', min: 65, max: 85 },
    { id: 'kiwi', name: 'Kiwi', icon: '🥝', min: 60, max: 80 },
    // Exotic fruits
    { id: 'dragonfruit', name: 'Dragon Fruit', icon: '🐉', min: 50, max: 70 },
    { id: 'jackfruit', name: 'Jackfruit', icon: '🍈', min: 60, max: 80 },
    { id: 'lychee', name: 'Lychee', icon: '🍒', min: 65, max: 85 },
    { id: 'fig', name: 'Fig', icon: '🫐', min: 45, max: 65 },
    { id: 'olive', name: 'Olive', icon: '🫒', min: 30, max: 50 },
    { id: 'peach', name: 'Peach', icon: '🍑', min: 55, max: 75 },
    { id: 'pear', name: 'Pear', icon: '🍐', min: 55, max: 75 },
    { id: 'plum', name: 'Plum', icon: '🍑', min: 55, max: 75 },
    { id: 'apricot', name: 'Apricot', icon: '🍑', min: 50, max: 70 },
    { id: 'cherry', name: 'Cherry', icon: '🍒', min: 55, max: 75 },
];

export function CropProvider({ children }: { children: ReactNode }) {
    // Start with crops[0] (Rice) — will be overwritten by Firebase value on mount
    const [selectedCrop, setSelectedCropState] = useState<Crop>(crops[0]);

    // On mount: read the saved crop from Firebase and stay subscribed for live changes
    useEffect(() => {
        const cropRef = ref(db, `smartfarm/config/${NODE_ID}/crop`);

        const unsub = onValue(cropRef, (snapshot) => {
            const cropId: string | null = snapshot.val();
            if (!cropId) return; // nothing set yet — keep default
            const found = crops.find((c) => c.id === cropId);
            if (found) setSelectedCropState(found);
        });

        return () => off(cropRef, 'value', unsub);
    }, []);

    // When user selects a crop: update local state + write to Firebase
    const setSelectedCrop = useCallback(async (crop: Crop) => {
        setSelectedCropState(crop);
        try {
            await set(ref(db, `smartfarm/config/${NODE_ID}/crop`), crop.id);
        } catch (err) {
            console.error('CropContext: failed to write crop to Firebase:', err);
        }
    }, []);

    return (
        <CropContext.Provider value={{ selectedCrop, setSelectedCrop }}>
            {children}
        </CropContext.Provider>
    );
}

export function useCrop() {
    const context = useContext(CropContext);
    if (!context) throw new Error('useCrop must be used within CropProvider');
    return context;
}
