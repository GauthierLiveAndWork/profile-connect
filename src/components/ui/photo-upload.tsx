import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function PhotoUpload({ value, onChange, disabled }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      toast.error('La photo ne doit pas dépasser 5MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        toast.error('Erreur lors du téléchargement');
        return;
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast.success('Photo téléchargée avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input 
          placeholder="URL de votre photo" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('photo-upload')?.click()}
            disabled={uploading || disabled}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading || disabled}
      />
      
      {value && (
        <div className="mt-2">
          <img 
            src={value} 
            alt="Aperçu" 
            className="w-20 h-20 rounded-full object-cover border"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
      </p>
    </div>
  );
}