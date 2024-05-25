"use client";

import FormRegister from "@/app/components/FormRegister";

export default function RegisterPage() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-extrabold text-center text-gray-900">
            Create your account
          </h2>
        </div>
        <FormRegister />
      </div>
    </div>
  );
}
