import React from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

const ApplicationDialog = ({
  title = "Application Details",
  open,
  setOpen,
  primaryActionLabel,
  primaryActionHandler,
  secondaryActionLabel,
  secondaryActionHandler,
}) => {
  const user = useSelector((state) => state.auth.user);
  const userObject = typeof user === "string" ? JSON.parse(user) : user;

  const fields = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "fathername", label: "Father's Name" },
    { key: "address", label: "Address" },
    { key: "contact", label: "Contact" },
    { key: "university", label: "Institute" },
    { key: "program", label: "Program" },
  ];

  const handleSecondary = () => {
    setOpen(false);
    if (secondaryActionHandler) secondaryActionHandler(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-2xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-2 text-xl">
          {fields.map((field) => (
            <p key={field.key}>
              <strong>{field.label}:</strong> {userObject?.[field.key] || "N/A"}
            </p>
          ))}
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-3">
          {secondaryActionLabel && (
            <DialogClose asChild>
              <button
                onClick={handleSecondary}
                className="w-full bg-blue-500 hover:bg-blue-700 py-2 rounded text-white font-semibold"
              >
                {secondaryActionLabel}
              </button>
            </DialogClose>
          )}

          {primaryActionLabel && (
            <button
              onClick={primaryActionHandler}
              className="w-full bg-green-600 hover:bg-green-800 py-2 rounded text-white font-semibold"
            >
              {primaryActionLabel}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
