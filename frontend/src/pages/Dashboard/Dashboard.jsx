import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ImageComponent from "../../components/ImageComponent/ImageComponent";


const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Prevents multiple fetch calls

  const fetchReports = async (currentPage, reset = false) => {
    if (isFetching) return; // Prevents duplicate calls

    setIsFetching(true);
    try {
      console.log(`Fetching page: ${currentPage}`);
      const response = await fetch(
        `https://api.reliefweb.int/v1/reports?appname=disasterapp&limit=6&sort[]=date:desc&page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.data.length) {
        setHasMore(false);
        return;
      }

      const shuffledReports = data.data.sort(() => Math.random() - 0.5);

      setReports((prevReports) =>
        reset ? shuffledReports : [...prevReports, ...shuffledReports]
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReports(1, true);
  }, []);

  // Fetch more reports when `page` updates
  useEffect(() => {
    if (page > 1) {
      fetchReports(page);
    }
  }, [page]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Disaster Reports</h2>

      {loading && <p>Loading...</p>}

      <InfiniteScroll
        dataLength={reports.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={<p>Loading more reports...</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const fields = report.fields || {};

            const imageUrl =
              fields?.file?.[0]?.preview?.url ||
              fields?.primary_image?.url ||
              null;

            return (
              <div key={report.id} className="p-4 border rounded shadow">
                <ImageComponent src={imageUrl} alt={fields?.title} />
                <h3 className="text-xl font-semibold mt-2">
                  {fields?.title || "No Title"}
                </h3>
                <p className="text-gray-600">
                  <strong>Date & Time:</strong> {formatDateTime(fields?.date?.created)}
                </p>
                <p className="mt-2">{fields?.excerpt || "No summary available."}</p>
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
