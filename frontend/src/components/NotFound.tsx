import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import errorpage from '../../public/assets/animations/erropage.json'

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-dark-4 w-full">
      <div className="h-72 w-96">
      <Lottie animationData={errorpage} loop={true}/>
      </div>
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl text-gray-500 mb-8">Page Not Found</p>
      <Link to='/' className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
