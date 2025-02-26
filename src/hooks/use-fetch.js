import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      if (!session) {
        console.error("Clerk session not available!");
        setLoading(false);
        return;
      }

      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      console.log("Supabase Access Token:", supabaseAccessToken);

      if (!supabaseAccessToken) {
        console.error("No Supabase Access Token Found!");
        setLoading(false);
        return;
      }

      console.log("Calling API with Token:", supabaseAccessToken, "Options:", options, "Args:", args);

      const response = await cb(supabaseAccessToken, options, ...args);
      console.log("API Response:", response);

      setData(response);
      setError(null);
    } catch (error) {
      console.error("Error in useFetch:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;



