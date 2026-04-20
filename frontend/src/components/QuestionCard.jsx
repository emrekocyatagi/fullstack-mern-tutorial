import { useState } from "react";
import { ChevronDownIcon, CheckCircle2Icon, HelpCircleIcon } from "lucide-react";

const QuestionCard = ({ question, answer, index }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="border border-base-content/10 rounded-xl overflow-hidden mb-3 bg-base-200/40 hover:border-primary/30 transition-colors">
      {/* Question row */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          {revealed ? (
            <CheckCircle2Icon className="size-5 text-primary" />
          ) : (
            <HelpCircleIcon className="size-5 text-base-content/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-base-content leading-relaxed">
            <span className="text-primary/60 font-mono text-xs mr-2">Q{index + 1}</span>
            {question}
          </p>
        </div>
        <button
          onClick={() => setRevealed(!revealed)}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
            revealed
              ? "bg-primary/15 text-primary"
              : "bg-base-300 text-base-content/60 hover:bg-base-300/80 hover:text-base-content"
          }`}
        >
          {revealed ? "Hide" : "Show Answer"}
          <ChevronDownIcon
            className={`size-3.5 transition-transform duration-300 ${revealed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Answer — animated reveal */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          revealed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-base-content/10 pt-3 pl-8">
            <p className="text-sm text-base-content/70 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
