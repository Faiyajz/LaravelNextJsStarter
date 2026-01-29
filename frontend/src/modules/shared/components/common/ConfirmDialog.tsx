import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/modules/shared/components/ui/alert-dialog";
import { Button } from "@/modules/shared/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void | Promise<void>;

  confirmDisabled?: boolean;
  variant?: "destructive" | "default";
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmDisabled = false,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={confirmDisabled}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              type="button"
              variant={variant === "destructive" ? "destructive" : "default"}
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
