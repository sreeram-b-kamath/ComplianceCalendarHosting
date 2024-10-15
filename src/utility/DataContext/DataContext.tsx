import React from "react";
import { FilingData } from "./FilingData";

// Change the default value of DataContext to be an array of FilingData
const DataContext = React.createContext<FilingData[]>([]);

export default DataContext;
