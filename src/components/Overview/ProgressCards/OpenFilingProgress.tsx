import * as React from "react";
import "../ProgressCards/Card.css";
import { FilingProgressProps } from "../../../utility/DataContext/FilingData";

const OpenFilingProgress: React.FC<FilingProgressProps> = ({
  openFilingsCount,
  totalFilingsCount,
}) => {
  const strokeWidth: number = 12;
  const radius: number = 40;
  const circumference: number = 2 * Math.PI * radius;

  const progress: number = (openFilingsCount / totalFilingsCount) * 100;
  const strokeDasharray: number = circumference;
  const strokeDashoffset: number =
    circumference - (progress / 100) * circumference * (300 / 360);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Open Filings</h3>
          <svg width={radius * 2} height={radius * 2}>
            <circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              fill="transparent"
              stroke="lightblue"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              fill="transparent"
              stroke="blue"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90, ${radius}, ${radius})`}
            />
            <text
              x={radius}
              y={radius}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12px"
              fontWeight="900"
            >
              {openFilingsCount}/{totalFilingsCount}
            </text>
          </svg>
        </div>
      </div>
    </>
  );
};

export default OpenFilingProgress;
