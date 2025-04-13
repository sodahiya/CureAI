import React from 'react'

export default function ResultDialog({
                                         result,
                                         onClose,
                                     }: {
    result: any
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
                <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
                <p className="mb-2"><strong>Raw Response:</strong></p>
                <pre className="bg-gray-100 p-2 text-sm mb-4">{result.llava_response}</pre>

                <p><strong>Detected Conditions:</strong> {result.parsed_analysis['Skin Conditions'].join(', ')}</p>

                <div className="mt-4">
                    <h3 className="font-semibold">Severity:</h3>
                    <ul className="list-disc pl-6">
                        {Object.entries(result.parsed_analysis.Severity).map(([cond, sev]) => (
                            <li key={cond}>{cond}: {sev}</li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold">Recommended Medications:</h3>
                    <ul className="list-disc pl-6">
                        {Object.entries(result.parsed_analysis['Recommended Medications']).map(([cond, meds]) => (
                            <li key={cond}>{cond}: {meds.join(', ')}</li>
                        ))}
                    </ul>
                </div>

                <button onClick={onClose} className="mt-6 px-4 py-2 bg-red-500 text-white rounded">
                    Close
                </button>
            </div>
        </div>
    )
}
