const express = require('express');
const router = express.Router();
const { sql, pool } = require('../config/db');
const authenticate = require('../middleware/authenticate');

// Development mode flag
const DEV_MODE = process.env.DEV_MODE === 'true';

// Sample machines data for development mode
const sampleMachines = [
  {
    Id: 1,
    Name: 'Cutting Machine A1',
    Code: 'CM-A001',
    MachineTypeId: 1,
    TypeName: 'Cutting Machine',
    MainSectionId: 1,
    SectionName: 'Production',
    SubSectionId: 1,
    SubSectionName: 'Cutting Department',
    SerialNumber: 'SN12345',
    Manufacturer: 'Machine Corp',
    ModelNumber: 'CT-2000',
    ManufactureYear: 2020,
    InstallDate: new Date('2020-06-15'),
    Status: 'Active'
  },
  {
    Id: 2,
    Name: 'Packaging Machine B2',
    Code: 'PM-B002',
    MachineTypeId: 2,
    TypeName: 'Packaging',
    MainSectionId: 1,
    SectionName: 'Production',
    SubSectionId: 2,
    SubSectionName: 'Packaging Department',
    SerialNumber: 'SN67890',
    Manufacturer: 'Pack Systems',
    ModelNumber: 'PS-1500',
    ManufactureYear: 2021,
    InstallDate: new Date('2021-03-10'),
    Status: 'Active'
  }
];

