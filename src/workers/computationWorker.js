
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'FILTER_PATIENTS':
      const result = filterPatients(data.patients, data.searchTerm);
      self.postMessage({ type: 'FILTER_PATIENTS_RESULT', data: result });
      break;

    case 'CALCULATE_STATISTICS':
      const stats = calculateStatistics(data);
      self.postMessage({ type: 'STATISTICS_RESULT', data: stats });
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});

function filterPatients(patients, searchTerm) {
  if (!searchTerm) return patients;

  const term = searchTerm.toLowerCase();
  return patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const idMatch = patient.id.toString().includes(term);
    const nameMatch = fullName.includes(term);
    const phoneMatch = patient.phone.toLowerCase().includes(term);
    const nationalIdMatch = patient.nationalId?.toLowerCase().includes(term) || false;

    return idMatch || nameMatch || phoneMatch || nationalIdMatch;
  });
}

function calculateStatistics(data) {
  const { patients, appointments, doctors } = data;

  const genderDistribution = patients.reduce((acc, patient) => {
    acc[patient.gender] = (acc[patient.gender] || 0) + 1;
    return acc;
  }, {});

  const ageGroups = patients.reduce((acc, patient) => {
    const age = calculateAge(patient.dateOfBirth);
    if (age < 18) acc.children++;
    else if (age < 65) acc.adults++;
    else acc.seniors++;
    return acc;
  }, { children: 0, adults: 0, seniors: 0 });

  const appointmentStats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length,
  };

  const doctorStats = {
    total: doctors.length,
    available: doctors.filter(d => d.status === 'available').length,
    onLeave: doctors.filter(d => d.status === 'on_leave').length,
  };

  return {
    genderDistribution,
    ageGroups,
    appointmentStats,
    doctorStats
  };
}
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
