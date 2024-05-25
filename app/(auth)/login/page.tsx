import Link from "next/link";
import { cookies } from "next/headers";
import FormLogin from "@/app/components/FormLogin";

const Login = () => {
  const cookieStore = cookies();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <FormLogin cookie={cookieStore} />
      </div>
    </div>
  );
};

export default Login;
