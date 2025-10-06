import type { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '../../lib/database';

type Doctor = {
  id?: number;
  name: string;
  specialization: string;
  image: string;
  schedule?: string;
  phone?: string;
  email?: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data?: Doctor | Doctor[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getDoctors(req, res);
      case 'POST':
        return await createDoctor(req, res);
      case 'PUT':
        return await updateDoctor(req, res);
      case 'DELETE':
        return await deleteDoctor(req, res);
      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getDoctors(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  
  try {
    let query = 'SELECT * FROM doctors';
    let values: any[] = [];
    
    if (id) {
      query += ' WHERE id = ?';
      values = [id];
    }
    
    const doctors = await executeQuery(query, values);
    
    return res.status(200).json({
      success: true,
      message: id ? 'Doctor retrieved successfully' : 'Doctors retrieved successfully',
      data: doctors
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors',
      error: error instanceof Error ? error.message : 'Database error'
    });
  }
}

async function createDoctor(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { name, specialization, image, schedule, phone, email } = req.body;
  
  if (!name || !specialization || !image) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, specialization, image'
    });
  }
  
  try {
    const query = `
      INSERT INTO doctors (name, specialization, image, schedule, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, specialization, image, schedule || null, phone || null, email || null];
    
    const result = await executeQuery(query, values);
    
    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { id: (result as any).insertId, name, specialization, image, schedule, phone, email }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create doctor',
      error: error instanceof Error ? error.message : 'Database error'
    });
  }
}

async function updateDoctor(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  const { name, specialization, image, schedule, phone, email } = req.body;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Doctor ID is required'
    });
  }
  
  try {
    const query = `
      UPDATE doctors 
      SET name = ?, specialization = ?, image = ?, schedule = ?, phone = ?, email = ?
      WHERE id = ?
    `;
    const values = [name, specialization, image, schedule, phone, email, id];
    
    await executeQuery(query, values);
    
    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update doctor',
      error: error instanceof Error ? error.message : 'Database error'
    });
  }
}

async function deleteDoctor(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Doctor ID is required'
    });
  }
  
  try {
    const query = 'DELETE FROM doctors WHERE id = ?';
    await executeQuery(query, [id]);
    
    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error instanceof Error ? error.message : 'Database error'
    });
  }
}