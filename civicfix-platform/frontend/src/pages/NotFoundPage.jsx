import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8">
           {/* Abstract aesthetic element behind the icon */}
           <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 transform scale-150"></div>
           <div className="relative text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
             404
           </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-lg">
          The page you are looking for doesn't exist or has been moved. Let's get you back to reporting issues that matter.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>← Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
