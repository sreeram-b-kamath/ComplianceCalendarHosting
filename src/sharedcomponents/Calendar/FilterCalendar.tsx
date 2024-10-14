import React from "react";
import { FilterComponentProps } from "../../utility/DataContext/FilingData";
import profileDetails from "../../auth/api/authApi";


const FilterCalendar: React.FC<FilterComponentProps> = ({
  statuteFilter,
  statusFilter,
  departmentFilter,
  uniqueStatutes,
  uniqueStatuses,
  uniqueDepartments,
  handleFilterChange,
}) => {
  const {RoleName} = profileDetails;
  return (
    <div className="filter">
      <div className="filter-items">
        <select
          name="act-filter"
          onChange={(e) => handleFilterChange("statute", e.target.value)}
          value={statuteFilter}
          style={{
            width: "115px",
            overflowX: "auto",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "Montserrat",
          }}
        >
          <option value="">STATUTE/ACT</option>
          {uniqueStatutes.map((statute, index) => (
            <option key={index} value={statute}>
              {statute}
            </option>
          ))}
        </select>
        <select
          name="status-filter"
          onChange={(e) => handleFilterChange("status", e.target.value)}
          value={statusFilter}
          style={{
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "Montserrat",
          }}
        >
          <option value="">STATUS</option>
          {uniqueStatuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          name="department-filter"
          onChange={(e) => handleFilterChange("department", e.target.value)}
          value={departmentFilter}
          style={{
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "Montserrat",
            display : RoleName === "Admin" ? "block" : "none",
          }}
        >
          <option value="">DEPARTMENT</option>
          {uniqueDepartments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterCalendar;
