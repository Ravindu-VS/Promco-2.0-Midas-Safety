-- Create database
CREATE DATABASE MidasSafety;
GO

USE MidasSafety;
GO

-- Users table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    ProfilePicture NVARCHAR(MAX),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Plant departments
CREATE TABLE PlantDepartments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500)
);
GO

-- Machine types
CREATE TABLE MachineTypes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500)
);
GO

-- Main sections
CREATE TABLE MainSections (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    PlantDepartmentId INT,
    FOREIGN KEY (PlantDepartmentId) REFERENCES PlantDepartments(Id)
);
GO

-- Sub sections
CREATE TABLE SubSections (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    MainSectionId INT NOT NULL,
    FOREIGN KEY (MainSectionId) REFERENCES MainSections(Id)
);
GO

-- Machines table
CREATE TABLE Machines (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    MachineTypeId INT NOT NULL,
    MainSectionId INT NOT NULL,
    SubSectionId INT,
    SerialNumber NVARCHAR(100),
    Manufacturer NVARCHAR(100),
    ModelNumber NVARCHAR(100),
    ManufactureYear INT,
    InstallDate DATE,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active',
    FOREIGN KEY (MachineTypeId) REFERENCES MachineTypes(Id),
    FOREIGN KEY (MainSectionId) REFERENCES MainSections(Id),
    FOREIGN KEY (SubSectionId) REFERENCES SubSections(Id)
);
GO

-- Shifts
CREATE TABLE Shifts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Description NVARCHAR(500)
);
GO

-- Parameters
CREATE TABLE Parameters (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    DataType NVARCHAR(50) NOT NULL,
    Unit NVARCHAR(50),
    MinValue FLOAT,
    MaxValue FLOAT,
    DefaultValue NVARCHAR(100)
);
GO

-- Parameter qualified values (for dropdown/enum parameters)
CREATE TABLE ParameterQualifiedValues (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ParameterId INT NOT NULL,
    Value NVARCHAR(100) NOT NULL,
    DisplayName NVARCHAR(100),
    SortOrder INT,
    FOREIGN KEY (ParameterId) REFERENCES Parameters(Id)
);
GO

-- Material codes
CREATE TABLE MaterialCodes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    Category NVARCHAR(100)
);
GO

-- Machine faults
CREATE TABLE MachineFaults (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MachineId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    Priority NVARCHAR(50) NOT NULL,
    ReportedBy INT NOT NULL,
    ReportDate DATETIME NOT NULL,
    AssignedTo INT,
    Status NVARCHAR(50) NOT NULL,
    ResolutionDate DATETIME,
    ResolutionNotes NVARCHAR(1000),
    FOREIGN KEY (MachineId) REFERENCES Machines(Id),
    FOREIGN KEY (ReportedBy) REFERENCES Users(Id),
    FOREIGN KEY (AssignedTo) REFERENCES Users(Id)
);
GO

-- Maintenance records
CREATE TABLE MaintenanceRecords (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MachineId INT NOT NULL,
    MaintenanceType NVARCHAR(50) NOT NULL,
    MaintenanceDate DATETIME NOT NULL,
    CompletedBy INT NOT NULL,
    Description NVARCHAR(500),
    Notes NVARCHAR(1000),
    FaultId INT, -- Optional reference to a fault that triggered this maintenance
    FOREIGN KEY (MachineId) REFERENCES Machines(Id),
    FOREIGN KEY (CompletedBy) REFERENCES Users(Id),
    FOREIGN KEY (FaultId) REFERENCES MachineFaults(Id)
);
GO

-- Section templates for machine inspections
CREATE TABLE SectionTemplates (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
);
GO

-- Section template parameters
CREATE TABLE SectionTemplateParameters (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SectionTemplateId INT NOT NULL,
    ParameterId INT NOT NULL,
    SortOrder INT,
    IsRequired BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (SectionTemplateId) REFERENCES SectionTemplates(Id),
    FOREIGN KEY (ParameterId) REFERENCES Parameters(Id)
);
GO

-- Tolerance table for parameters
CREATE TABLE Tolerances (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ParameterId INT NOT NULL,
    MachineTypeId INT,
    MaterialCodeId INT,
    MinValue FLOAT,
    MaxValue FLOAT,
    TargetValue FLOAT,
    FOREIGN KEY (ParameterId) REFERENCES Parameters(Id),
    FOREIGN KEY (MachineTypeId) REFERENCES MachineTypes(Id),
    FOREIGN KEY (MaterialCodeId) REFERENCES MaterialCodes(Id)
);
GO

-- Plant department to user mapping
CREATE TABLE PlantDeptAbpUsers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PlantDepartmentId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (PlantDepartmentId) REFERENCES PlantDepartments(Id)
);
GO

-- Parameter norms
CREATE TABLE ParameterNorms (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ParameterId INT NOT NULL,
    MachineId INT NOT NULL,
    MaterialCodeId INT,
    MinValue FLOAT,
    MaxValue FLOAT,
    TargetValue FLOAT,
    FOREIGN KEY (ParameterId) REFERENCES Parameters(Id),
    FOREIGN KEY (MachineId) REFERENCES Machines(Id),
    FOREIGN KEY (MaterialCodeId) REFERENCES MaterialCodes(Id)
);
GO

-- Machine data (measurements/readings)
CREATE TABLE MachineData (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MachineId INT NOT NULL,
    ParameterId INT NOT NULL,
    Value NVARCHAR(100) NOT NULL,
    RecordedDate DATETIME NOT NULL,
    RecordedBy INT NOT NULL,
    ShiftId INT NOT NULL,
    MaterialCodeId INT,
    Notes NVARCHAR(500),
    FOREIGN KEY (MachineId) REFERENCES Machines(Id),
    FOREIGN KEY (ParameterId) REFERENCES Parameters(Id),
    FOREIGN KEY (RecordedBy) REFERENCES Users(Id),
    FOREIGN KEY (ShiftId) REFERENCES Shifts(Id),
    FOREIGN KEY (MaterialCodeId) REFERENCES MaterialCodes(Id)
);
GO

-- Insert initial admin user (password: admin123)
INSERT INTO Users (Username, Email, Password, Role)
VALUES ('admin', 'admin@example.com', '$2b$10$7JXNLgNr4iAHUhnE6Hlj9ODWQTZTaNgMY5vVQiI3kkXaqBrAXTl26', 'admin');
GO
