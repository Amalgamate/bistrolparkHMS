// Utility functions for working with web workers

// Create a worker instance
export const createWorker = () => {
  return new Worker(new URL('../workers/computationWorker.js', import.meta.url), { type: 'module' });
};

// Helper to filter patients using the worker
export const filterPatientsWithWorker = (
  worker: Worker,
  patients: any[],
  searchTerm: string
): Promise<any[]> => {
  return new Promise((resolve) => {
    // Set up one-time event listener for this specific request
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'FILTER_PATIENTS_RESULT') {
        worker.removeEventListener('message', handleMessage);
        resolve(data);
      }
    };

    worker.addEventListener('message', handleMessage);
    
    // Send the request to the worker
    worker.postMessage({
      type: 'FILTER_PATIENTS',
      data: { patients, searchTerm }
    });
  });
};

// Helper to calculate statistics using the worker
export const calculateStatisticsWithWorker = (
  worker: Worker,
  data: any
): Promise<any> => {
  return new Promise((resolve) => {
    // Set up one-time event listener for this specific request
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'STATISTICS_RESULT') {
        worker.removeEventListener('message', handleMessage);
        resolve(data);
      }
    };

    worker.addEventListener('message', handleMessage);
    
    // Send the request to the worker
    worker.postMessage({
      type: 'CALCULATE_STATISTICS',
      data
    });
  });
};

// Terminate worker when no longer needed
export const terminateWorker = (worker: Worker) => {
  if (worker) {
    worker.terminate();
  }
};
