import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addJob, updateJob, fetchJobById, scrapeJob } from "../services/api";
import "../styles/JobForm.css";

interface Job {
  id?: number;
  title: string;
  company: string;
  status: string;
  description: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}

const JobForm: React.FC = () => {
  const [job, setJob] = useState<Job>({
    title: "",
    company: "",
    status: "n/a",
    description: "",
    requirements: "",
    created_at: "",
    updated_at: "",
  });
  const [jobUrl, setJobUrl] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const displayCreatedAt = job.created_at
    ? new Date(job.created_at).toLocaleString()
    : new Date().toLocaleString();
  const displayUpdatedAt = job.updated_at
    ? new Date(job.updated_at).toLocaleString()
    : new Date().toLocaleString();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const jobToEdit = await fetchJobById(parseInt(id));
          if (jobToEdit) {
            setJob(jobToEdit);
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          alert("Failed to fetch job details.");
        }
      };

      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const jobToSubmit = {
        title: job.title,
        company: job.company,
        status: job.status,
        description: job.description,
        requirements: job.requirements,
      };
      if (id) {
        // Update an existing job
        await updateJob(parseInt(id), jobToSubmit);
      } else {
        // Add a new job
        await addJob(jobToSubmit);
      }
      navigate("/jobs");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job.");
    }
  };

  // Scrape job given an url !!!Important!!! Does not work due to Job sites blocking Scraping
  const handleScrape = async () => {
    setLoading(true);
    setError("");
    try {
      const scrapedData = await scrapeJob(jobUrl);
      const { title, company, description, requirements } = scrapedData;
      setJob({ ...job, title, company, description, requirements });
    } catch (err: any) {
      setError(
        err.message || "An error occurred while scraping the job details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate("/jobs");
  };

  return (
    <div className="job-form-container">
      <h1>{id ? "Edit Job" : "Add Job"}</h1>
      <form className="job-form" onSubmit={handleSubmit}>
        {id ? (
          ""
        ) : (
          <div className="form-group">
            <label>
              Job Posting URL:
              {loading && (
                <span
                  className="loading-spinner"
                  style={{ marginLeft: "10px" }}
                ></span>
              )}
            </label>
            <input
              id="scraping_url"
              type="text"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="Enter job posting URL"
            />
            <button type="button" onClick={handleScrape}>
              Scrape Job Details
            </button>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <input
            id="company"
            type="text"
            value={job.company}
            onChange={(e) => setJob({ ...job, company: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={job.status}
            onChange={(e) => setJob({ ...job, status: e.target.value })}
          >
            <option value="n/a">N/A</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="rejected">Rejected</option>
            <option value="offered">Offered </option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="requirements">Requirements:</label>
          <textarea
            id="requirements"
            value={job.requirements}
            onChange={(e) => setJob({ ...job, requirements: e.target.value })}
          />
        </div>
        <div className="form-group horizontal-layout">
          <label>Job Added:</label>
          <span>{displayCreatedAt}</span>
        </div>
        <div className="form-group horizontal-layout">
          <label>Last Updated:</label>
          <span>{displayUpdatedAt}</span>
        </div>
        <button type="submit" className="add-job-btn">
          {id ? "Update Job" : "Add Job"}
        </button>
        <button type="button" className="return-btn" onClick={handleReturn}>
          Return
        </button>
      </form>
    </div>
  );
};

export default JobForm;
