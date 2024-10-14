import React from "react";
import dayjs from "dayjs";
import { FilingData } from "./FilingData";
import { FaExclamationCircle } from 'react-icons/fa'; // Import the icon

interface GenerateCalendarDaysProps {
  currentDate: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs | null;
  filteredTasks: { [date: string]: FilingData[] };
  handleDateClick: (date: dayjs.Dayjs) => void;
}

const generateCalendarDays = ({
  currentDate,
  selectedDate,
  filteredTasks,
  handleDateClick,
}: GenerateCalendarDaysProps): JSX.Element[] => {
  const days: JSX.Element[] = [];
  const firstDayOfMonth = dayjs()
    .year(currentDate.year())
    .month(currentDate.month())
    .date(1)
    .day();
  const daysInMonth = dayjs()
    .year(currentDate.year())
    .month(currentDate.month())
    .daysInMonth();

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = dayjs()
      .year(currentDate.year())
      .month(currentDate.month())
      .date(day);
    const isSelected = date.isSame(selectedDate, "day");
    const isToday = date.isSame(dayjs(), "day");
    const dateKey = date.format("YYYY-MM-DD");
    const tasksForDay = filteredTasks[dateKey] || [];
    
    const taskCount = tasksForDay.length;
    
    const closedTaskCount = tasksForDay.filter(
      (task) => task.status.toLowerCase() === "closed"
    ).length;
    const allTasksClosed = taskCount > 0 && closedTaskCount === taskCount;
    const pendingTasks = tasksForDay.some(
      (task) => task.status.toLowerCase() === "pending"
    );
    const hasUnuploadedDocs = tasksForDay.some(
      (task) => !task.docIsUploaded && task.status === "Closed"
    );

    days.push(
      <div
        key={day}
        className={`calendar-day ${isSelected ? "selected" : ""} ${
          isToday ? "today" : ""
        }`}
        onClick={() => handleDateClick(date)}
      >
        <div className="day-number">{day}</div>
        {taskCount > 0 && (
          <div className={`task-count ${allTasksClosed ? "all-closed" : ""}`}>
            {closedTaskCount} / {taskCount} closed
            {pendingTasks && <span className="warning-symbol">⚠️</span>}
            {hasUnuploadedDocs && (
              <div className="exclamation-symbol" title="Some documents are not uploaded">
                <FaExclamationCircle />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return days;
};

export default generateCalendarDays;
