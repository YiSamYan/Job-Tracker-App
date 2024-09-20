import { addJob } from "../services/api";

export const importJobsFromFile = async (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const text = event?.target?.result as string;
        const jobDataArray = JSON.parse(text); // Parse the JSON content

        if (!Array.isArray(jobDataArray)) {
          return reject("Invalid JSON format. Expected an array of jobs.");
        }

        const jobPromises = jobDataArray.map(async (job, index) => {
          const { title, company, status, description, requirements } = job;

          // Validate each job
          if (!title || !company || !status || !description) {
            return reject(
              `Error in job at index ${index}: Missing one of the required fields (title, company, status, description).`
            );
          }

          const jobData = {
            title: title.trim(),
            company: company.trim(),
            status: status.trim(),
            description: description.trim(),
            requirements: requirements?.trim() || "", // Requirements can be empty
          };

          await addJob(jobData); // Call the addJob API to create each job
        });

        // Ensure all jobs are added before resolving
        await Promise.all(jobPromises);
        resolve("Jobs imported successfully");
      } catch (error) {
        if (error instanceof Error) {
          reject(`Error parsing file: ${error.message}`);
        } else {
          reject("Unknown error occurred during file parsing");
        }
      }
    };

    reader.onerror = () => reject("Failed to read file");
    reader.readAsText(file);
  });
};
