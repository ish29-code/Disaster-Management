import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const Dashboard = () => {
    const [disasters, setDisasters] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedDisaster, setSelectedDisaster] = useState(null);

    const fetchDisasters = async () => {
        try {
            const response = await axios.get(
                `https://api.reliefweb.int/v1/reports?appname=apidoc&profile=full&limit=10&offset=${(page - 1) * 10}`
            );

            const newDisasters = response.data.data;

            if (newDisasters.length === 0) setHasMore(false);
            else setDisasters((prev) => [...prev, ...newDisasters]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchDisasters();
    }, [page]);

    const handleReadMore = (disaster) => setSelectedDisaster(disaster);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Disaster Dashboard</h1>

            <InfiniteScroll
                dataLength={disasters.length}
                next={() => setPage(page + 1)}
                hasMore={hasMore}
                loader={<h4 className="text-center">Loading...</h4>}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {disasters.map((disaster, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                        <img 
                            src={
                                disaster.fields?.primary_image?.url || 
                                "https://placehold.co/600x400?text=No+Image"
                            }
                            alt={disaster.fields.title}
                            className="rounded-lg w-full h-48 object-cover mb-4"
                            onError={(e) => e.target.src = "https://placehold.co/600x400?text=No+Image"} // Image fallback
                        />

                        <h2 className="text-xl font-semibold">{disaster.fields.title}</h2>
                        <p className="text-gray-600">
                            {new Date(disaster.fields.date.created).toLocaleDateString() || "Date not available"}
                        </p>
                        <button
                            onClick={() => handleReadMore(disaster)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Read More
                        </button>
                    </div>
                ))}
            </InfiniteScroll>

            {/* MODAL FOR DETAILED VIEW */}
            {selectedDisaster && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">{selectedDisaster.fields.title}</h2>

                        <img 
                            src={
                                selectedDisaster.fields?.primary_image?.url || 
                                "https://placehold.co/600x400?text=No+Image"
                            }
                            alt={selectedDisaster.fields.title}
                            className="rounded-lg w-full mb-4"
                        />

                        <p className="text-lg">{selectedDisaster.fields.body || "No additional details available."}</p>

                        <button
                            onClick={() => setSelectedDisaster(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

