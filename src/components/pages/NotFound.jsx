import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" size={48} className="text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display text-gray-800">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-display text-lg shadow-lift hover:shadow-xl transition-all"
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;