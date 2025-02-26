/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import  {updateApplicationStatus}  from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import supabase from "@/utils/supabase";

const ApplicationCard = ({ application, isCandidate = false }) => {


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      application_id: application.id, // ✅ Use correct application ID
    }
  );
  
  const handleStatusChange = async (status) => {
    console.log("🔄 Received Status in handleStatusChange:", status);
    if (!status) {
      console.error("❌ Status is UNDEFINED before API call!");
      return;
    }
  
    console.log("🛠 Application ID:", application?.id);
    if (!application?.id) {
      console.error("❌ Error: application.id is missing!");
      return;
    }
  
    try {
      console.log("🔍 Making API Call with:", { id: application.id, status });
      const result = await fnHiringStatus(status); // Use fnHiringStatus from useFetch
      console.log("✅ API Response Data:", result);
  
      if (result.error) {
        console.error("⚠ API Error:", result.error.message);
      } else if (!result.data) {
        console.error("❌ Update Failed: No data returned.");
      }
    } catch (err) {
      console.error("🚨 Unexpected Error:", err);
    }
  };
  
  

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          

          <Select
          onValueChange={(value) => {
            console.log("🛠 Selected Status:", value); // Debugging
            if (!value) {
              console.error("❌ Status is undefined in onValueChange!");
            }
            handleStatusChange(value);
          }}
          defaultValue={application.status}
        >
        
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;