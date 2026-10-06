import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { type AdminRole } from "@/services/adminApi";

interface Props {
  mappings: Array<{ groupName: string; roleName: string }>;
  availableRoles: AdminRole[];
  onChange: (mappings: Array<{ groupName: string; roleName: string }>) => void;
}

export const LdapGroupMapping: React.FC<Props> = ({ mappings, availableRoles, onChange }) => {
  const [newGroup, setNewGroup] = useState("");
  const [newRole, setNewRole] = useState(availableRoles[0]?.name || "STATE OPERATOR");

  const handleAdd = () => {
    const trimmed = newGroup.trim();
    if (!trimmed) {
      toast.error("AD Group name cannot be empty");
      return;
    }
    if (mappings.some((m) => m.groupName.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This group mapping already exists");
      return;
    }
    onChange([...mappings, { groupName: trimmed, roleName: newRole }]);
    setNewGroup("");
  };

  const handleRemove = (idx: number) => {
    onChange(mappings.filter((_, i) => i !== idx));
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-3">
      <div>
        <h4 className="text-sm font-bold text-slate-800">Group — Role Mapping</h4>
        <p className="text-xs text-slate-500">
          Map AD groups to roles. Users in multiple groups receive the highest privilege role.
        </p>
      </div>

      {mappings.length > 0 && (
        <div className="space-y-2 max-w-3xl">
          {mappings.map((m, idx) => (
            <div
              key={m.groupName}
              className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{m.groupName}</span>
                <span className="text-slate-400">→</span>
                <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                  {m.roleName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 max-w-3xl pt-1">
        <div className="flex-1 min-w-60">
          <Input
            placeholder="AD Group Name (e.g., Domain Admins, CFPB_Users)"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="bg-slate-50 border-slate-200 text-xs h-9"
          />
        </div>
        <div className="w-56 min-w-45">
          <Select value={newRole} onValueChange={setNewRole}>
            <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((r) => (
                <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="text-xs font-semibold gap-1.5 h-9 px-3.5 border-slate-300 hover:bg-slate-100 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Mapping
        </Button>
      </div>
    </div>
  );
};
