import { supabaseClient } from "@/utils/supabase";

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  console.log("Sending application request:", jobData);
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  // ✅ Ensure jobData.resume is a File or Blob
  if (!(jobData.resume instanceof File || jobData.resume instanceof Blob)) {
    throw new Error("Invalid resume file format");
  }

  // Upload the resume to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume, {
      cacheControl: "3600",
      upsert: true, // Allows overwriting if needed
    });

  if (storageError) {
    console.error("Error uploading Resume:", storageError.message);
    throw new Error("Error uploading Resume");
  }

  // ✅ Use Supabase's built-in public URL retrieval method
  const { data } = supabase.storage.from("resumes").getPublicUrl(fileName);
  const resumeUrl = data.publicUrl;

  console.log("Resume successfully uploaded. Public URL:", resumeUrl);

  // Insert into the database
  const { data: applicationData, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume: resumeUrl, // ✅ Use correct public URL
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting Application:", error.message);
    throw new Error("Error submitting Application");
  }

  return applicationData;
}


// - Edit Application Status ( recruiter )
// export async function updateApplicationStatus(token, { application_id }, status) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("applications")
//     .update({ status })
//     .eq("id", application_id) // ✅ Ensure you're using the correct ID
//     .select();

//   if (error || !data.length) {
//     console.error("Error Updating Application Status:", error);
//     return null;
//   }

//   return data;
// }
export async function updateApplicationStatus(token, { application_id }, status) {
  console.log("🛠 Updating Application ID:", application_id, "New Status:", status);

  // Validate inputs
  if (!application_id || !status) {
    console.error("❌ Missing required fields: application_id or status");
    throw new Error("Missing required fields");
  }

  const supabase = await supabaseClient(token);

  // Check if the application exists
  const { data: existingApplication, error: fetchError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", application_id)
    .single(); // Ensure only one record is returned

  if (fetchError || !existingApplication) {
    console.error("❌ Application not found:", fetchError?.message || "No data returned");
    throw new Error("Application not found");
  }

  // Update the application status
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", application_id)
    .select();

  console.log("🔍 Supabase Response Data:", data);
  console.log("⚠ Supabase Error:", error);

  if (error || !data || data.length === 0) {
    console.error("❌ Update Failed:", error?.message || "No data returned");
    throw new Error("Failed to update application status");
  }

  return data;
}




export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}