import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { User, Briefcase, Globe } from 'lucide-react';
import { SECTORS, EXPERIENCE_LEVELS, LANGUAGES, LANGUAGE_LEVELS } from '@/types/profile';

interface ProfileStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const ProfileStep = ({ data, onUpdate }: ProfileStepProps) => {
  const form = useForm({
    defaultValues: {
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      photo_url: data.photo_url || '',
      location: data.location || '',
      sector: data.sector || '',
      job_role: data.job_role || '',
      years_experience: data.years_experience || '',
      languages: data.languages || [],
      bio: data.bio || '',
      favorite_quote: data.favorite_quote || '',
      punchline: data.punchline || ''
    }
  });

  const onSubmit = (formData: any) => {
    onUpdate(formData);
  };

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [watchedFields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                rules={{ required: "Le prénom est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                rules={{ required: "Le nom est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide"
                  }
                }}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville, Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Photo professionnelle (optionnel)</FormLabel>
                    <FormControl>
                      <PhotoUpload 
                        value={field.value} 
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-medium">Informations professionnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sector"
                rules={{ required: "Le secteur est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secteur d'activité *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre secteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_role"
                rules={{ required: "Le rôle est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle actuel / Fonction *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre fonction actuelle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_experience"
                rules={{ required: "L'expérience est requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Années d'expérience *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level} {level === '10+' ? 'ans' : level.includes('-') ? 'ans' : 'an'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-medium">Langues parlées</h3>
            </div>
            
            <FormField
              control={form.control}
              name="languages"
              rules={{ required: "Sélectionnez au moins une langue" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langues parlées *</FormLabel>
                  <div className="space-y-4">
                    {field.value?.map((langItem: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
                        <Select
                          value={langItem.language}
                          onValueChange={(language) => {
                            const updated = [...(field.value || [])];
                            updated[index] = { ...updated[index], language };
                            field.onChange(updated);
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Sélectionnez une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={langItem.level}
                          onValueChange={(level) => {
                            const updated = [...(field.value || [])];
                            updated[index] = { ...updated[index], level };
                            field.onChange(updated);
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = field.value?.filter((_: any, i: number) => i !== index) || [];
                            field.onChange(updated);
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = [...(field.value || []), { language: '', level: '' }];
                        field.onChange(updated);
                      }}
                      className="w-full"
                    >
                      + Ajouter une langue
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">À propos de vous</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Parlez-nous de vous, votre parcours, vos passions..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favorite_quote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citation favorite</FormLabel>
                  <FormControl>
                    <Input placeholder="Une citation qui vous inspire..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="punchline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Punchline</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre phrase d'accroche personnelle..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      </form>
    </Form>
  );
};