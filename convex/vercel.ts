import { action } from "./_generated/server";

export const triggerDeploy = action({
  args: {},
  handler: async (ctx) => {
    const VERCEL_DEPLOY_HOOK = "https://api.vercel.com/v1/integrations/deploy/prj_Ju70HtTAwMduHqJGK80xLPbUob64/SxtAlNKxjf";
    
    try {
      const response = await fetch(VERCEL_DEPLOY_HOOK, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`Vercel deploy hook failed with status ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Failed to trigger Vercel deploy:", error);
      return { success: false, error: String(error) };
    }
  },
});
