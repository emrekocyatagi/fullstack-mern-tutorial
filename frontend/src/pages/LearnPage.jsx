import { Link } from "react-router";
import { useState, useEffect } from "react";
import { BookOpenIcon, CheckCircle2Icon, ClockIcon, ChevronRightIcon } from "lucide-react";
import { chapters, getProgress } from "../lib/chapters";

const LearnPage = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const readCount = progress.length;
  const totalCount = chapters.length;
  const progressPct = Math.round((readCount / totalCount) * 100);

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="border-b border-base-content/10 bg-base-200/50">
        <div className="max-w-5xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-primary/20">
            <BookOpenIcon className="size-3.5" />
            MERN Learning Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-base-content mb-4">
            How{" "}
            <span className="text-primary">ThinkBoard</span>
            {" "}was built
          </h1>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto leading-relaxed">
            A mentor-style guide to understanding every concept in this MERN stack project.
            Read the code, understand the <em>why</em>, build your own.
          </p>

          {/* Overall progress */}
          {readCount > 0 && (
            <div className="mt-8 inline-flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <CheckCircle2Icon className="size-4 text-primary" />
                <span>{readCount} of {totalCount} chapters read — {progressPct}% complete</span>
              </div>
              <div className="w-48 bg-base-300 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapter cards */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapters.map((chapter, i) => {
            const isRead = progress.includes(chapter.id);

            return (
              <Link
                key={chapter.id}
                to={`/learn/${chapter.id}`}
                className={`group relative flex flex-col bg-base-100 rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
                  isRead
                    ? "border-primary/30 hover:border-primary/50"
                    : "border-base-content/10 hover:border-base-content/20"
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 w-full ${isRead ? "bg-primary" : "bg-base-content/10 group-hover:bg-primary/30 transition-colors"}`}
                />

                <div className="flex flex-col flex-1 p-5">
                  {/* Chapter number + read badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-base-content/30 font-semibold">
                      {chapter.number}
                    </span>
                    {isRead && (
                      <span className="flex items-center gap-1 text-primary text-xs font-medium">
                        <CheckCircle2Icon className="size-3.5" />
                        Read
                      </span>
                    )}
                  </div>

                  {/* Emoji + title */}
                  <div className="mb-2">
                    <span className="text-2xl">{chapter.emoji}</span>
                    <h2 className="text-base font-bold text-base-content mt-1 group-hover:text-primary transition-colors">
                      {chapter.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/55 leading-relaxed flex-1 mb-4">
                    {chapter.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-base-content/35">
                      <ClockIcon className="size-3" />
                      {chapter.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {isRead ? "Re-read" : "Start reading"}
                      <ChevronRightIcon className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* What you'll find in each chapter */}
        <div className="mt-14 p-6 rounded-2xl bg-base-200/50 border border-base-content/10">
          <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-4">
            Every chapter includes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "✅", label: "Real-world analogies" },
              { icon: "💻", label: "Code from this project" },
              { icon: "❓", label: "Comprehension questions" },
              { icon: "🚀", label: "What to learn next" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
