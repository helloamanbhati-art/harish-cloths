import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Update your store details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="Harish Cloths" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input id="storeEmail" type="email" defaultValue="contact@harishcloths.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input id="storePhone" defaultValue="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Textarea id="storeAddress" defaultValue="123 Main Street, Mumbai, Maharashtra, India" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Order Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for new orders</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when stock is low</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Reports</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily sales reports via email</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
          <CardDescription>Configure GST and tax rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input id="gstNumber" placeholder="Enter GST number" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gst5">GST 5%</Label>
              <Input id="gst5" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst12">GST 12%</Label>
              <Input id="gst12" type="number" defaultValue="12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst18">GST 18%</Label>
              <Input id="gst18" type="number" defaultValue="18" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
