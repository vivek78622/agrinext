"use client";

import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export interface SmartFarmData {
    id: string;
    soil: number;          // 0–100 %
    tank: number;          // 0–100 %
    pump: number;          // 0 = OFF, 1 = ON
    mode: string;          // "AUTO" | "MANUAL"
    crop: string;          // crop id e.g. "wheat"
    minSoil: number;       // crop min threshold %
    maxSoil: number;       // crop max threshold %
    dryRunActive: boolean; // tank < 20%
    timestamp: string;
}

export interface SmartFarmState {
    data: SmartFarmData | null;
    loading: boolean;
    lastUpdated: Date | null;
    connected: boolean;
    authReady: boolean;
}

type Cmd = "pump_on" | "pump_off" | "mode_auto" | "mode_manual";

const NODE_ID = "field01"; // matches const char* nodeId in sender sketch

const DEFAULT_STATE: SmartFarmState = {
    data: null,
    loading: true,
    lastUpdated: null,
    connected: false,
    authReady: false,
};

export function useSmartFarm(): SmartFarmState & { sendCommand: (cmd: Cmd) => Promise<void> } {
    const [state, setState] = useState<SmartFarmState>(DEFAULT_STATE);

    useEffect(() => {
        let unsubscribeDb: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                try {
                    await signInAnonymously(auth);
                } catch {
                    setState((s: SmartFarmState) => ({ ...s, loading: false, authReady: false }));
                }
                return; // auth state fires again with the new user
            }

            setState((s: SmartFarmState) => ({ ...s, authReady: true }));

            const nodeRef = ref(db, `smartfarm/nodes/${NODE_ID}`);
            unsubscribeDb = onValue(
                nodeRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const r = snapshot.val();
                        setState({
                            data: {
                                id: r.id ?? NODE_ID,
                                soil: Number(r.soil ?? 0),
                                tank: Number(r.tank ?? 0),
                                pump: Number(r.pump ?? 0),
                                mode: r.mode ?? "AUTO",
                                crop: r.crop ?? "",
                                minSoil: Number(r.minSoil ?? 0),
                                maxSoil: Number(r.maxSoil ?? 100),
                                dryRunActive: r.dryRunActive === true,
                                timestamp: r.timestamp ?? "",
                            },
                            loading: false,
                            lastUpdated: new Date(),
                            connected: true,
                            authReady: true,
                        });
                    } else {
                        setState((s: SmartFarmState) => ({
                            ...s, loading: false, connected: false, authReady: true,
                        }));
                    }
                },
                () => {
                    setState((s: SmartFarmState) => ({ ...s, loading: false, connected: false }));
                }
            );
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDb?.();
        };
    }, []);

    /**
     * Write command to Firebase.
     * Requires only auth — NOT a live ESP32 connection.
     * The gateway picks it up within 3 s once online.
     */
    const sendCommand = async (cmd: Cmd) => {
        if (!auth.currentUser) {
            console.warn("sendCommand: no authenticated user");
            return;
        }
        await set(ref(db, `smartfarm/commands/${NODE_ID}/cmd`), cmd);
    };

    return { ...state, sendCommand };
}
