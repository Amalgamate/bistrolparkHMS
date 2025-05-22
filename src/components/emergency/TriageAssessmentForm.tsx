import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { AlertTriangle, Heart, Thermometer, Activity, Droplets, Stethoscope, Brain, Ruler } from 'lucide-react';
import { TriageLevel, VitalSigns, useEmergency } from '../../context/EmergencyContext';

// Define the form schema
const triageFormSchema = z.object({
  chiefComplaint: z.string().min(3, {
    message: "Chief complaint must be at least 3 characters.",
  }),
  level: z.enum(['red', 'orange', 'yellow', 'green', 'blue'] as const),
  temperature: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  bloodPressureSystolic: z.string().optional(),
  bloodPressureDiastolic: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  painScore: z.string().optional(),
  glucoseLevel: z.string().optional(),
  gcs: z.string().optional(),
  notes: z.string().optional(),
});

type TriageFormValues = z.infer<typeof triageFormSchema>;

interface TriageAssessmentFormProps {
  patientId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const TriageAssessmentForm: React.FC<TriageAssessmentFormProps> = ({
  patientId,
  onComplete,
  onCancel
}) => {
  const { performTriage, getPatientById } = useEmergency();
  const [activeTab, setActiveTab] = useState('assessment');
  
  const patient = getPatientById(patientId);
  
  const form = useForm<TriageFormValues>({
    resolver: zodResolver(triageFormSchema),
    defaultValues: {
      chiefComplaint: '',
      level: 'yellow',
      temperature: '',
      heartRate: '',
      respiratoryRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      oxygenSaturation: '',
      painScore: '',
      glucoseLevel: '',
      gcs: '',
      notes: '',
    },
  });

  const onSubmit = (data: TriageFormValues) => {
    // Convert string values to numbers where appropriate
    const vitalSigns: VitalSigns = {
      temperature: data.temperature ? parseFloat(data.temperature) : undefined,
      heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
      respiratoryRate: data.respiratoryRate ? parseInt(data.respiratoryRate) : undefined,
      bloodPressureSystolic: data.bloodPressureSystolic ? parseInt(data.bloodPressureSystolic) : undefined,
      bloodPressureDiastolic: data.bloodPressureDiastolic ? parseInt(data.bloodPressureDiastolic) : undefined,
      oxygenSaturation: data.oxygenSaturation ? parseInt(data.oxygenSaturation) : undefined,
      painScore: data.painScore ? parseInt(data.painScore) : undefined,
      glucoseLevel: data.glucoseLevel ? parseFloat(data.glucoseLevel) : undefined,
      gcs: data.gcs ? parseInt(data.gcs) : undefined,
      recordedAt: new Date().toISOString(),
    };

    // Perform triage
    performTriage(patientId, {
      level: data.level as TriageLevel,
      chiefComplaint: data.chiefComplaint,
      vitalSigns,
      notes: data.notes,
      assessedBy: 'Current User', // In a real app, this would come from auth context
    });

    onComplete();
  };

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Triage Assessment</h2>
        <p className="text-gray-500">
          Patient: {patient.patientName} | Arrival: {new Date(patient.arrivalTime).toLocaleString()}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-4">
              <FormField
                control={form.control}
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Complaint</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the patient's chief complaint"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the main reason for the patient's visit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Triage Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-2 bg-red-50">
                          <RadioGroupItem value="red" id="red" />
                          <Label htmlFor="red" className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                            <div>
                              <span className="font-medium">Red - Immediate</span>
                              <p className="text-xs text-gray-500">Life-threatening condition requiring immediate attention</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2 bg-orange-50">
                          <RadioGroupItem value="orange" id="orange" />
                          <Label htmlFor="orange" className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                            <div>
                              <span className="font-medium">Orange - Very Urgent</span>
                              <p className="text-xs text-gray-500">Potentially life-threatening, needs treatment within 10 minutes</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2 bg-yellow-50">
                          <RadioGroupItem value="yellow" id="yellow" />
                          <Label htmlFor="yellow" className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                            <div>
                              <span className="font-medium">Yellow - Urgent</span>
                              <p className="text-xs text-gray-500">Serious but not life-threatening, needs treatment within 1 hour</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2 bg-green-50">
                          <RadioGroupItem value="green" id="green" />
                          <Label htmlFor="green" className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                            <div>
                              <span className="font-medium">Green - Standard</span>
                              <p className="text-xs text-gray-500">Standard treatment required, can wait up to 2 hours</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2 bg-blue-50">
                          <RadioGroupItem value="blue" id="blue" />
                          <Label htmlFor="blue" className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                            <div>
                              <span className="font-medium">Blue - Non-urgent</span>
                              <p className="text-xs text-gray-500">Minor injuries or illnesses, can wait up to 4 hours</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-1" />
                        Temperature (°C)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="36.8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        Heart Rate (bpm)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="respiratoryRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Activity className="h-4 w-4 mr-1" />
                        Respiratory Rate (breaths/min)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="16" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          BP Systolic (mmHg)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodPressureDiastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BP Diastolic (mmHg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="oxygenSaturation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1" />
                        Oxygen Saturation (%)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="98" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="painScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Pain Score (0-10)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" placeholder="3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="glucoseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Droplets className="h-4 w-4 mr-1" />
                        Glucose Level (mmol/L)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="5.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gcs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Brain className="h-4 w-4 mr-1" />
                        GCS (3-15)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="3" max="15" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes or observations"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Complete Triage</Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default TriageAssessmentForm;
