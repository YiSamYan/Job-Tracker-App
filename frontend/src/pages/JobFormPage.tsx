import React from "react";
import JobForm from "../components/JobForm";
import ImportJobs from "../components/ImportJobs";
import "../styles/JobFormPage.css";

const JobFormPage: React.FC = () => {
  return (
    <div className="job-form-page">
      <ImportJobs />
      <JobForm />
    </div>
  );
};

export default JobFormPage;
