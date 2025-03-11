import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(
          `https://api.reliefweb.int/v1/reports/${id}?appname=disasterapp`
        );
        const data = await response.json();

        if (data.data.length) {
          setReport(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report details:", error);
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "No Date Available";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) return <p>Loading report details...</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div className="p-4">
      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-4">{report.fields?.title || "No Title"}</h2>

      {/* IMAGE */}
      <img
        src={report.fields?.file?.[0]?.preview?.url || "https://via.placeholder.com/600"}
        alt="Disaster"
        className="w-full max-h-[1500px] object-cover rounded mb-4"
      />

      {/* DATE & TIME */}
      <p className="text-gray-600 mb-2">
        <strong>Date & Time:</strong> {formatDateTime(report.fields?.date?.created)}
      </p>

      {/* FULL CONTENT */}
      <p className="text-lg">
        {report.fields?.body || "No additional details available."}
      </p>
    </div>
  );
};

export default ReportDetails;
