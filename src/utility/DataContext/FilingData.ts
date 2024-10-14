import { PaletteOptions } from "@mui/material/styles/createPalette";


interface Assignees{
  empName : string;
}
export interface FilingData {
  filingId: number;
  dueDate: string;
  depName: string;
  statuteOrAct: string;
  formChallan: string;
  particulars: string;
  status: string;
  assignedTo: Assignees[];
  assignedToId : number;
  email: string;
  docIsUploaded: boolean;
  review: string;
  remarks : string;
}

export interface RoleData {
  employeeId : number;
  empName : string;
  email :string;
  depName : string;
  roleName : string
}

export interface DepartmentData {
  id : number;
  depName : string;
}

export interface FilterComponentProps {
  statuteFilter: string;
  statusFilter: string;
  departmentFilter: string;
  uniqueStatutes: string[];
  uniqueStatuses: string[];
  uniqueDepartments: string[];
  handleFilterChange: (
    filterType: "statute" | "status" | "department",
    value: string
  ) => void;
}

export interface FilingProgressProps{
  openFilingsCount: number;
  closedFilingsCount: number;
  pendingFilingsCount: number;
  totalFilingsCount: number;
}

export interface CustomPaletteOptions extends PaletteOptions {
  customColors?: {
    light: string;
    select: string;
    dark: string;
  };
}
