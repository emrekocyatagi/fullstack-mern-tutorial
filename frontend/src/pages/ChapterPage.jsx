import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { MenuIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon, BookOpenIcon } from "lucide-react";
import DocsSidebar from "../components/DocsSidebar";
import MarkdownRenderer from "../components/MarkdownRenderer";
import QuestionCard from "../components/QuestionCard";
import { chapters, getChapterById, getChapterIndex, markChapterRead } from "../lib/chapters";

const ChapterPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [justMarkedRead, setJustMarkedRead] = useState(false);

  const chapter = getChapterById(chapterId);
  const chapterIndex = getChapterIndex(chapterId);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const sentinelRef = useRef(null);

  // Scroll to top whenever the chapter changes
  useEffect(() => {
    if (!chapter) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterId]);

  // Mark as read only when the user scrolls to the very bottom
  useEffect(() => {
    if (!chapter || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          markChapterRead(chapter.id);
          setJustMarkedRead(true);
          const t = setTimeout(() => setJustMarkedRead(false), 2500);
          observer.disconnect(); // fire once per chapter visit
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [chapterId, chapter]);

  // Redirect if unknown chapter id
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-5xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Chapter not found</h1>
          <p className="text-base-content/50 mb-6">That chapter doesn't exist.</p>
          <Link to="/learn" className="btn btn-primary">← Back to MERN Guide</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      {/* Sidebar */}
      <DocsSidebar
        activeId={chapterId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-base-100/90 backdrop-blur border-b border-base-content/10 px-4 md:px-8 py-3 flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden btn btn-ghost btn-sm btn-square"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="size-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <Link to="/learn" className="text-base-content/40 hover:text-base-content/70 transition-colors flex items-center gap-1 flex-shrink-0">
              <BookOpenIcon className="size-3.5" />
              <span className="hidden sm:inline">MERN Guide</span>
            </Link>
            <span className="text-base-content/20">/</span>
            <span className="text-base-content/80 truncate font-medium text-sm">
              {chapter.emoji} {chapter.title}
            </span>
          </div>

          {/* "Marked as read" toast */}
          {justMarkedRead && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 animate-fade-in flex-shrink-0">
              <CheckCircle2Icon className="size-3.5" />
              Marked as read
            </div>
          )}
        </div>

        {/* Chapter content */}
        <article className="max-w-3xl mx-auto px-5 md:px-10 py-10">
          {/* Chapter label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs text-base-content/30 bg-base-200 px-2 py-1 rounded font-semibold">
              Chapter {chapter.number}
            </span>
            <span className="text-xs text-base-content/30">{chapter.readTime} read</span>
          </div>

          {/* Rendered markdown */}
          <MarkdownRenderer content={chapter.content} />

          {/* Comprehension questions section */}
          <div className="mt-14 pt-8 border-t border-base-content/10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🧠</span>
              <h2 className="text-lg font-bold text-base-content">Test Your Understanding</h2>
            </div>
            <p className="text-sm text-base-content/50 mb-5">
              Try to answer each question in your head first — then reveal the suggested answer.
            </p>
            <div className="space-y-0">
              {chapter.questions.map((q, i) => (
                <QuestionCard key={i} index={i} question={q.question} answer={q.answer} />
              ))}
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-14 pt-8 border-t border-base-content/10 flex items-center justify-between gap-4">
            {prevChapter ? (
              <Link
                to={`/learn/${prevChapter.id}`}
                className="group flex items-center gap-3 text-left flex-1 p-4 rounded-xl border border-base-content/10 hover:border-primary/30 hover:bg-base-200/50 transition-all"
              >
                <ArrowLeftIcon className="size-4 text-base-content/40 group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-base-content/40 mb-0.5">Previous</div>
                  <div className="text-sm font-medium text-base-content truncate">
                    {prevChapter.emoji} {prevChapter.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextChapter ? (
              <Link
                to={`/learn/${nextChapter.id}`}
                className="group flex items-center gap-3 text-right flex-1 p-4 rounded-xl border border-base-content/10 hover:border-primary/30 hover:bg-base-200/50 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-base-content/40 mb-0.5">Next</div>
                  <div className="text-sm font-medium text-base-content truncate">
                    {nextChapter.emoji} {nextChapter.title}
                  </div>
                </div>
                <ArrowRightIcon className="size-4 text-base-content/40 group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ) : (
              <Link
                to="/learn"
                className="group flex items-center gap-3 text-right flex-1 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-primary/60 mb-0.5">You finished!</div>
                  <div className="text-sm font-medium text-primary">Back to overview →</div>
                </div>
              </Link>
            )}
          </div>
        </article>

        {/* Invisible sentinel — IntersectionObserver marks chapter as read when this enters viewport */}
        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </main>
    </div>
  );
};

export default ChapterPage;
