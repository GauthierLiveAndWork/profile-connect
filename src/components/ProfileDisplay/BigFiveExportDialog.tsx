import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Copy, Check } from 'lucide-react';
import { BigFiveScores } from '@/types/profile';
import { exportBigFiveProfile } from '@/utils/bigFiveOptimized';
import { useToast } from '@/hooks/use-toast';

interface BigFiveExportDialogProps {
  scores: BigFiveScores;
  profileName?: string;
}

export const BigFiveExportDialog = ({ scores, profileName = "Profil Big Five" }: BigFiveExportDialogProps) => {
  const [format, setFormat] = useState<'json' | 'txt' | 'csv'>('json');
  const [privacy, setPrivacy] = useState<'public' | 'visible_amis' | 'prive'>('visible_amis');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateExportData = () => {
    const profileData = exportBigFiveProfile(scores, privacy);
    
    switch (format) {
      case 'json':
        return JSON.stringify(profileData, null, 2);
      
      case 'txt':
        return `=== ${profileName} ===

PROFIL BIG FIVE:
• Ouverture: ${profileData.big_five.ouverture.score}% - ${profileData.big_five.ouverture.interpretation}
• Conscienciosité: ${profileData.big_five.consciencieuse.score}% - ${profileData.big_five.consciencieuse.interpretation}
• Extraversion: ${profileData.big_five.extraversion.score}% - ${profileData.big_five.extraversion.interpretation}
• Agréabilité: ${profileData.big_five.agreabilite.score}% - ${profileData.big_five.agreabilite.interpretation}
• Stabilité émotionnelle: ${profileData.big_five.stabilite_emotionnelle.score}% - ${profileData.big_five.stabilite_emotionnelle.interpretation}

BADGES COMMUNAUTAIRES:
${profileData.badges.map(badge => `• ${badge}`).join('\n')}

RECOMMANDATIONS:
${profileData.matchmaking.recommandations_evenements.map(event => `• ${event}`).join('\n')}

Confidentialité: ${profileData.confidentialite}
`;
      
      case 'csv':
        return `Dimension,Score,Interprétation
Ouverture,${profileData.big_five.ouverture.score}%,"${profileData.big_five.ouverture.interpretation}"
Conscienciosité,${profileData.big_five.consciencieuse.score}%,"${profileData.big_five.consciencieuse.interpretation}"
Extraversion,${profileData.big_five.extraversion.score}%,"${profileData.big_five.extraversion.interpretation}"
Agréabilité,${profileData.big_five.agreabilite.score}%,"${profileData.big_five.agreabilite.interpretation}"
Stabilité émotionnelle,${profileData.big_five.stabilite_emotionnelle.score}%,"${profileData.big_five.stabilite_emotionnelle.interpretation}"`;
      
      default:
        return '';
    }
  };

  const handleDownload = () => {
    const data = generateExportData();
    const mimeTypes = {
      json: 'application/json',
      txt: 'text/plain',
      csv: 'text/csv'
    };
    
    const blob = new Blob([data], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileName.toLowerCase().replace(/\s+/g, '-')}-big-five.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `Profil exporté au format ${format.toUpperCase()}`,
    });
  };

  const handleCopy = async () => {
    const data = generateExportData();
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copié !",
        description: "Les données ont été copiées dans le presse-papier",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier les données",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exporter le profil Big Five</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Options d'export */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format d'export</Label>
              <Select value={format} onValueChange={(value: 'json' | 'txt' | 'csv') => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (données structurées)</SelectItem>
                  <SelectItem value="txt">Texte (lecture facile)</SelectItem>
                  <SelectItem value="csv">CSV (tableur)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="privacy">Niveau de confidentialité</Label>
              <Select value={privacy} onValueChange={(value: 'public' | 'visible_amis' | 'prive') => setPrivacy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="visible_amis">Amis seulement</SelectItem>
                  <SelectItem value="prive">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aperçu des données */}
          <div className="space-y-2">
            <Label>Aperçu des données à exporter :</Label>
            <Textarea 
              value={generateExportData()} 
              readOnly 
              className="h-64 font-mono text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};