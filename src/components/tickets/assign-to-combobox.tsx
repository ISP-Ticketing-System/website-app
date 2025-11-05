import { useState } from "react";
import { Controller, Control } from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { User } from "@/db/schema/user_collection";

// type User = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   role: string;
// };

type Props = {
  control: Control<any>;
  users: User[];
};

export const AssignToCombobox: React.FC<Props> = ({ control, users }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Controller
      control={control}
      name="assignToId"
      render={({ field }) => {
        const selectedUser = users.find((user) => user._id === field.value);

        const filteredUsers = users.filter((user) => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          return fullName.includes(search.toLowerCase());
        });

        return (
          <div className="space-y-1 mt-1">
            <label className="text-sm font-medium">Assign To</label>
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm"
                >
                  {selectedUser
                    ? `${selectedUser.username} (${selectedUser.role})`
                    : "Select assignee"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 w-[350px] rounded-md border bg-white p-2 shadow-md"
                  side="bottom"
                  align="start"
                >
                  <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 w-full rounded-md border px-2 py-1 text-sm"
                  />

                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredUsers.length === 0 && (
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        No users found.
                      </div>
                    )}

                    {filteredUsers.map((user) => (
                      <button
                        key={user._id.toString()}
                        type="button"
                        onClick={() => {
                          field.onChange(user._id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="flex w-full items-center justify-between px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
                      >
                        <span>
                          {user.username} ({user.role})
                        </span>
                        {field.value === user._id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        );
      }}
    />
  );
};
