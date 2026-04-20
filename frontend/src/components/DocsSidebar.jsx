import { Link, useNavigate } from "react-router";
import { CheckCircle2Icon, CircleIcon, XIcon, BookOpenIcon, ChevronRightIcon } from "lucide-react";
import { chapters, getProgress } from "../lib/chapters";

const DocsSidebar = ({ activeId, sidebarOpen, setSidebarOpen }) => {
  const progress = getProgress();

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-content/10">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="size-4 text-primary" />
          <span className="font-semibold text-sm text-base-content">MERN Guide</span>
        </div>
        {/* Close button — mobile only */}
        <button
          className="md:hidden btn btn-ghost btn-xs btn-circle"
          onClick={() => setSidebarOpen(false)}
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Progress summary */}
      <div className="px-5 py-3 border-b border-base-content/10">
        <div className="flex items-center justify-between text-xs text-base-content/50 mb-1.5">
          <span>Progress</span>
          <span>{progress.length} / {chapters.length}</span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(progress.length / chapters.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chapter list */}
      <ul className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeId;
          const isRead = progress.includes(chapter.id);

          return (
            <li key={chapter.id}>
              <Link
                to={`/learn/${chapter.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {/* Read indicator */}
                <span className="flex-shrink-0">
                  {isRead ? (
                    <CheckCircle2Icon className={`size-4 ${isActive ? "text-primary" : "text-primary/60"}`} />
                  ) : (
                    <CircleIcon className={`size-4 ${isActive ? "text-primary/60" : "text-base-content/20 group-hover:text-base-content/30"}`} />
                  )}
                </span>

                {/* Chapter info */}
                <span className="flex-1 leading-tight">
                  <span className={`font-mono text-xs mr-1.5 ${isActive ? "text-primary/70" : "text-base-content/30"}`}>
                    {chapter.number}
                  </span>
                  {chapter.emoji} {chapter.title}
                </span>

                {isActive && <ChevronRightIcon className="size-3.5 flex-shrink-0" />}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Back to app */}
      <div className="px-5 py-4 border-t border-base-content/10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-base-content/40 hover:text-base-content/70 transition-colors"
        >
          ← Back to ThinkBoard
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — always visible md+ */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-base-200 border-r border-base-content/10 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="relative w-72 max-w-[85vw] bg-base-200 h-full flex flex-col shadow-2xl animate-slide-in-left">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default DocsSidebar;
