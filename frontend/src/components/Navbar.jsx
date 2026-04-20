import { PlusIcon, BookOpenIcon } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10" >
        <div className="mx-auto max-w-6xl p-4">
            <div className="flex items-center justify-between" >
                <Link to="/" className="text-3xl font-bold text-primary font-mono tracking-tight">ThinkBoard</Link>
                <div className="flex items-center gap-2" >
                    <Link to={"/learn"} className="btn btn-ghost btn-sm gap-1.5">
                     <BookOpenIcon className="size-4"/>
                     <span className="hidden sm:inline">MERN Guide</span>
                    </Link>
                    <Link to={"/create"} className="btn btn-primary btn-sm">
                     <PlusIcon className="size-4"/>
                     <span>New Note</span>
                    </Link>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Navbar;

