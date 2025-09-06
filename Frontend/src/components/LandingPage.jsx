import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      
      {/* Project title */}
      <h2 style={{color: "pink", fontSize: "20px"}}>
        Digital Civic Engagement Petition
      </h2>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Please login or signup to continue
      </p>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-center"
        >
          Login
        </Link>
        
        <Link
          to="/signup"
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition text-center"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}