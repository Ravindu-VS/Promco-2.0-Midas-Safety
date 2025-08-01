const express = require('express');
const router = express.Router();
const { sql, pool } = require('../config/db');
const authenticate = require('../middleware/authenticate');

// Development mode flag
const DEV_MODE = process.env.DEV_MODE === 'true';

// Sample parameters data for development m// Sample qualified values for development mode
const sampleQualifiedValues = {
  1: [ // Temperature parameter qualified values
    { Id: 101, ParameterId: 1, Value: 'Low', MinValue: 15, MaxValue: 30 },
    { Id: 102, ParameterId: 1, Value: 'Normal', MinValue: 31, MaxValue: 60 },
    { Id: 103, ParameterId: 1, Value: 'High', MinValue: 61, MaxValue: 85 }
  ],
  2: [ // Pressure parameter qualified values
    { Id: 201, ParameterId: 2, Value: 'Low', MinValue: 30, MaxValue: 50 },
    { Id: 202, ParameterId: 2, Value: 'Normal', MinValue: 51, MaxValue: 90 },
    { Id: 203, ParameterId: 2, Value: 'High', MinValue: 91, MaxValue: 120 }
  ]
};

// Get parameter qualified values
router.get('/:id/qualified-values', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use sample data in development mode
    if (DEV_MODE) {
      const qualifiedValues = sampleQualifiedValues[id] || [];
      return res.json(qualifiedValues);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('parameterId', sql.Int, id)
      .query(`
        SELECT * FROM ParameterQualifiedValues 
        WHERE ParameterId = @parameterId
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching parameter qualified values:', err);
    if (DEV_MODE) {
      // Try sample data if there's an error
      const qualifiedValues = sampleQualifiedValues[req.params.id] || [];
      return res.json(qualifiedValues);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve parameter qualified values' });
  }
});ameters = [
  {
    Id: 1,
    Name: 'Temperature',
    Code: 'TEMP-001',
    Description: 'Operating temperature of the machine',
    DataType: 'Numeric',
    Unit: '°C',
    MinValue: 15,
    MaxValue: 85,
    DefaultValue: 25,
    IsRequired: true,
    CreatedAt: new Date('2023-01-15')
  },
  {
    Id: 2,
    Name: 'Pressure',
    Code: 'PRESS-002',
    Description: 'Operational pressure level',
    DataType: 'Numeric',
    Unit: 'PSI',
    MinValue: 30,
    MaxValue: 120,
    DefaultValue: 60,
    IsRequired: true,
    CreatedAt: new Date('2023-01-15')
  },
  {
    Id: 3,
    Name: 'Maintenance Status',
    Code: 'MAINT-003',
    Description: 'Current maintenance status',
    DataType: 'String',
    Unit: null,
    MinValue: null,
    MaxValue: null,
    DefaultValue: 'Operational',
    IsRequired: false,
    CreatedAt: new Date('2023-01-20')
  }
];

// Get all parameters
router.get('/', authenticate(), async (req, res) => {
  try {
    // Use sample data in development mode
    if (DEV_MODE) {
      console.log('Using development mode for parameters list');
      return res.json(sampleParameters);
    }
    
    await pool.connect();
    
    const result = await pool.request().query('SELECT * FROM Parameters');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching parameters:', err);
    if (DEV_MODE) {
      // Return sample data if there's an error
      return res.json(sampleParameters);
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve parameters' });
  }
});

// Get parameter by ID
router.get('/:id', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use sample data in development mode
    if (DEV_MODE) {
      const parameter = sampleParameters.find(p => p.Id == id);
      if (!parameter) {
        return res.status(404).json({ error: true, message: 'Parameter not found' });
      }
      return res.json(parameter);
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Parameters WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: true, message: 'Parameter not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching parameter:', err);
    if (DEV_MODE) {
      // Try sample data if there's an error
      const parameter = sampleParameters.find(p => p.Id == id);
      if (parameter) {
        return res.json(parameter);
      }
    }
    res.status(500).json({ error: true, message: 'Failed to retrieve parameter' });
  }
});

// Create a new parameter
router.post('/', authenticate(['admin', 'manager']), async (req, res) => {
  try {
    const { 
      name, 
      code,
      description,
      dataType,
      unit,
      minValue,
      maxValue,
      defaultValue
    } = req.body;
    
    // Input validation
    if (!name || !code || !dataType) {
      return res.status(400).json({ 
        error: true, 
        message: 'Name, code, and data type are required' 
      });
    }
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Creating parameter in development mode');
      return res.status(201).json({ 
        message: 'Parameter created successfully (DEV MODE)',
        parameterId: Math.floor(Math.random() * 1000) + 10
      });
    }
    
    await pool.connect();
    
    // Insert new parameter
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('code', sql.VarChar, code)
      .input('description', sql.VarChar, description || null)
      .input('dataType', sql.VarChar, dataType)
      .input('unit', sql.VarChar, unit || null)
      .input('minValue', sql.Float, minValue || null)
      .input('maxValue', sql.Float, maxValue || null)
      .input('defaultValue', sql.VarChar, defaultValue || null)
      .query(`
        INSERT INTO Parameters (
          Name, Code, Description, DataType, Unit, MinValue, MaxValue, DefaultValue
        )
        VALUES (
          @name, @code, @description, @dataType, @unit, @minValue, @maxValue, @defaultValue
        );
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    
    const parameterId = result.recordset[0].Id;
    
    res.status(201).json({ 
      message: 'Parameter created successfully',
      parameterId 
    });
  } catch (err) {
    console.error('Error creating parameter:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.status(201).json({ 
        message: 'Parameter created successfully (DEV MODE - Error Fallback)',
        parameterId: Math.floor(Math.random() * 1000) + 10
      });
    }
    res.status(500).json({ error: true, message: 'Failed to create parameter' });
  }
});

