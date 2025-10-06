import type { NextApiRequest, NextApiResponse } from 'next';
import { testConnection, executeQuery } from '../../lib/database';

type Data = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Test database connection
    const connectionTest = await testConnection();
    
    if (!connectionTest) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: 'Unable to connect to database'
      });
    }

    // Try to show databases (this will work if connection is successful)
    try {
      const databases = await executeQuery('SHOW DATABASES');
      
      return res.status(200).json({
        success: true,
        message: 'Database connection successful!',
        data: {
          connectionStatus: 'Connected',
          availableDatabases: databases
        }
      });
    } catch (queryError) {
      return res.status(200).json({
        success: true,
        message: 'Database connection successful, but query test failed',
        data: {
          connectionStatus: 'Connected',
          queryError: 'Could not execute test query'
        }
      });
    }
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}