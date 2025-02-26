import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();
  console.log("User Metadata:", user?.unsafeMetadata);
  console.log("User Role:", user?.unsafeMetadata?.role);
  
  

  if (!isLoaded || !user) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
       
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
    
            
        {user?.unsafeMetadata?.role=== "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;