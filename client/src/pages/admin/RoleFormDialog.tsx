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
import { toast } from "@/components/ui/sonner";
import {
  createRole,
  updateRolePermissions,
  type AdminRole,
} from "@/services/adminApi";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** All assignable permission names. */
  permissionOptions: string[];
  /** When provided, edits this role's permissions; otherwise creates a role. */
  editingRole?: AdminRole | null;
  onSaved: () => void;
}

/** Create a role (name + description + permissions) or edit a role's permissions. */
export const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
  open,
  onOpenChange,
  permissionOptions,
  editingRole,
  onSaved,
}) => {
  const isEdit = !!editingRole;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(editingRole?.name ?? "");
    setDescription(editingRole?.description ?? "");
    setPermissions(editingRole?.permissions ?? []);
  }, [open, editingRole]);

  const handleSubmit = async () => {
    if (!isEdit && !name.trim()) {
      toast.error("Role name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && editingRole) {
        await updateRolePermissions(editingRole.id, permissions);
        toast.success(`Updated ${editingRole.name}`);
      } else {
        await createRole({
          name: name.trim(),
          description: description.trim() || null,
          permissions,
        });
        toast.success(`Created role ${name.trim()}`);
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
          <DialogTitle>{isEdit ? `Edit ${editingRole?.name}` : "Add Role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Choose which permissions this role grants."
              : "Create a role and select its permissions."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="role-name">Name</Label>
                <Input
                  id="role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. District Officer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-desc">Description (optional)</Label>
                <Input
                  id="role-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this role is for"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Permissions</Label>
            <MultiSelectCheckbox
              options={permissionOptions}
              selected={permissions}
              onChange={setPermissions}
              placeholder="Select permissions"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save permissions" : "Create role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
