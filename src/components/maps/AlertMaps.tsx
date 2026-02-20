import { Button } from "@govtechmy/myds-react/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@govtechmy/myds-react/dialog";
import React, { useEffect } from "react";

type AlertMapsProps = {
  DialogOpen: boolean;
  title: string;
  description: React.ReactNode;
  closeTitle: string;
  onClose?: () => void;
};

export default function AlertMaps(items: AlertMapsProps) {
  const [open, setOpen] = React.useState(items.DialogOpen);

  useEffect(() => {
    setOpen(items.DialogOpen);
  }, [items.DialogOpen]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && items.onClose) {
      items.onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogBody hideClose={true} className="!max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{items.title}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <DialogDescription>{items.description}</DialogDescription>
        </DialogContent>
        <DialogFooter align="full">
          <DialogClose>
            <Button variant="primary-fill">{items.closeTitle}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
}
