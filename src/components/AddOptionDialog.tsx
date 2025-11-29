import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

type AddOptionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOption: (data: { title: string; description: string }) => void;
};

export function AddOptionDialog({
  open,
  onOpenChange,
  onAddOption,
}: AddOptionDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddOption({ title, description });
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Option</DialogTitle>
            <DialogDescription>
              Propose a new candidate solution for everyone to discuss and choose from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="option-title">Option Title *</Label>
              <Input
                id="option-title"
                placeholder="e.g., Use React Framework"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="option-description">Description</Label>
              <Textarea
                id="option-description"
                placeholder="Explain the advantages, implementation approach, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Option</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
