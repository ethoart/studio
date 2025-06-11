import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Store Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general store settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="ARO Bazzar" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Contact Email</Label>
            <Input id="storeEmail" type="email" defaultValue="contact@arobazzar.com" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenanceMode" />
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>
           <Button>Save General Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>Configure offline payment instructions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" defaultValue="ARO Bazzar Bank" />
            </div>
            <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" defaultValue="ARO Bazzar Store" />
            </div>
            <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" defaultValue="123-456-7890" />
            </div>
             <Button>Save Payment Settings</Button>
        </CardContent>
      </Card>
      
      {/* Placeholder for other settings like Shipping, Taxes, etc. */}
    </div>
  );
}
