import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import "./Table.css";

// Create a styled TableCell for the header
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.black, // Black text color
  fontWeight: "bold",
}));

const SectionTemplateTable = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    mainSection: "",
    subSection: "",
    machineType: "",
    parameter: "",
    toleranceId: "",
    threshold: "",
    hasDeleted: false,
    creatorId: "",
    modifiedId: "",
    createdTime: "",
    modifiedTime: "",
    plantDepartmentId: "",
    parameterShortName: "",
    sortNumber: "",
    isDynamic: false,
    equation: "",
  });
  const [editingTemplate, setEditingTemplate] = useState(null); // To track the template being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Simulated initial data (can be removed in production)
    const initialData = [
      {
        mainSection: "Section A",
        subSection: "Sub A1",
        machineType: "Machine Type 1",
        parameter: "Parameter A1",
        toleranceId: "TID01",
        threshold: "High",
        hasDeleted: false,
        creatorId: "Creator01",
        modifiedId: "Modifier01",
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        plantDepartmentId: "PD01",
        parameterShortName: "Param A1",
        sortNumber: "1",
        isDynamic: true,
        equation: "x + y = z",
      },
    ];
    setTemplates(initialData);
  }, []);

  const handleAddTemplate = () => {
    // Check if any required field is empty
    if (Object.entries(newTemplate).some(([key, value]) => value.trim() === "")) {
      console.log("Please fill all fields before adding.");
      return;
    }

    const newTemplateData = {
      ...newTemplate,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    // If editing, update the existing template
    if (editingTemplate) {
      const updatedTemplates = templates.map((template) =>
        template === editingTemplate ? { ...newTemplateData } : template
      );
      setTemplates(updatedTemplates);
      setEditingTemplate(null); // Stop editing after save
    } else {
      // Add a new template to the list
      setTemplates((prevTemplates) => [...prevTemplates, newTemplateData]);
    }

    resetNewTemplate(); // Clear input fields after adding or saving
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setNewTemplate({ ...template }); // Populate the form fields with the current template's data
  };

  const handleDeleteTemplate = (templateIndex) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((_, index) => index !== templateIndex)
    );
  };

  const resetNewTemplate = () => {
    setNewTemplate({
      mainSection: "",
      subSection: "",
      machineType: "",
      parameter: "",
      toleranceId: "",
      threshold: "",
      hasDeleted: false,
      creatorId: "",
      modifiedId: "",
      createdTime: "",
      modifiedTime: "",
      plantDepartmentId: "",
      parameterShortName: "",
      sortNumber: "",
      isDynamic: false,
      equation: "",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="table-main-content">
      <h2 className="page-title">Section Template Table</h2>

      {/* Form for adding/editing templates */}
      <div className="form-container">
        <div className="input-row">
          <TextField
            label="Main Section"
            variant="outlined"
            value={newTemplate.mainSection}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, mainSection: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Sub Section"
            variant="outlined"
            value={newTemplate.subSection}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, subSection: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Machine Type"
            variant="outlined"
            value={newTemplate.machineType}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, machineType: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter"
            variant="outlined"
            value={newTemplate.parameter}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, parameter: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Tolerance ID"
            variant="outlined"
            value={newTemplate.toleranceId}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, toleranceId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Threshold"
            variant="outlined"
            value={newTemplate.threshold}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, threshold: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Creator ID"
            variant="outlined"
            value={newTemplate.creatorId}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, creatorId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Modified ID"
            variant="outlined"
            value={newTemplate.modifiedId}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, modifiedId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Plant Department ID"
            variant="outlined"
            value={newTemplate.plantDepartmentId}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, plantDepartmentId: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Parameter Short Name"
            variant="outlined"
            value={newTemplate.parameterShortName}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, parameterShortName: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Sort Number"
            variant="outlined"
            value={newTemplate.sortNumber}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, sortNumber: e.target.value })
            }
            className="input-field"
          />
          <TextField
            label="Equation"
            variant="outlined"
            value={newTemplate.equation}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, equation: e.target.value })
            }
            className="input-field"
          />
        </div>
        <Button
          variant="contained"
          color="error" // Red button for "Add Template"
          onClick={handleAddTemplate}
        >
          {editingTemplate ? "Save Changes" : "Add Template"}
        </Button>
      </div>

      <Table className="table-frame">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Main Section</StyledTableCell>
            <StyledTableCell>Sub Section</StyledTableCell>
            <StyledTableCell>Machine Type</StyledTableCell>
            <StyledTableCell>Parameter</StyledTableCell>
            <StyledTableCell>Tolerance ID</StyledTableCell>
            <StyledTableCell>Threshold</StyledTableCell>
            <StyledTableCell>Has Deleted</StyledTableCell>
            <StyledTableCell>Creator ID</StyledTableCell>
            <StyledTableCell>Modified ID</StyledTableCell>
            <StyledTableCell>Created Time</StyledTableCell>
            <StyledTableCell>Modified Time</StyledTableCell>
            <StyledTableCell>Plant Department ID</StyledTableCell>
            <StyledTableCell>Parameter Short Name</StyledTableCell>
            <StyledTableCell>Sort Number</StyledTableCell>
            <StyledTableCell>Is Dynamic</StyledTableCell>
            <StyledTableCell>Equation</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((template, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{template.mainSection}</TableCell>
                <TableCell>{template.subSection}</TableCell>
                <TableCell>{template.machineType}</TableCell>
                <TableCell>{template.parameter}</TableCell>
                <TableCell>{template.toleranceId}</TableCell>
                <TableCell>{template.threshold}</TableCell>
                <TableCell>{template.hasDeleted ? "Yes" : "No"}</TableCell>
                <TableCell>{template.creatorId}</TableCell>
                <TableCell>{template.modifiedId}</TableCell>
                <TableCell>{template.createdTime}</TableCell>
                <TableCell>{template.modifiedTime}</TableCell>
                <TableCell>{template.plantDepartmentId}</TableCell>
                <TableCell>{template.parameterShortName}</TableCell>
                <TableCell>{template.sortNumber}</TableCell>
                <TableCell>{template.isDynamic ? "Yes" : "No"}</TableCell>
                <TableCell>{template.equation}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleDeleteTemplate(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      style={{ color: "#be171d" }}
                      onClick={() => handleEditTemplate(template)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={templates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default SectionTemplateTable;
