import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";

import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { State } from "country-state-city";
import MDEditor from "@uiw/react-md-editor";
import { getCompanies } from "@/api/apiCompanies";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useNavigate ,Navigate} from "react-router-dom";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirement: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {


  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirement: "" },
    resolver: zodResolver(schema),
  });


  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };
  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form 
       onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <AddCompanyDrawer fetchCompanies={fnCompanies}/>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirement"
          control={control}
           defaultValue=""
          render={({ field }) => (
            <MDEditor value={field.value || ""} onChange={(value) => field.onChange(value ?? "")}  />
          )}
        />
         {errors.requirement && (
          <p className="text-red-500">{errors.requirement.message}</p>
        )}
         {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )} 
         {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />} 
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};
export default PostJob;
