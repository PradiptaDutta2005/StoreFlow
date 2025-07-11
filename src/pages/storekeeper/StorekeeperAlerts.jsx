import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input, Button, Card, CardHeader, CardContent, CardTitle } from '@/components/ui';
const StorekeeperAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [task, setTask] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alerts');
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load alerts', variant: 'destructive' });
      }
    };
    fetchAlerts();
  }, []);
  const sendAlert = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, employeeId }),
      });
      if (!response.ok) throw new Error('Failed to send alert');
      toast({ title: 'Success', description: 'Alert sent!' });
      setTask('');
      setEmployeeId('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send alert', variant: 'destructive' });
    }
  };
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-300 shadow-md">
      <CardHeader><CardTitle>Send Alerts</CardTitle></CardHeader>
      <CardContent>
        <Input
          placeholder="Task (e.g., Restock shelf)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="mb-2"
        />
        <Button className="hover:bg-blue-600 h-12 rounded-lg" onClick={sendAlert}>
          Send Alert
        </Button>
        <div className="mt-4">
          {alerts.map(alert => (
            <div key={alert._id} className="p-2 border-b">
              Task: {alert.task} (Employee: {alert.employeeId})
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default StorekeeperAlerts;