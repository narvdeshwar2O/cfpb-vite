/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  KeyRound,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Users as UsersIcon,
} from "lucide-react";
import {
  listRoles,
  listUsers,
  setUserActive,
  type AdminUser,
} from "@/services/adminApi";
import { UserFormDialog } from "./UserFormDialog";
import { PasswordResetDialog } from "./PasswordResetDialog";

/** Admin page: list users, create them, and edit their roles + assigned state. */
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [pwdUser, setPwdUser] = useState<AdminUser | null>(null);
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, r] = await Promise.all([listUsers(), listRoles()]);
      setUsers(u);
      setRoleOptions(r.map((role) => role.name));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Defensive: Radix (dropdown-menu 2.1.x + dialog 1.1.x) can leave
  // `pointer-events: none` on <body> after a menu→dialog interaction, which
  // freezes every dropdown on the page. Clear it whenever no dialog is open.
  useEffect(() => {
    if (!dialogOpen && !pwdDialogOpen) {
      document.body.style.pointerEvents = "";
    }
  }, [dialogOpen, pwdDialogOpen]);

  const openCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const openPasswordReset = (user: AdminUser) => {
    setPwdUser(user);
    setPwdDialogOpen(true);
  };

  const toggleActive = async (user: AdminUser) => {
    try {
      await setUserActive(user.id, !user.isActive);
      toast.success(`${user.username} ${user.isActive ? "deactivated" : "activated"}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-blue-600" />
            User Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full name</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.fullName ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          user.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.state ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "outline"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label="Row actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Defer dialog-opening to the next tick so the menu
                              finishes closing first (avoids Radix's stuck
                              pointer-events bug that freezes all dropdowns). */}
                          <DropdownMenuItem
                            onSelect={() => setTimeout(() => openEdit(user), 0)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit roles & state
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setTimeout(() => openPasswordReset(user), 0)}
                          >
                            <KeyRound className="mr-2 h-4 w-4" />
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => setTimeout(() => toggleActive(user), 0)}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            {user.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roleOptions={roleOptions}
        editingUser={editingUser}
        onSaved={load}
      />

      <PasswordResetDialog
        open={pwdDialogOpen}
        onOpenChange={setPwdDialogOpen}
        user={pwdUser}
      />
    </div>
  );
};

export default AdminUsers;
