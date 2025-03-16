import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=6&sort[]=date:desc&page=${page}`
      );
      const data = await response.json();

      if (!data.data.length) {
        setHasMore(false);
        return;
      }

      const uniqueReports = [
        ...new Map(data.data.map((report) => [report.id, report])).values()
      ];

      setReports((prevReports) => [...prevReports, ...uniqueReports]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Disaster Reports</h2>

      <InfiniteScroll
        dataLength={reports.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={<p>Loading more reports...</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => {
            const imageUrl = report.fields?.file?.preview?.url

            return (
              <div key={`${report.id}-${index}`} className="p-4 border rounded shadow">
                <img
                  src={imageUrl}
                  alt={report.fields?.title || "Disaster Image"}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                   // Placeholder if image fails
                  }}
                />

                <h3 className="text-xl font-semibold mt-2">
                  {report.fields?.title || "No Title"}
                </h3>

                <p className="text-gray-600">
                  <strong>Date & Time:</strong> {formatDateTime(report.fields?.date?.created)}
                </p>

                <Link
                  to={`/report/${report.id}`}
                  className="mt-2 inline-block text-blue-500 hover:underline"
                >
                  Read more
                </Link>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
