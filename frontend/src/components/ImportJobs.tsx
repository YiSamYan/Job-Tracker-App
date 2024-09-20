import React, { useState } from "react";
import { importJobsFromFile } from "../utils/importJobs";
import "../styles/ImportJobs.css";

const ImportJobs: React.FC = () => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Impot jobs based on selected file
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result: string = await importJobsFromFile(file);
        setImportStatus(result);
      } catch (error) {
        setImportStatus(error as string);
      }
    }
  };

  return (
    <div className="import-jobs-container">
      <label>Import Jobs from File (JSON):</label>
      <input type="file" onChange={handleFileImport} />
      {importStatus && <p>{importStatus}</p>}
    </div>
  );
};

export default ImportJobs;
