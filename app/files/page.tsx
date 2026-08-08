'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, File, Trash2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/auth-guard';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

function FilesContent() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('file_uploads').select('*').order('created_at', { ascending: false });
      if (data) setFiles(data as UploadedFile[]);
      setLoading(false);
    })();
  }, []);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !user) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('user-files').upload(fileName, file);
      if (!uploadError) {
        const { data } = await supabase.from('file_uploads').insert({ file_name: file.name, file_type: file.name.split('.').pop() || file.type, file_size: file.size, storage_path: fileName }).select('*').single();
        if (data) setFiles((prev) => [data as UploadedFile, ...prev]);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (file: UploadedFile) => {
    await supabase.storage.from('user-files').remove([file.storage_path]);
    await supabase.from('file_uploads').delete().eq('id', file.id);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => type.match(/^(jpg|jpeg|png|gif|webp|svg)$/i) ? ImageIcon : FileText;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold sm:text-3xl">File Uploads</h1>
          <p className="mt-1 text-muted-foreground">Upload study materials, notes, and documents to your library.</p>
        </div>

        <Card className="mb-6 animate-scale-in">
          <CardContent className="pt-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={cn('flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all', dragOver ? 'border-accent bg-accent/5' : 'border-muted-foreground/30 hover:border-accent/50 hover:bg-accent/5')}
            >
              <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
              {uploading ? <Loader2 className="mb-3 h-12 w-12 animate-spin text-accent" /> : <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg"><Upload className="h-6 w-6" /></div>}
              <p className="font-medium">{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</p>
              <p className="mt-1 text-sm text-muted-foreground">PDF, DOCX, images, and more — up to 50MB each</p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 font-poppins text-xl font-semibold">Your Files</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
          ) : files.length === 0 ? (
            <Card className="text-center"><CardContent className="py-12"><File className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" /><p className="text-muted-foreground">No files uploaded yet. Upload your first study material above!</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {files.map((file, i) => {
                const Icon = getFileIcon(file.file_type);
                return (
                  <Card key={file.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-5 w-5 text-muted-foreground" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{file.file_name}</div>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="secondary">{file.file_type.toUpperCase()}</Badge>
                          <Badge variant="outline">{formatSize(file.file_size)}</Badge>
                          <Badge variant="outline">{new Date(file.created_at).toLocaleDateString()}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(file)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FilesPage() {
  return <AuthGuard><FilesContent /></AuthGuard>;
}
