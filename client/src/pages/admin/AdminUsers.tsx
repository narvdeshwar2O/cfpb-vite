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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  MoreHorizontal,
  Power,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import {
  deleteUser,
  listRoles,
  listUsers,
  setUserActive,
  type AdminUser,
} from "@/services/adminApi";
import { UserFormDialog } from "./UserFormDialog";
import { useAuth } from "@/context/AuthContext";
import { getRolePriority } from "@/constants/rbac";

/** Admin page: list users, create them, and edit their roles + assigned state. */
const AdminUsers: React.FC = () => {
  const { isSuperAdmin, user: currentUser, roles: currentRoles } = useAuth();
  const callerPriority = isSuperAdmin ? 100 : getRolePriority(currentRoles);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for user creation dialog
  const [activeDialog, setActiveDialog] = useState<{
    type: "create" | null;
    user: AdminUser | null;
  }>({ type: null, user: null });

  // State for delete confirmation modal
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Defensive: Radix can leave pointer-events stuck if a dialog unmounts poorly.
  useEffect(() => {
    if (!activeDialog.type && !userToDelete) {
      document.body.style.pointerEvents = "";
    }
  }, [activeDialog.type, userToDelete]);

  const openDialog = (type: typeof activeDialog.type, user: AdminUser | null = null) => {
    setActiveDialog({ type, user });
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

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.username} permanently deleted`);
      setUserToDelete(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
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
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => openDialog("create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div> */}
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
                      <Badge 
                        variant={user.isActive ? "default" : "destructive"}
                        className={!user.isActive ? "text-white" : ""}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const targetPriority = getRolePriority(user.roles);
                        const isSelf = currentUser?.id === user.id;
                        const canManage = isSuperAdmin || targetPriority < callerPriority;

                        if (!canManage && !isSuperAdmin) {
                          return <span className="text-xs text-muted-foreground italic">Restricted</span>;
                        }

                        if (isSelf) {
                          return <span className="text-xs text-muted-foreground italic">Current user</span>;
                        }

                        return (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Row actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className={user.isActive ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""}
                                onSelect={() => setTimeout(() => toggleActive(user), 0)}
                              >
                                <Power className="mr-2 h-4 w-4" />
                                {user.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              {isSuperAdmin && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onSelect={() => setTimeout(() => setUserToDelete(user), 0)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserFormDialog
        open={activeDialog.type === "create"}
        onOpenChange={(open) => !open && openDialog(null)}
        roleOptions={roleOptions}
        editingUser={null}
        onSaved={load}
      />

      {/* Custom styled modal for Delete Confirmation */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && !isDeleting && setUserToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-foreground/90">
              Are you sure you want to permanently delete user{" "}
              <span className="font-semibold text-foreground">
                "{userToDelete?.username}"
              </span>
              ? This action cannot be undone and will permanently remove all their roles and permissions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
