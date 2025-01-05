import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

interface BulkUserUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { type: 'file' | 'text', content: File | string }) => Promise<void>;
  loading: boolean;
}

export function BulkUserUploadModal({
  isOpen,
  onClose,
  onUpload,
  loading
}: BulkUserUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'text'>('text');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === 'file' && file) {
      await onUpload({ type: 'file', content: file });
      setFile(null);
    } else if (uploadType === 'text' && text.trim()) {
      await onUpload({ type: 'text', content: text });
      setText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Add Users</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUploadType('text')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  uploadType === 'text' 
                    ? 'bg-[#18BC9C] text-white' 
                    : 'bg-gray-100'
                }`}
              >
                Enter Names
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  uploadType === 'file' 
                    ? 'bg-[#18BC9C] text-white' 
                    : 'bg-gray-100'
                }`}
              >
                Upload CSV
              </button>
            </div>

            {uploadType === 'text' ? (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Enter full names (separated by commas or new lines)
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Each name will be assigned:
                  <br />- A username: firstname.lastname.1234
                  <br />- An email: name+123456@asmgnt.com
                  <br />- Default password: 123456
                  <br />- Basic user role
                </p>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border p-2 rounded-md min-h-[100px]"
                  placeholder="John Doe, Jane Smith&#10;Mark Johnson"
                  required={uploadType === 'text'}
                />
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a CSV file with just the full names:
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Each name will be assigned:
                  <br />- A username: firstname.lastname.1234
                  <br />- An email: name+123456@asmgnt.com
                  <br />- Default password: 123456
                  <br />- Basic user role
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded-md"
                  required={uploadType === 'file'}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#18BC9C] text-white rounded-md disabled:opacity-50 flex items-center gap-2"
              disabled={loading || (uploadType === 'file' ? !file : !text.trim())}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Users...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Create Users
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 