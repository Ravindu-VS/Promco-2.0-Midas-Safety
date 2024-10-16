import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import './SectionTable.css'; // Adjust the path if necessary


const SectionTable = () => {
  const [sections, setSections] = useState([]); // State to store section data
  const [newSection, setNewSection] = useState({
    id: "",
    mainSection: "",
    subSection: "",
    machineType: "",
    parameterToleranced: "",
    threshold: "",
    hasDeleted: false,
    creatorId: "",
    modifierId: "",
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    plannedEpld: "",
    parameterShortName: "",
    sortNumber: "",
    isDynamic: false,
    equation: "",
  }); // State for new section input
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch initial section data (mocked for demonstration)
  useEffect(() => {
    const initialData = [
      {
        id: "1",
        mainSection: "Main A",
        subSection: "Sub A1",
        machineType: "Type A",
        parameterToleranced: "Tolerance A",
        threshold: 5,
        hasDeleted: false,
        creatorId: "Admin",
        modifierId: "Admin",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-12-31",
        parameterShortName: "Param A",
        sortNumber: 1,
        isDynamic: true,
        equation: "x + y = z",
      },
      {
        id: "2",
        mainSection: "Main B",
        subSection: "Sub B1",
        machineType: "Type B",
        parameterToleranced: "Tolerance B",
        threshold: 10,
        hasDeleted: false,
        creatorId: "Admin",
        modifierId: "Admin",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plannedEpld: "2024-11-30",
        parameterShortName: "Param B",
        sortNumber: 2,
        isDynamic: false,
        equation: "x - y = z",
      },
    ];
    setSections(initialData);
  }, []);

  // Handle adding a new section
  const handleAddSection = () => {
    const newSectionData = {
      ...newSection,
      createdTime: new Date().toISOString(), // Set created time
      modifiedTime: new Date().toISOString(), // Set modified time
    };
    setSections([...sections, newSectionData]);
    setNewSection({
      id: "",
      mainSection: "",
      subSection: "",
      machineType: "",
      parameterToleranced: "",
      threshold: "",
      hasDeleted: false,
      creatorId: "",
      modifierId: "",
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      plannedEpld: "",
      parameterShortName: "",
      sortNumber: "",
      isDynamic: false,
      equation: "",
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {/* Form for adding new sections */}
      <div className="mb-4">
        <TextField
          label="ID"
          variant="outlined"
          value={newSection.id}
          onChange={(e) => setNewSection({ ...newSection, id: e.target.value })}
          className="mr-2"
        />
        <TextField
          label="Main Section"
          variant="outlined"
          value={newSection.mainSection}
          onChange={(e) =>
            setNewSection({ ...newSection, mainSection: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Sub Section"
          variant="outlined"
          value={newSection.subSection}
          onChange={(e) =>
            setNewSection({ ...newSection, subSection: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Machine Type"
          variant="outlined"
          value={newSection.machineType}
          onChange={(e) =>
            setNewSection({ ...newSection, machineType: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Parameter Toleranced"
          variant="outlined"
          value={newSection.parameterToleranced}
          onChange={(e) =>
            setNewSection({
              ...newSection,
              parameterToleranced: e.target.value,
            })
          }
          className="mr-2"
        />
        <TextField
          label="Threshold"
          type="number"
          variant="outlined"
          value={newSection.threshold}
          onChange={(e) =>
            setNewSection({ ...newSection, threshold: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Creator ID"
          variant="outlined"
          value={newSection.creatorId}
          onChange={(e) =>
            setNewSection({ ...newSection, creatorId: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Modifier ID"
          variant="outlined"
          value={newSection.modifierId}
          onChange={(e) =>
            setNewSection({ ...newSection, modifierId: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Planned Epld"
          variant="outlined"
          value={newSection.plannedEpld}
          onChange={(e) =>
            setNewSection({ ...newSection, plannedEpld: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Parameter Short Name"
          variant="outlined"
          value={newSection.parameterShortName}
          onChange={(e) =>
            setNewSection({
              ...newSection,
              parameterShortName: e.target.value,
            })
          }
          className="mr-2"
        />
        <TextField
          label="Sort Number"
          type="number"
          variant="outlined"
          value={newSection.sortNumber}
          onChange={(e) =>
            setNewSection({ ...newSection, sortNumber: e.target.value })
          }
          className="mr-2"
        />
        <TextField
          label="Is Dynamic"
          type="checkbox"
          checked={newSection.isDynamic}
          onChange={(e) =>
            setNewSection({ ...newSection, isDynamic: e.target.checked })
          }
          className="mr-2"
        />
        <TextField
          label="Equation"
          variant="outlined"
          value={newSection.equation}
          onChange={(e) =>
            setNewSection({ ...newSection, equation: e.target.value })
          }
          className="mr-2"
        />
        <Button variant="contained" color="primary" onClick={handleAddSection}>
          Add Section
        </Button>
      </div>

      {/* Section Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Main Section</TableCell>
              <TableCell>Sub Section</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>Parameter Toleranced</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Has Deleted</TableCell>
              <TableCell>Creator ID</TableCell>
              <TableCell>Modifier ID</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Modified Time</TableCell>
              <TableCell>Planned Epld</TableCell>
              <TableCell>Parameter Short Name</TableCell>
              <TableCell>Sort Number</TableCell>
              <TableCell>Is Dynamic</TableCell>
              <TableCell>Equation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((section, index) => (
                <TableRow key={index}>
                  <TableCell>{section.id}</TableCell>
                  <TableCell>{section.mainSection}</TableCell>
                  <TableCell>{section.subSection}</TableCell>
                  <TableCell>{section.machineType}</TableCell>
                  <TableCell>{section.parameterToleranced}</TableCell>
                  <TableCell>{section.threshold}</TableCell>
                  <TableCell>{section.hasDeleted ? "Yes" : "No"}</TableCell>
                  <TableCell>{section.creatorId}</TableCell>
                  <TableCell>{section.modifierId}</TableCell>
                  <TableCell>{section.createdTime}</TableCell>
                  <TableCell>{section.modifiedTime}</TableCell>
                  <TableCell>{section.plannedEpld}</TableCell>
                  <TableCell>{section.parameterShortName}</TableCell>
                  <TableCell>{section.sortNumber}</TableCell>
                  <TableCell>{section.isDynamic ? "Yes" : "No"}</TableCell>
                  <TableCell>{section.equation}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default SectionTable;