// Get all machines
router.get('/', authenticate(), async (req, res) => {
  try {
    // Use sample data in development mode
    if (DEV_MODE) {
      console.log('Using development mode for machines list');
      return res.json(sampleMachines);
    }
    
    await pool.connect();
    
    const result = await pool.request().query(`
      SELECT m.*, mt.Name as TypeName, ms.Name as SectionName, ss.Name as SubSectionName
      FROM Machines m
      LEFT JOIN MachineTypes mt ON m.MachineTypeId = mt.Id
      LEFT JOIN MainSections ms ON m.MainSectionId = ms.Id
      LEFT JOIN SubSections ss ON m.SubSectionId = ss.Id
    `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching machines:', err);
    if (DEV_MODE) {
      // Return sample data even if there's an error
      return res.json(sampleMachines);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve machines' });
  }
});

// Get machine by ID
router.get('/:id', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use sample data in development mode
    if (DEV_MODE) {
      const machine = sampleMachines.find(m => m.Id == id);
      if (!machine) {
        return res.status(404).json({ error: true, message: 'Machine not found' });
      }
      return res.json(machine);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT m.*, mt.Name as TypeName, ms.Name as SectionName, ss.Name as SubSectionName
        FROM Machines m
        LEFT JOIN MachineTypes mt ON m.MachineTypeId = mt.Id
        LEFT JOIN MainSections ms ON m.MainSectionId = ms.Id
        LEFT JOIN SubSections ss ON m.SubSectionId = ss.Id
        WHERE m.Id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: true, message: 'Machine not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching machine:', err);
    if (DEV_MODE) {
      // Try sample data if there's an error
      const machine = sampleMachines.find(m => m.Id == id);
      if (machine) {
        return res.json(machine);
      }
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve machine' });
  }
});

// Create a new machine
router.post('/', authenticate(['admin', 'manager']), async (req, res) => {
  try {
    const { 
      name, 
      code,
      machineTypeId,
      mainSectionId,
      subSectionId,
      serialNumber,
      manufacturer,
      modelNumber,
      manufactureYear,
      installDate,
      status
    } = req.body;
    
    // Input validation
    if (!name || !code || !machineTypeId || !mainSectionId) {
      return res.status(400).json({ 
        error: true, 
        message: 'Name, code, machine type, and main section are required' 
      });
    }
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Creating machine in development mode');
      return res.status(201).json({ 
        message: 'Machine created successfully (DEV MODE)',
        machineId: Math.floor(Math.random() * 1000) + 10
      });
    }
    
    await pool.connect();
    
    // Insert new machine
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('code', sql.VarChar, code)
      .input('machineTypeId', sql.Int, machineTypeId)
      .input('mainSectionId', sql.Int, mainSectionId)
      .input('subSectionId', sql.Int, subSectionId || null)
      .input('serialNumber', sql.VarChar, serialNumber || null)
      .input('manufacturer', sql.VarChar, manufacturer || null)
      .input('modelNumber', sql.VarChar, modelNumber || null)
      .input('manufactureYear', sql.Int, manufactureYear || null)
      .input('installDate', sql.Date, installDate ? new Date(installDate) : null)
      .input('status', sql.VarChar, status || 'Active')
      .query(`
        INSERT INTO Machines (
          Name, Code, MachineTypeId, MainSectionId, SubSectionId,
          SerialNumber, Manufacturer, ModelNumber, ManufactureYear, InstallDate, Status
        )
        VALUES (
          @name, @code, @machineTypeId, @mainSectionId, @subSectionId,
          @serialNumber, @manufacturer, @modelNumber, @manufactureYear, @installDate, @status
        );
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    
    const machineId = result.recordset[0].Id;
    
    res.status(201).json({ 
      message: 'Machine created successfully',
      machineId 
    });
  } catch (err) {
    console.error('Error creating machine:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.status(201).json({ 
        message: 'Machine created successfully (DEV MODE - Error Fallback)',
        machineId: Math.floor(Math.random() * 1000) + 10
      });
    }
    res.status(500).json({ error: true, message: 'Failed to create machine' });
  }
});

// Update machine
router.put('/:id', authenticate(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      code,
      machineTypeId,
      mainSectionId,
      subSectionId,
      serialNumber,
      manufacturer,
      modelNumber,
      manufactureYear,
      installDate,
      status
    } = req.body;
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Updating machine in development mode:', id);
      
      // Check if machine exists in sample data
      const machineIndex = sampleMachines.findIndex(m => m.Id == id);
      if (machineIndex === -1) {
        return res.status(404).json({ error: true, message: 'Machine not found' });
      }
      
      return res.json({ 
        message: 'Machine updated successfully (DEV MODE)',
        machineId: id
      });
    }
    
    await pool.connect();
    
    // Build dynamic update query
    let updateQuery = 'UPDATE Machines SET ';
    const inputs = [];
    
    if (name) inputs.push('Name = @name');
    if (code) inputs.push('Code = @code');
    if (machineTypeId) inputs.push('MachineTypeId = @machineTypeId');
    if (mainSectionId) inputs.push('MainSectionId = @mainSectionId');
    if (subSectionId !== undefined) inputs.push('SubSectionId = @subSectionId');
    if (serialNumber !== undefined) inputs.push('SerialNumber = @serialNumber');
    if (manufacturer !== undefined) inputs.push('Manufacturer = @manufacturer');
    if (modelNumber !== undefined) inputs.push('ModelNumber = @modelNumber');
    if (manufactureYear !== undefined) inputs.push('ManufactureYear = @manufactureYear');
    if (installDate !== undefined) inputs.push('InstallDate = @installDate');
    if (status) inputs.push('Status = @status');
    
    updateQuery += inputs.join(', ') + ' WHERE Id = @id';
    
    // Execute update
    const request = pool.request().input('id', sql.Int, id);
    
    if (name) request.input('name', sql.VarChar, name);
    if (code) request.input('code', sql.VarChar, code);
    if (machineTypeId) request.input('machineTypeId', sql.Int, machineTypeId);
    if (mainSectionId) request.input('mainSectionId', sql.Int, mainSectionId);
    if (subSectionId !== undefined) request.input('subSectionId', sql.Int, subSectionId || null);
    if (serialNumber !== undefined) request.input('serialNumber', sql.VarChar, serialNumber || null);
    if (manufacturer !== undefined) request.input('manufacturer', sql.VarChar, manufacturer || null);
    if (modelNumber !== undefined) request.input('modelNumber', sql.VarChar, modelNumber || null);
    if (manufactureYear !== undefined) request.input('manufactureYear', sql.Int, manufactureYear || null);
    if (installDate !== undefined) request.input('installDate', sql.Date, installDate ? new Date(installDate) : null);
    if (status) request.input('status', sql.VarChar, status);
    
    const result = await request.query(updateQuery);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'Machine not found' });
    }
    
    res.json({ message: 'Machine updated successfully' });
  } catch (err) {
    console.error('Error updating machine:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ 
        message: 'Machine updated successfully (DEV MODE - Error Fallback)',
        machineId: req.params.id
      });
    }
    res.status(500).json({ error: true, message: 'Failed to update machine' });
  }
});

// Delete machine
router.delete('/:id', authenticate(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Deleting machine in development mode:', id);
      
      // Check if machine exists in sample data
      const machineIndex = sampleMachines.findIndex(m => m.Id == id);
      if (machineIndex === -1) {
        return res.status(404).json({ error: true, message: 'Machine not found' });
      }
      
      return res.json({ message: 'Machine deleted successfully (DEV MODE)' });
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Machines WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'Machine not found' });
    }
    
    res.json({ message: 'Machine deleted successfully' });
  } catch (err) {
    console.error('Error deleting machine:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ message: 'Machine deleted successfully (DEV MODE - Error Fallback)' });
    }
    res.status(500).json({ error: true, message: 'Failed to delete machine' });
  }
});

// Sample maintenance records for development mode
const sampleMaintenanceRecords = {
  1: [
    { 
      Id: 101, 
      MachineId: 1, 
      MaintenanceType: 'Preventive', 
      Description: 'Regular monthly maintenance',
      TechnicianId: 3,
      MaintenanceDate: new Date('2025-07-15'),
      CompletionDate: new Date('2025-07-15'),
      Status: 'Completed',
      Notes: 'All systems normal, replaced air filter'
    },
    { 
      Id: 102, 
      MachineId: 1, 
      MaintenanceType: 'Repair', 
      Description: 'Fixed motor alignment',
      TechnicianId: 2,
      MaintenanceDate: new Date('2025-06-20'),
      CompletionDate: new Date('2025-06-21'),
      Status: 'Completed',
      Notes: 'Motor realigned, tested and working properly'
    }
  ],
  2: [
    { 
      Id: 201, 
      MachineId: 2, 
      MaintenanceType: 'Preventive', 
      Description: 'Quarterly inspection',
      TechnicianId: 3,
      MaintenanceDate: new Date('2025-07-01'),
      CompletionDate: new Date('2025-07-01'),
      Status: 'Completed',
      Notes: 'All systems functioning within normal parameters'
    }
  ]
};

// Get machine maintenance history
router.get('/:id/maintenance', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use sample data in development mode
    if (DEV_MODE) {
      console.log('Getting maintenance history for machine in development mode:', id);
      const records = sampleMaintenanceRecords[id] || [];
      return res.json(records);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('machineId', sql.Int, id)
      .query(`
        SELECT * FROM MaintenanceRecords 
        WHERE MachineId = @machineId
        ORDER BY MaintenanceDate DESC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching maintenance history:', err);
    if (DEV_MODE) {
      // Return sample data if there's an error
      const records = sampleMaintenanceRecords[req.params.id] || [];
      return res.json(records);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve maintenance history' });
  }
});

// Sample machine faults for development mode
const sampleMachineFaults = {
  1: [
    { 
      Id: 101, 
      MachineId: 1, 
      Description: 'Motor overheating', 
      Priority: 'High', 
      ReportedBy: 1, 
      ReportDate: new Date('2025-07-28'), 
      Status: 'Open' 
    },
    { 
      Id: 102, 
      MachineId: 1, 
      Description: 'Unusual noise during operation', 
      Priority: 'Medium', 
      ReportedBy: 2, 
      ReportDate: new Date('2025-07-29'), 
      Status: 'In Progress' 
    }
  ],
  2: [
    { 
      Id: 201, 
      MachineId: 2, 
      Description: 'Packaging alignment issue', 
      Priority: 'Medium', 
      ReportedBy: 1, 
      ReportDate: new Date('2025-07-30'), 
      Status: 'Open' 
    }
  ]
};

// Get machine faults
router.get('/:id/faults', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use sample data in development mode
    if (DEV_MODE) {
      console.log('Getting faults for machine in development mode:', id);
      const faults = sampleMachineFaults[id] || [];
      return res.json(faults);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('machineId', sql.Int, id)
      .query(`
        SELECT * FROM MachineFaults 
        WHERE MachineId = @machineId
        ORDER BY ReportDate DESC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching machine faults:', err);
    if (DEV_MODE) {
      // Return sample data if there's an error
      const faults = sampleMachineFaults[req.params.id] || [];
      return res.json(faults);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve machine faults' });
  }
});

// Report a fault for a machine
router.post('/:id/faults', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    const { description, priority, reportedBy } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: true, message: 'Fault description is required' });
    }
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Reporting fault in development mode for machine:', id);
      
      // Create a new fault ID
      const newFaultId = Math.floor(Math.random() * 1000) + 300;
      
      // Add to sample faults if needed
      if (!sampleMachineFaults[id]) {
        sampleMachineFaults[id] = [];
      }
      
      // Add the new fault
      sampleMachineFaults[id].push({
        Id: newFaultId,
        MachineId: parseInt(id),
        Description: description,
        Priority: priority || 'Medium',
        ReportedBy: reportedBy || req.user?.userId || 1,
        ReportDate: new Date(),
        Status: 'Open'
      });
      
      return res.status(201).json({ 
        message: 'Fault reported successfully (DEV MODE)',
        faultId: newFaultId
      });
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('machineId', sql.Int, id)
      .input('description', sql.VarChar, description)
      .input('priority', sql.VarChar, priority || 'Medium')
      .input('reportedBy', sql.Int, reportedBy || req.user.userId)
      .input('reportDate', sql.DateTime, new Date())
      .query(`
        INSERT INTO MachineFaults (
          MachineId, Description, Priority, ReportedBy, ReportDate, Status
        )
        VALUES (
          @machineId, @description, @priority, @reportedBy, @reportDate, 'Open'
        );
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    
    const faultId = result.recordset[0].Id;
    
    res.status(201).json({ 
      message: 'Fault reported successfully',
      faultId 
    });
  } catch (err) {
    console.error('Error reporting fault:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      const newFaultId = Math.floor(Math.random() * 1000) + 300;
      return res.status(201).json({ 
        message: 'Fault reported successfully (DEV MODE - Error Fallback)',
        faultId: newFaultId
      });
    }
    res.status(500).json({ error: true, message: 'Failed to report fault' });
  }
});

module.exports = router;
