"use client";

import { useState } from "react";
import { analyzeImage } from "@/lib/api"; // Make sure this points to your real API client

export default function Home() {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSend = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const response = await analyzeImage(file);
            setResult(response);
            console.log("Analysis result:", response);
        } catch (error) {
            console.error("Error analyzing image:", error);
            alert("Failed to analyze image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gray-100 dark:bg-[#1f2230] text-gray-900 dark:text-[#cac6d0] font-sans">
            <h1 className="text-2xl font-bold">Upload Your Image</h1>
            <div className="w-full max-w-sm p-6 bg-white dark:bg-[#2b2e3f] rounded-xl shadow-lg text-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4 block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-50 file:text-violet-700
                     hover:file:bg-violet-100"
                />
                {preview && (
                    <>
                        <img
                            src={preview}
                            alt="Uploaded preview"
                            className="mt-4 max-w-full h-auto rounded-lg border"
                        />
                        <button
                            onClick={handleSend}
                            className="mt-4 bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Send"}
                        </button>
                    </>
                )}
                {result && (
                    <div className="mt-6 text-left text-sm bg-gray-50 dark:bg-[#232636] p-4 rounded-lg shadow-inner max-h-96 overflow-auto">
                        <h2 className="text-lg font-bold mb-2">Analysis Result</h2>
                        <p className="mb-2">
                            <strong>Detected:</strong> {result.parsed_analysis["Skin Conditions"].join(", ")}
                        </p>
                        <div className="mb-2">
                            <strong>Severity:</strong>
                            <ul className="list-disc pl-6">
                                {Object.entries(result.parsed_analysis.Severity).map(([cond, sev]) => (
                                    <li key={cond}>
                                        {cond}: {sev}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Medications:</strong>
                            <ul className="list-disc pl-6">
                                {Object.entries(result.parsed_analysis["Recommended Medications"]).map(
                                    ([cond, meds]) => (
                                        <li key={cond}>
                                            {cond}: {meds.join(", ")}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
