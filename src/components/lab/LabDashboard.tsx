import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  FlaskConical, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

const LabDashboard: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: 'Pending Tests',
      value: '24',
      icon: <Clock className="h-8 w-8 text-amber-500" />,
      change: '+5% from yesterday',
      trend: 'up'
    },
    {
      title: 'Completed Tests',
      value: '156',
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      change: '+12% from yesterday',
      trend: 'up'
    },
    {
      title: 'Total Patients',
      value: '89',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      change: '+8% from yesterday',
      trend: 'up'
    },
    {
      title: 'Critical Results',
      value: '7',
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      change: '-2% from yesterday',
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lab Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FlaskConical className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Blood Test - Patient #{1000 + i}</p>
                      <p className="text-xs text-gray-500">Dr. Smith • {i + 1} hour ago</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    i % 3 === 0 ? 'bg-green-100 text-green-800' : 
                    i % 3 === 1 ? 'bg-amber-100 text-amber-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'Processing'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Hematology', count: 45, color: 'bg-red-100 text-red-800' },
                { name: 'Chemistry', count: 32, color: 'bg-blue-100 text-blue-800' },
                { name: 'Microbiology', count: 18, color: 'bg-green-100 text-green-800' },
                { name: 'Immunology', count: 24, color: 'bg-purple-100 text-purple-800' },
                { name: 'Urinalysis', count: 15, color: 'bg-yellow-100 text-yellow-800' }
              ].map((category, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]} mr-3`}></div>
                    <p className="text-sm font-medium">{category.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${category.color}`}>
                    {category.count} tests
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDashboard;
