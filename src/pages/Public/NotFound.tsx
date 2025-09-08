import { Link } from "react-router";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
      <div className=" h-full w-full flex flex-col items-center justify-center text-center gap-6 my-auto">
        <h1 className="text-4xl font-bold gap-3 flex flex-row items-center">
          <SearchX />
          404
        </h1>
        <p className="text-xl text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>
        <p className="text-sm text-gray-500 mt-6">
          Or you can navigate back to our 
          <Link to={"/"} className="text-blue-500 hover:underline">
            Home Page
          </Link>
          .
        </p>
      </div>
  );
}
