import ProfileUser from "@/app/components/ProfileUser";

const Profile = () => {
  return (
    <main className="w-full min-h-screen py-1 flex justify-center items-center bg-gray-100">
      <div className="p-2 md:p-4 w-3/4 flex justify-center items-center">
        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
          <h2 className="text font-bold sm:text-xl text-gray-900">
            Public Profile
          </h2>

          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
              <ProfileUser />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
