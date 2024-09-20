import React, { useEffect, useState, useContext } from "react";
import { fetchJobs, deleteJob } from "../services/api";
import JobList from "../components/JobList";
import Pagination from "../components/Pagination";
import SortDropDate from "../components/SortDropDate";
import SearchFilter from "../components/SearchFilter";
import AuthContext from "../context/AuthContext";
import "../styles/JobListPage.css";
import { useNavigate } from "react-router-dom";

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

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSortOption, setCurrentSortOption] = useState(
    "most-recently-created"
  );
  const authContext = useContext(AuthContext);
  const jobsPerPage = 10;
  const navigate = useNavigate();

  // Fetch jobs when the component mounts
  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await fetchJobs();
        const sortedJobs = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs.");
      }
    };

    getJobs();
  }, []);

  // Handle filtering of jobs based on search filters (title, company, and/or status)
  const handleFilterChange = (filters: string[]) => {
    const lowerCaseFilters = filters.map((filter) => filter.toLowerCase());

    const filtered = jobs.filter((job) =>
      lowerCaseFilters.every(
        (filter) =>
          job.company.toLowerCase().includes(filter) ||
          job.title.toLowerCase().includes(filter) ||
          job.status.toLowerCase().includes(filter)
      )
    );

    sortJobs(currentSortOption, filtered);
  };

  // Expand/collapse job descriptions
  const toggleJobDescription = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  // Navigate to the add job form
  const handleAddNewJob = () => {
    navigate("/add-job");
  };

  // Navigate to the edit job form
  const handleEdit = (jobId: number) => {
    navigate(`/edit-job/${jobId}`);
  };

  // Handle deleting a job
  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job.id !== id));
      setFilteredJobs(filteredJobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job.");
    }
  };

  // Get the appropriate CSS class for the job status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "applied":
        return "applied";
      case "interviewing":
        return "interviewing";
      case "rejected":
        return "rejected";
      case "offered":
        return "offered";
      case "n/a":
      default:
        return "n-a";
    }
  };

  // Handle sorting the jobs
  const handleSortChange = (sortOption: string) => {
    setCurrentSortOption(sortOption);
    sortJobs(sortOption, filteredJobs);
  };

  // Sort jobs based on the selected option
  const sortJobs = (sortOption: string, jobsToSort: Job[] = filteredJobs) => {
    const sortedJobs = [...jobsToSort];
    switch (sortOption) {
      case "most-recently-created":
        sortedJobs.sort((a, b) => {
          const createdDiff =
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          if (createdDiff !== 0) return createdDiff;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });
        break;
      case "least-recently-created":
        sortedJobs.sort((a, b) => {
          const createdDiff =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          if (createdDiff !== 0) return createdDiff;
          return (
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          );
        });
        break;
      case "most-recently-updated":
        sortedJobs.sort((a, b) => {
          const updatedDiff =
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          if (updatedDiff !== 0) return updatedDiff;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        break;
      case "least-recently-updated":
        sortedJobs.sort((a, b) => {
          const updatedDiff =
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          if (updatedDiff !== 0) return updatedDiff;
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        break;
      default:
        break;
    }
    setFilteredJobs(sortedJobs);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="job-list-page">
      <div className="job-list-container">
        <div className="search-filter-container">
          <SearchFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="job-list-section">
          <div className="job-list-header">
            <div className="job-list-title-logout">
              <h1>Job List</h1>
              <button className="logout-btn" onClick={authContext?.logout}>
                Logout
              </button>
            </div>
            <div className="job-list-actions">
              <SortDropDate
                onSortChange={handleSortChange}
                currentSortOption={currentSortOption}
              />
              <button className="add-new-job-btn" onClick={handleAddNewJob}>
                Add New Job
              </button>
            </div>
          </div>
          <JobList
            jobs={currentJobs}
            toggleJobDescription={toggleJobDescription}
            expandedJobId={expandedJobId}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            getStatusClass={getStatusClass}
          />
          <Pagination
            totalJobs={filteredJobs.length}
            jobsPerPage={jobsPerPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
