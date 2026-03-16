import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function HomePage() {

  /* Animated Counter */

  const [stats, setStats] = useState({
    reported: 0,
    resolved: 0,
    users: 0
  });

  useEffect(() => {

    let r = 0, s = 0, u = 0;

    const interval = setInterval(() => {

      if (r < 1200) r += 20;
      if (s < 950) s += 15;
      if (u < 500) u += 10;

      setStats({
        reported: r,
        resolved: s,
        users: u
      });

      if (r >= 1200 && s >= 950 && u >= 500)
        clearInterval(interval);

    }, 40);

  }, []);

  /* Demo Map Pins */

  const issues = [
    { lat: 17.385, lng: 78.4867, title: "Pothole Reported" },
    { lat: 17.39, lng: 78.48, title: "Garbage Issue" },
    { lat: 17.382, lng: 78.492, title: "Broken Street Light" }
  ];

  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 relative overflow-hidden">

      {/* FLOATING ICONS */}

      <div className="absolute top-20 left-10 text-blue-300 text-6xl animate-pulse">
        🏙️
      </div>

      <div className="absolute bottom-32 right-10 text-blue-200 text-5xl animate-bounce">
        📍
      </div>

      <div className="absolute top-1/2 left-1/4 text-blue-200 text-5xl animate-pulse">
        🚧
      </div>

      {/* HERO */}

      <section className="py-24 text-center">

        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          CivicFix
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A smart platform that empowers citizens to report civic issues
          instantly with location, images, and real-time tracking.
        </p>

        <Link
          to="/report"
          className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Report an Issue
        </Link>

      </section>

      {/* ANIMATED STATS */}

      <section className="max-w-5xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow">

            <h2 className="text-4xl font-bold text-blue-600">
              {stats.reported}+
            </h2>

            <p className="text-gray-600 mt-2">
              Complaints Reported
            </p>

          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow">

            <h2 className="text-4xl font-bold text-green-600">
              {stats.resolved}+
            </h2>

            <p className="text-gray-600 mt-2">
              Issues Resolved
            </p>

          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-xl shadow">

            <h2 className="text-4xl font-bold text-purple-600">
              {stats.users}+
            </h2>

            <p className="text-gray-600 mt-2">
              Active Citizens
            </p>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-center mb-14">
          Key Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "GPS Location Detection",
              text: "Automatically detect issue location using GPS."
            },
            {
              title: "Photo Evidence Upload",
              text: "Upload images to help authorities understand problems."
            },
            {
              title: "Real-Time Tracking",
              text: "Track complaint progress with a unique ID."
            },
            {
              title: "Duplicate Detection",
              text: "Prevent multiple reports for the same issue."
            },
            {
              title: "City Map Visualization",
              text: "View civic issues on an interactive map."
            },
            {
              title: "Fast Reporting",
              text: "Report problems within seconds."
            }
          ].map((f, i) => (

            <div
              key={i}
              className="bg-white/60 backdrop-blur-lg p-8 rounded-xl shadow
              hover:shadow-2xl hover:-translate-y-2
              transition duration-300 cursor-pointer"
            >

              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                {f.title}
              </h3>

              <p className="text-gray-600">
                {f.text}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* LIVE MAP PREVIEW */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-center mb-10">
          Live Civic Issues Map
        </h2>

        <div className="rounded-xl overflow-hidden shadow-lg">

          <MapContainer
            center={[17.385, 78.4867]}
            zoom={13}
            style={{ height: "350px", width: "100%" }}
          >

            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {issues.map((issue, i) => (

              <Marker key={i} position={[issue.lat, issue.lng]}>
                <Popup>
                  {issue.title}
                </Popup>
              </Marker>

            ))}

          </MapContainer>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h2 className="text-3xl font-bold mb-12">
          How CivicFix Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Report Issue</h3>
            <p className="text-gray-600">
              Submit location, image, and description.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Smart Processing</h3>
            <p className="text-gray-600">
              System checks duplicates and assigns workers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Resolution</h3>
            <p className="text-gray-600">
              Authorities resolve the issue while you track status.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-gray-900 text-white py-8 text-center">

        <p className="opacity-80">
          © 2026 CivicFix – Smart Civic Reporting System
        </p>

      </footer>

    </div>

  );
}