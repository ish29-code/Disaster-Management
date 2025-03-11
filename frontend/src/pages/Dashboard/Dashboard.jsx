import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=6&sort[]=date:desc&page=${page}`
      );
      const data = await response.json();
      setReports((prevReports) => [...prevReports, ...data.data]); // Append new reports
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Disaster Reports</h2>

      <InfiniteScroll
        dataLength={reports.length}
        next={() => setPage(page + 1)}
        hasMore={true}
        loader={<p>Loading more reports...</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 border rounded shadow">
              <img
                src={report.fields?.primary_image || "https://via.placeholder.com/400"}
                alt="Disaster"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-2">
                {report.fields?.title || "No Title"}
              </h3>
              <p className="text-gray-600">
                {report.fields?.date?.created
                  ? new Date(report.fields.date.created).toLocaleDateString()
                  : "No Date Available"}
              </p>
              <p className="mt-2">
                {report.fields?.excerpt || "No summary available."}
              </p>
              <Link
                to={`/report/${report.id}`}
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                Read more
              </Link>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
