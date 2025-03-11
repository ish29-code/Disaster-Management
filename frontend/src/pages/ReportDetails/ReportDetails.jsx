import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=10&offset=${(page - 1) * 10}`
      );
      const data = await response.json();

      console.log("API Data:", data); // Debugging log
      setReports((prevReports) => [...prevReports, ...data.data]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="p-4">
      {reports.map((report) => (
        <div key={report.id} className="mb-6 border-b pb-4">
          <h3 className="text-xl font-bold">{report.fields.title}</h3>

          {/* IMAGE */}
          <img
            src={
              report.fields?.file?.[0]?.preview?.url ||
              report.fields?.primary_image?.url ||
              "https://placehold.co/600x400?text=No+Image"
            }
            alt="Disaster"
            className="w-full max-h-[400px] object-cover rounded mb-4"
          />

          {/* DATE */}
          <p className="text-gray-600 mb-2">
            <strong>Date & Time:</strong>{" "}
            {new Date(report.fields?.date?.created).toLocaleString() || "No Date Available"}
          </p>

          {/* READ MORE LINK */}
          <Link
            to={`/report/${report.id}`}
            className="text-blue-500 hover:underline"
          >
            Read More
          </Link>
        </div>
      ))}

      {loading && <p>Loading more reports...</p>}
    </div>
  );
};

export default Dashboard;


