
import { GoogleGenAI, Type } from "@google/genai";
import { VehicleType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FareEstimate {
  distanceKm: number;
  durationMinutes: number;
  baseFare: number;
  perKmRate: number;
  distanceTotal: number;
  timeTotal: number;
  surgeMultiplier: number;
  platformFee: number;
  estimatedTotal: number;
  suggestedRoute: string;
  reasoning: string;
}

export const getAIFareEstimation = async (
  pickup: string,
  dropoff: string,
  vehicle: VehicleType
): Promise<FareEstimate> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a logistics expert in Nepal. Estimate the road distance (KM) and traffic duration (minutes) between "${pickup}" and "${dropoff}" in the Kathmandu Valley/Nepal context.
      Calculate a precise ride-hailing fare for a ${vehicle} based on:
      1. Base Fare: Moto (30), Comfort (100), Auto (60), E-Ride (40)
      2. Per KM Rate: Moto (15), Comfort (50), Auto (30), E-Ride (20)
      3. Per Minute Rate: Moto (2), Comfort (5), Auto (3), E-Ride (2)
      
      Output a strictly valid JSON matching the schema provided.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distanceKm: { type: Type.NUMBER, description: "Actual road distance in kilometers" },
            durationMinutes: { type: Type.NUMBER, description: "Estimated time in minutes considering Nepal traffic" },
            baseFare: { type: Type.NUMBER },
            perKmRate: { type: Type.NUMBER },
            distanceTotal: { type: Type.NUMBER, description: "distanceKm * perKmRate" },
            timeTotal: { type: Type.NUMBER, description: "durationMinutes * perMinuteRate" },
            surgeMultiplier: { type: Type.NUMBER, description: "1.0 for normal, 1.2+ for peak" },
            platformFee: { type: Type.NUMBER, description: "Platform convenience fee" },
            estimatedTotal: { type: Type.NUMBER, description: "Final rounded total NPR" },
            suggestedRoute: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["distanceKm", "durationMinutes", "baseFare", "perKmRate", "distanceTotal", "timeTotal", "surgeMultiplier", "platformFee", "estimatedTotal", "suggestedRoute", "reasoning"],
        },
      },
    });

    return JSON.parse(response.text || '{}') as FareEstimate;
  } catch (error) {
    console.error("AI Estimation Error:", error);
    // Fallback logic for demo
    return {
      distanceKm: 5.4,
      durationMinutes: 18,
      baseFare: 50,
      perKmRate: 20,
      distanceTotal: 108,
      timeTotal: 36,
      surgeMultiplier: 1.1,
      platformFee: 20,
      estimatedTotal: 214,
      suggestedRoute: "Via Ring Road",
      reasoning: "Standard urban transit estimate."
    };
  }
};

export const simulateDriverBids = async (userBid: number): Promise<any[]> => {
  return [
    { id: 'd1', name: 'Rabin Thapa', rating: 4.8, vehicle: 'Bajaj Pulsar', bid: userBid, time: '2 mins' },
    { id: 'd2', name: 'Suresh Magar', rating: 4.9, vehicle: 'TVS Apache', bid: Math.round(userBid * 1.1), time: '4 mins' },
    { id: 'd3', name: 'Anil Gurung', rating: 4.7, vehicle: 'Honda Unicorn', bid: Math.round(userBid * 0.95), time: '1 min' },
  ];
};
