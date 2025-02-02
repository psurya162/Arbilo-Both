import React, { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArbiPair from "./ArbiPair";
import { IoMdSwap, IoMdTrendingUp } from "react-icons/io";
import ArbiTrack from "./ArbiTrack";
import config from "@/config.js/config";

const REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds


const DashBoard = () => {
    const { auth } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("ArbiPair");
    const isActive = auth?.user?.is_active;

    // Combined state for better management
    const [state, setState] = useState({
        arbiPairData: [],
        arbiTrackData: [],
        loading: false,
        error: null,
        countdown: REFRESH_INTERVAL / 1000,
        lastRefreshTime: Date.now()
    });

    // Memoized fetch functions using useCallback
    const fetchArbiPairData = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/arbitrage`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data.results) ? data.results : data;
        } catch (error) {
            throw new Error(`ArbiPair fetch failed: ${error.message}`);
        }
    }, []);

    const fetchArbiTrackData = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/arbitrage/arbitrack`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data && typeof data === "object" && Object.keys(data).length > 0) {
                return Object.entries(data).map(([coin, info]) => ({
                    coin1: coin,
                    minExchange: info.lowestExchange || "N/A",
                    minPrice1: info.lowestPrice || "N/A",
                    maxExchange: info.highestExchange || "N/A",
                    maxPrice1: info.highestPrice || "N/A",
                    profitPercentage: info.profitPercentage || 0,
                }));
            }
            throw new Error("Invalid data format received");
        } catch (error) {
            throw new Error(`ArbiTrack fetch failed: ${error.message}`);
        }
    }, []);

    // Unified refresh function
    const refreshData = useCallback(async () => {
        if (!isActive) return;

        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            // Use Promise.all to fetch both data sources simultaneously
            const [newArbiPairData, newArbiTrackData] = await Promise.all([
                fetchArbiPairData(),
                fetchArbiTrackData()
            ]);

            setState(prev => ({
                ...prev,
                arbiPairData: newArbiPairData,
                arbiTrackData: newArbiTrackData,
                loading: false,
                lastRefreshTime: Date.now(),
                countdown: REFRESH_INTERVAL / 1000
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
        }
    }, [isActive, fetchArbiPairData, fetchArbiTrackData]);

    // Effect for initial load and refresh interval
    useEffect(() => {
        if (!isActive) return;

        refreshData();
        
        const intervalId = setInterval(refreshData, REFRESH_INTERVAL);
        
        // Cleanup function
        return () => clearInterval(intervalId);
    }, [isActive, refreshData]);

    // Effect for countdown timer
    useEffect(() => {
        if (!isActive) return;

        const timerId = setInterval(() => {
            setState(prev => ({
                ...prev,
                countdown: Math.max(0, Math.floor((REFRESH_INTERVAL - (Date.now() - prev.lastRefreshTime)) / 1000))
            }));
        }, 1000);

        return () => clearInterval(timerId);
    }, [isActive]);

    return (
        <div className="p-2 md:p-4">
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center uppercase">
                Unlock Profitable Arbitrage with Confidence
            </h1>

            {/* Countdown Timer */}
            {isActive && (
                <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-base md:text-lg font-semibold text-gray-700">
                        Next Refresh in: {Math.floor(state.countdown / 60)}m {state.countdown % 60}s
                    </div>
                </div>
            )}

            {/* Tabs and Content */}
            <div className="p-2 md:p-4">
                {isActive ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {/* Tabs List */}
                        <TabsList className="flex  md:flex-row justify-around mb-4 p-2 md:p-6 gap-2">
                            <TabsTrigger
                                value="ArbiPair"
                                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg w-full md:w-auto justify-center md:justify-start"
                            >
                                <IoMdSwap size={20} />
                                <span>ArbiPair</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="ArbiTrack"
                                className="flex items-center gap-2 px-4 py-2 text-sm md:text-lg w-full md:w-auto justify-center md:justify-start"
                            >
                                <IoMdTrendingUp size={20} />
                                <span>ArbiTrack</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Tabs Content */}
                        <TabsContent value="ArbiPair">
                            <ArbiPair 
                                data={state.arbiPairData} 
                                loading={state.loading} 
                                error={state.error} 
                            />
                        </TabsContent>
                        <TabsContent value="ArbiTrack">
                            <ArbiTrack 
                                data={state.arbiTrackData} 
                                loading={state.loading} 
                                error={state.error} 
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="text-center">
                        <p className="text-lg md:text-xl font-semibold">
                            You need an active subscription to access this content.
                        </p>
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
                            Take Subscription
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashBoard;