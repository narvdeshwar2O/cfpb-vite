/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiSelectCheckbox from "@/components/ui/MultiSelectCheckbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { STATE_VIEWER_ROLE } from "@/constants/rbac";
import { STATE_OPTIONS, normalizeState } from "@/data/stateOptions";
import {
  createUser,
  updateUserRoles,
  updateUserState,
  type AdminUser,
} from "@/services/adminApi";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Role names available to assign. */
  roleOptions: string[];
  /** When provided, the dialog edits this user; otherwise it creates one. */
  editingUser?: AdminUser | null;
  /** Called after a successful create/update so the parent can refresh. */
  onSaved: () => void;
}

/** Create or edit a user: credentials (create only), roles, and assigned state. */
export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  roleOptions,
  editingUser,
  onSaved,
}) => {
  const isEdit = !!editingUser;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [stateValue, setStateValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isStateViewer = roles.includes(STATE_VIEWER_ROLE);

  // shadcn Select forbids an empty-string item value, so use a sentinel for "no state".
  const NO_STATE = "__none__";
  // Include the current value as an option if it isn't in the canonical list
  // (e.g. a legacy/typed value), so it stays selectable.
  const stateSelectOptions =
    stateValue && !STATE_OPTIONS.includes(stateValue)
      ? [stateValue, ...STATE_OPTIONS]
      : STATE_OPTIONS;

  // Reset the form whenever the dialog opens or the target user changes.
  useEffect(() => {
    if (!open) return;
    setUsername(editingUser?.username ?? "");
    setPassword("");
    setFullName(editingUser?.fullName ?? "");
    setRoles(editingUser?.roles ?? []);
    setStateValue(normalizeState(editingUser?.state));
  }, [open, editingUser]);

  const validate = (): string | null => {
    if (!isEdit) {
      if (!username.trim()) return "Username is required";
      if (password.length < 4) return "Password must be at least 4 characters";
    }
    if (isStateViewer && !stateValue.trim()) {
      return "A State Viewer must have an assigned state";
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    // A state can be assigned to any user; it scopes their data to that state.
    const stateToSave = stateValue.trim() || null;

    setSubmitting(true);
    try {
      if (isEdit && editingUser) {
        await updateUserRoles(editingUser.id, roles);
        await updateUserState(editingUser.id, stateToSave);
        toast.success(`Updated ${editingUser.username}`);
      } else {
        await createUser({
          username: username.trim(),
          password,
          fullName: fullName.trim() || undefined,
          roles,
          state: stateToSave,
        });
        toast.success(`Created ${username.trim()}`);
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${editingUser?.username}` : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the user's roles and assigned state."
              : "Create a new user and assign roles."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jdoe"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min 4 characters"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name (optional)</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. J. Doe"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Roles</Label>
            <MultiSelectCheckbox
              options={roleOptions}
              selected={roles}
              onChange={setRoles}
              placeholder="Select roles"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">
              Assigned state {isStateViewer ? "(required)" : "(optional)"}
            </Label>
            <Select
              value={stateValue ? stateValue : NO_STATE}
              onValueChange={(v) => setStateValue(v === NO_STATE ? "" : v)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={NO_STATE}>No restriction</SelectItem>
                {stateSelectOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When set, this user only sees data for this state. Choose “No
              restriction” to clear it. (Super Admins are never restricted.)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
