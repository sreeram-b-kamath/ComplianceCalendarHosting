import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./Calendar.css";
import TaskWindow from "./TaskWindow/TaskWindow";
import DataContext from "../../utility/DataContext/DataContext";
import FilterCalendar from "./FilterCalendar";
import generateCalendarDays from "../../utility/DataContext/GenerateCalendarDays";
import { useLocation } from "react-router-dom";
import profileDetails from "../../auth/api/authApi";
import { FilingData } from "../../utility/DataContext/FilingData";

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [jsonData, setJsonData] = useState<FilingData[]>([]);
  const [, setTasks] = useState<{ [date: string]: FilingData[] }>({});
  const [filteredTasks, setFilteredTasks] = useState<{
    [date: string]: FilingData[];
  }>({});
  const [selectedObject, setSelectedObject] = useState<FilingData[]>([]);

  const [statuteFilter, setStatuteFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  const [uniqueStatutes, setUniqueStatutes] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const location = useLocation();
  const { date } = location.state || { date: "" };
  const dateToNavigate = date;

  const { updateCounter } = location.state || { updateCounter: null };
  const statusChange = updateCounter;
  

  // Define useFetchData function
  const useFetchData = async (year: number): Promise<FilingData[]> => {
    try {
      // Adjust the year based on financial year (April to March)
      const { RoleName, EmployeeId } = profileDetails; 
  
      const isJanToMarch = currentDate.month() < 3;
      const apiYear = isJanToMarch ? year - 1 : year; 
  
      let response;
      if (RoleName === "Admin") {
        response = await fetch(
          `https://compliancecalendarbackendhosting.onrender.com/Filings/GetAdminFilings/${EmployeeId}?year=${apiYear}`
        );
      } else {
        response = await fetch(
          `https://compliancecalendarbackendhosting.onrender.com/Filings/GetUserFilings/${EmployeeId}?year=${apiYear}`
        );
      }
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  
  

  useEffect(() => {
    const getData = async () => {
      const data = await useFetchData(currentDate.year());
      setJsonData(data);
    };

    getData();
  }, [currentDate, statusChange]);


  // Process the fetched data
  useEffect(() => {
    if (jsonData.length === 0) return;

    const tasksByDate: { [date: string]: FilingData[] } = {};
    const statutesSet = new Set<string>();
    const statusesSet = new Set<string>();
    const departmentsSet = new Set<string>();

    jsonData.forEach((item) => {
      const dateKey = dayjs(item.dueDate).format("YYYY-MM-DD");
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(item);
      statutesSet.add(item.statuteOrAct);
      statusesSet.add(item.status);
      departmentsSet.add(item.depName);
    });

    setTasks(tasksByDate);
    setFilteredTasks(tasksByDate);

    setUniqueStatutes(Array.from(statutesSet));
    setUniqueStatuses(Array.from(statusesSet));
    setUniqueDepartments(Array.from(departmentsSet));
  }, [jsonData]);

  // Filter tasks based on filters
  useEffect(() => {
    if (jsonData.length === 0) return;

    const filtered: { [date: string]: FilingData[] } = {};

    jsonData.forEach((item) => {
      const matchesStatute = statuteFilter
        ? item.statuteOrAct === statuteFilter
        : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesDepartment = departmentFilter
        ? item.depName === departmentFilter
        : true;

      if (matchesStatute && matchesStatus && matchesDepartment) {
        const dateKey = dayjs(item.dueDate).format("YYYY-MM-DD");
        if (!filtered[dateKey]) {
          filtered[dateKey] = [];
        }
        filtered[dateKey].push(item);
      }
    });

    setFilteredTasks(filtered);
  }, [statuteFilter, statusFilter, departmentFilter, jsonData]);

  const handleDateClick = (date: dayjs.Dayjs) => {
    setSelectedDate(date);

    const dateKey = date.format("YYYY-MM-DD");
    const selectedObjects = jsonData.filter(
      (item) => dayjs(item.dueDate).format("YYYY-MM-DD") === dateKey
    );
    setSelectedObject(selectedObjects);
  };

  // Navigate to the date when coming from another program
  useEffect(() => {
    if (dateToNavigate) {
      const newDate = dayjs(dateToNavigate);
      setCurrentDate(newDate);
      handleDateClick(newDate); // Simulate clicking the date
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateToNavigate]);

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate =
        direction === "prev"
          ? prevDate.subtract(1, "month")
          : prevDate.add(1, "month");
  
      // If navigating between March and April, adjust the year in the API call
      if (newDate.month() < 3 || newDate.month() >= 3) {
        const newYear = newDate.year();
        useFetchData(newYear);
      }
  
      return newDate;
    });
  };
  

  const handleFilterChange = (
    filterType: "statute" | "status" | "department",
    value: string
  ) => {
    switch (filterType) {
      case "statute":
        setStatuteFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "department":
        setDepartmentFilter(value);
        break;
    }
  };

  const monthOptions = shortMonths.map((monthName, index) => (
    <option key={index} value={index}>
      {monthName}
    </option>
  ));

  const yearOptions = Array.from({ length: 11 }, (_, i) => (
    <option key={2020 + i} value={2020 + i}>
      {2020 + i}
    </option>
  ));

  return (
    <>
      <div className="calendar">
        <FilterCalendar
          statuteFilter={statuteFilter}
          statusFilter={statusFilter}
          departmentFilter={departmentFilter}
          uniqueStatutes={uniqueStatutes}
          uniqueStatuses={uniqueStatuses}
          uniqueDepartments={uniqueDepartments}
          handleFilterChange={handleFilterChange}
        />
        <div className="calendar-header">
          <button
            className="monthchangearrows"
            onClick={() => changeMonth("prev")}
          >
            &lt;
          </button>
          <select
            className="month-dropdown"
            value={currentDate.month()}
            onChange={(e) =>
              setCurrentDate(currentDate.month(parseInt(e.target.value)))
            }
          >
            {monthOptions}
          </select>
          <select
            className="year-dropdown"
            value={currentDate.year()}
            onChange={(e) =>
              setCurrentDate(currentDate.year(parseInt(e.target.value)))
            }
          >
            {yearOptions}
          </select>
          <button
            className="monthchangearrows"
            onClick={() => changeMonth("next")}
          >
            &gt;
          </button>
        </div>
        <div className="calendar-weekdays">
          {weekdays.map((weekday, index) => (
            <div key={index} className="calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>
        <div className="calendar-body">
          {generateCalendarDays({
            currentDate,
            selectedDate,
            filteredTasks,
            handleDateClick,
          })}
        </div>
      </div>
      <DataContext.Provider value ={selectedObject}>
        <TaskWindow selectedDate={selectedDate} currentDate={currentDate} />
      </DataContext.Provider>
    </>
  );
};

export default Calendar;
 