// Update parameter
router.put('/:id', authenticate(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      code,
      description,
      dataType,
      unit,
      minValue,
      maxValue,
      defaultValue
    } = req.body;
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Updating parameter in development mode:', id);
      
      // Check if parameter exists in sample data
      const parameterIndex = sampleParameters.findIndex(p => p.Id == id);
      if (parameterIndex === -1) {
        return res.status(404).json({ error: true, message: 'Parameter not found' });
      }
      
      return res.json({ 
        message: 'Parameter updated successfully (DEV MODE)',
        parameterId: id
      });
    }
    
    await pool.connect();
    
    // Build dynamic update query
    let updateQuery = 'UPDATE Parameters SET ';
    const inputs = [];
    
    if (name) inputs.push('Name = @name');
    if (code) inputs.push('Code = @code');
    if (description !== undefined) inputs.push('Description = @description');
    if (dataType) inputs.push('DataType = @dataType');
    if (unit !== undefined) inputs.push('Unit = @unit');
    if (minValue !== undefined) inputs.push('MinValue = @minValue');
    if (maxValue !== undefined) inputs.push('MaxValue = @maxValue');
    if (defaultValue !== undefined) inputs.push('DefaultValue = @defaultValue');
    
    updateQuery += inputs.join(', ') + ' WHERE Id = @id';
    
    // Execute update
    const request = pool.request().input('id', sql.Int, id);
    
    if (name) request.input('name', sql.VarChar, name);
    if (code) request.input('code', sql.VarChar, code);
    if (description !== undefined) request.input('description', sql.VarChar, description || null);
    if (dataType) request.input('dataType', sql.VarChar, dataType);
    if (unit !== undefined) request.input('unit', sql.VarChar, unit || null);
    if (minValue !== undefined) request.input('minValue', sql.Float, minValue || null);
    if (maxValue !== undefined) request.input('maxValue', sql.Float, maxValue || null);
    if (defaultValue !== undefined) request.input('defaultValue', sql.VarChar, defaultValue || null);
    
    const result = await request.query(updateQuery);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'Parameter not found' });
    }
    
    res.json({ message: 'Parameter updated successfully' });
  } catch (err) {
    console.error('Error updating parameter:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ 
        message: 'Parameter updated successfully (DEV MODE - Error Fallback)',
        parameterId: req.params.id
      });
    }
    res.status(500).json({ error: true, message: 'Failed to update parameter' });
  }
});

// Delete parameter
router.delete('/:id', authenticate(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle development mode
    if (DEV_MODE) {
      console.log('Deleting parameter in development mode:', id);
      
      // Check if parameter exists in sample data
      const parameterIndex = sampleParameters.findIndex(p => p.Id == id);
      if (parameterIndex === -1) {
        return res.status(404).json({ error: true, message: 'Parameter not found' });
      }
      
      return res.json({ message: 'Parameter deleted successfully (DEV MODE)' });
    }
    
    await pool.connect();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Parameters WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: true, message: 'Parameter not found' });
    }
    
    res.json({ message: 'Parameter deleted successfully' });
  } catch (err) {
    console.error('Error deleting parameter:', err);
    if (DEV_MODE) {
      // Return success in dev mode even if there's an error
      return res.json({ message: 'Parameter deleted successfully (DEV MODE - Error Fallback)' });
    }
    res.status(500).json({ error: true, message: 'Failed to delete parameter' });
  }
});

// Get parameter qualified values
router.get('/:id/qualified-values', authenticate(), async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    const result = await pool.request()
      .input('parameterId', sql.Int, id)
      .query(`
        SELECT * FROM ParameterQualifiedValues 
        WHERE ParameterId = @parameterId
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching qualified values:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve qualified values' });
  }
});

module.exports = router;
