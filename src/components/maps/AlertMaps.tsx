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
import { clx } from "@govtechmy/myds-react/utils";

type AlertMapsProps = {
  DialogOpen: boolean;
  title: string;
  description: React.ReactNode;
  closeTitle: string;
  classname?: string;
  onClose?: () => void;
};

export default function AlertMaps(items: AlertMapsProps) {
  return (
    <Dialog
      defaultOpen={items.DialogOpen}
      onOpenChange={(open) => {
        if (!open && items.onClose) {
          items.onClose();
        }
      }}
    >
      <DialogBody
        hideClose={true}
        className={clx(`!max-w-[400px] `, items.classname)}
      >
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
