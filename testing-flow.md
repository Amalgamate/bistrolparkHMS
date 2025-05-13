# Bristol Park Hospital HMIS Testing Flow

This document outlines the complete patient flow testing process, from registration to lab results.

## Test Setup

### Required Browser Sessions:
1. **Front Office Attendant** - Chrome
2. **Nurse** - Firefox
3. **Doctor** - Edge or Chrome Incognito
4. **Lab Technician** - Firefox Private Browsing

### User Credentials:
- **Front Office**: front@bristol.com / password123
- **Nurse**: nurse@bristol.com / password123
- **Doctor**: doctor@bristol.com / password123
- **Lab Technician**: lab@bristol.com / password123

## Testing Flow

### 1. Patient Registration (Front Office)
- Login as Front Office
- Navigate to Clinical/Nursing Module
- Register a new patient (John Doe)
- Observe the token number assigned
- Check that the patient appears in the waiting queue
- Send a notification to the patient

### 2. Vitals Recording (Nurse)
- Login as Nurse
- Navigate to Clinical/Nursing Module
- View the patient queue
- Select John Doe for vitals
- Record vitals (BP, temperature, etc.)
- Update patient status to "Vitals Taken"
- Observe the patient moving to the "Up Next" queue

### 3. Doctor Consultation (Doctor)
- Login as Doctor
- Navigate to Clinical/Nursing Module
- View the patient queue
- Select John Doe for consultation
- Record consultation details
- Order lab tests (CBC, Blood Sugar)
- Update patient status to "Lab Ordered"
- Observe the patient moving to the lab queue

### 4. Lab Testing (Lab Technician)
- Login as Lab Technician
- Navigate to Lab Module
- View the lab requests
- Process John Doe's lab tests:
  - Collect sample
  - Start processing
  - Enter test results
- Update test status to "Completed"
- Observe notifications being sent

### 5. Follow-up Consultation (Doctor)
- Login as Doctor again
- Navigate to Clinical/Nursing Module
- View the patient queue
- Select John Doe for follow-up
- Review lab results
- Make diagnosis
- Prescribe medications
- Complete the consultation

## Expected Outcomes

1. **Token System**:
   - Patient should receive a unique token number
   - Token should be visible in all queues
   - Token should be color-coded based on priority

2. **Queue Management**:
   - Patient should move through different queues based on status
   - Queue should be sorted by priority and token number
   - Visual indicators should show patient status

3. **Notifications**:
   - Toast notifications should appear when status changes
   - Simulated SMS notifications should be logged
   - Alerts should be shown for high-priority cases

4. **Lab Integration**:
   - Lab tests ordered in Clinical Module should appear in Lab Module
   - Lab results should be visible back in the Clinical Module
   - Status updates should be synchronized between modules

## Testing Notes

- Take screenshots at each step
- Note any unexpected behavior
- Test both normal flow and edge cases (e.g., emergency priority)
- Verify that all toast notifications appear correctly
- Check that the token display is consistent across all views
