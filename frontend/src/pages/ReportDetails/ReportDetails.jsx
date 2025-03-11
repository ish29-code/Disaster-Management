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
        
        if (data.data && data.data.length > 0) {
          setReport(data.data[0]);
        } else {
          setReport(null); // Handle empty response
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching report details:", error);
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  if (loading) return <p>Loading report details...</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={report.fields?.primary_image?.url || "https://via.placeholder.com/800"}
        alt="Disaster"
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h2 className="text-3xl font-bold">{report.fields?.title || "No Title Available"}</h2>

      <p className="text-gray-500">
        {report.fields?.date?.created
          ? new Date(report.fields.date.created).toLocaleString()
          : "No Date Available"}
      </p>

      <h3 className="text-xl font-semibold mt-4">
        Country:{" "}
        {report.fields?.country
          ? report.fields.country.map((c) => c.name).join(", ")
          : "Unknown"}
      </h3>

      <p className="mt-4">
        {report.fields?.body || "No detailed information available."}
      </p>
    </div>
  );
};

export default ReportDetails;




