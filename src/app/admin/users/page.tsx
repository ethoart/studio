import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/mock-data";
import { MoreHorizontal, UserPlus, Edit2, ShieldCheck, ShieldOff, Crown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/types";

// Helper function to get badge variant based on role
const getRoleBadgeVariant = (role: UserRole) => {
  if (role === 'super admin') return 'destructive'; // Or a new variant for super admin
  if (role === 'admin') return 'default';
  return 'secondary';
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.role === 'customer' && (
                          <DropdownMenuItem><ShieldCheck className="mr-2 h-4 w-4" /> Make Admin</DropdownMenuItem>
                        )}
                        {user.role === 'admin' && (
                          <>
                            <DropdownMenuItem><Crown className="mr-2 h-4 w-4" /> Make Super Admin</DropdownMenuItem>
                            <DropdownMenuItem><ShieldOff className="mr-2 h-4 w-4" /> Revoke Admin (to Customer)</DropdownMenuItem>
                          </>
                        )}
                        {user.role === 'super admin' && (
                           <DropdownMenuItem><ShieldOff className="mr-2 h-4 w-4" /> Demote to Admin</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add pagination controls here */}
    </div>
  );
}
