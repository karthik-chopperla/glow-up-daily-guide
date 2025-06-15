
import { useState } from "react";
const SUGGESTS = [
  "Fever", "Headache", "Cough", "Body pain", "Rash", "Sore throat", "Tiredness",
];

const SYMPTOMS_STORAGE_KEY = "hm_symptom_checks";

function mockOpenAISymptomCheck(symptom: string) {
  // Simulate OpenAI (gpt-3.5-turbo) call
  const random = () => Math.random();
  if (/headache|fever/i.test(symptom)) {
    return {
      condition: "Viral Fever",
      severity: random() < 0.2 ? "serious" : random() > 0.8 ? "mild" : "moderate",
      advice: "Rest, hydrate, monitor temperature. See doctor if >102F.",
    };
  }
  return {
    condition: "Unknown Condition",
    severity: "mild",
    advice: "Monitor and consult professional if worsens.",
  };
}

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem(SYMPTOMS_STORAGE_KEY) || "[]")
  );
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    if (!input.trim()) return;
    const res = mockOpenAISymptomCheck(input.trim());
    setResult(res);

    const history = [input.trim(), ...list].slice(0, 5);
    setList(history);
    localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(history));
  };

  return (
    <div className="min-h-screen bg-white/90 flex flex-col px-4 pb-24 pt-10">
      <h2 className="text-xl font-bold text-green-700 mb-4">AI Symptom Checker</h2>
      <input
        className="px-4 py-3 border rounded-lg w-full mb-2"
        placeholder="Describe your symptom (e.g., headache)..."
        value={input}
        onChange={e => setInput(e.target.value)}
        list="symptoms"
      />
      <datalist id="symptoms">
        {SUGGESTS.map(s => <option key={s} value={s} />)}
      </datalist>
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-full font-bold my-2"
        onClick={handleCheck}
      >Check</button>
      {result && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div><span className="font-medium">Condition:</span> {result.condition}</div>
          <div><span className="font-medium">Severity:</span> {result.severity}</div>
          <div><span className="font-medium">Advice:</span> {result.advice}</div>
        </div>
      )}
      {list.length > 0 && (
        <div className="mt-8">
          <div className="font-bold mb-1 text-gray-700 text-sm">Last 5 Checks:</div>
          <ul className="list-disc ml-5 text-gray-500 text-xs">
            {list.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
