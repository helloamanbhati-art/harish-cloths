import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed insights and reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">Advanced analytics features will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
