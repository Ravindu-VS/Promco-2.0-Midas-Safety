import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";
import { masterDataApi } from "../services/api";
import { errorMessage } from "../services/authService";
import "./MasterData.css";

// API table name -> page route
const ROUTES = {
  "plant-departments": "/plant-department",
  "machine-types": "/machine-type",
  "main-sections": "/main-section",
  "sub-sections": "/sub-section",
  "material-codes": "/material-code",
  parameters: "/parameter",
  "parameter-norms": "/parameter-norm",
  "parameter-qualified-values": "/parameter-qualified-value",
  tolerances: "/tolerance",
  sections: "/section",
  "section-templates": "/section-template",
  shifts: "/shift",
  "plant-dept-users": "/plant-dept-abp-user",
};

const MasterData = () => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    masterDataApi.tables().then(setTables).catch((e) => setError(errorMessage(e, "Could not load master data")));
  }, []);

  return (
    <div className="master-data-page">
      <h2 className="page-title">Master Data</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Reference data used by machines, sections, parameters and shifts. Start with Plant Departments,
        then Machine Types and Sections – other tables link to them.
      </p>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((t) => (
          <Link
            key={t.name}
            to={ROUTES[t.name]}
            className="flex justify-between items-center rounded-xl p-5 shadow-md hover:shadow-lg border-l-4 border-primary bg-white/70 dark:bg-gray-800/70 transition"
          >
            <span className="font-semibold">{t.label}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t.count} record{t.count === 1 ? "" : "s"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MasterData;
