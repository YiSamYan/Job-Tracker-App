import React, { useState } from "react";
import "../styles/JobList.css";

interface Job {
  id: number;
  title: string;
  company: string;
  status: string;
  description: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}

interface JobListProps {
  jobs: Job[];
  toggleJobDescription: (jobId: number) => void;
  expandedJobId: number | null;
  handleEdit: (jobId: number) => void;
  handleDelete: (id: number) => Promise<void>;
  getStatusClass: (status: string) => string;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  toggleJobDescription,
  expandedJobId,
  handleEdit,
  handleDelete,
  getStatusClass,
}) => {
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  // Add a deletion animation to the Job delete option
  const handleDeleteWithAnimation = async (id: number) => {
    setDeletingJobId(id);

    setTimeout(async () => {
      await handleDelete(id);
      setDeletingJobId(null);
    }, 500);
  };

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`job-item ${deletingJobId === job.id ? "slide-out" : ""}`}
        >
          <div
            className={`job-header ${getStatusClass(job.status)}`}
            onClick={() => toggleJobDescription(job.id)}
          >
            <div className="job-info">
              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.company}</div>
              <div className="job-status">
                {job.status === "n/a" ? "N/A" : job.status}
              </div>
            </div>
            <div className="job-actions" onClick={(e) => e.stopPropagation()}>
              <button className="edit-btn" onClick={() => handleEdit(job.id)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteWithAnimation(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
          {expandedJobId === job.id && (
            <div className="job-description">
              <h2>Job Description</h2>
              {job.description}
              <h2>Job Requirements</h2>
              {job.requirements}
              <div className="job-dates">
                <p>
                  <strong>Job Added: </strong>
                  {new Date(job.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Last Updated: </strong>
                  {new Date(job.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobList;
