import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import DynamicUpdateForm from "../Admin-Dashboard/DynamicUpdateForm";
import DynamicAddForm from "../Admin-Dashboard/DynamicAddForm";

import { Description } from "@radix-ui/react-dialog";


const DynamicDialgForm = ({
  open,
  setOpen,
  fields,
  title,
  initValues,
  handleOnSubmit,
  handleCancel,
  isLoading,
  desc,
  btn,
  update,
  children,
  customFormStyle,
}) => {


  

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-xl">
              {title}
            </DialogTitle>

            <Description className="text-center">{desc}</Description>
          </DialogHeader>

          {update ? (
            <DynamicUpdateForm
              handleOnSubmit={handleOnSubmit}
              fields={fields}
              btn={btn}
              initValues={initValues}
              isLoading={isLoading}
              setOpen={setOpen}
              customStyle={customFormStyle}
            />
          ) : (
            <DynamicAddForm
              handleOnSubmit={handleOnSubmit}
              fields={fields}
              btn={btn}
              initValues={initValues}
              isLoading={isLoading}
              setOpen={setOpen}
              customStyle={customFormStyle}
            />
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button
                onClick={() => {
                  handleCancel();
                }}
                className="bg-red-500 hover:bg-red-700 p-2 rounded font-bold text-white"
              >
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
          
          {children}

        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicDialgForm;
