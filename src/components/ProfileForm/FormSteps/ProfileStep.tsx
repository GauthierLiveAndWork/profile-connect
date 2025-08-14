import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { User, Briefcase, Globe, Upload } from 'lucide-react';
import { SECTORS, EXPERIENCE_LEVELS, LANGUAGES } from '@/types/profile';
import { Button } from '@/components/ui/button';

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
      sector: data.sector || '',
      role_title: data.role_title || '',
      years_experience: data.years_experience || '',
      languages: data.languages || []
    }
  });

  const onSubmit = (formData: any) => {
    onUpdate(formData);
  };

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [watchedFields, onUpdate]);

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
                name="photo_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Photo professionnelle (optionnel)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="URL de votre photo" {...field} />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="role_title"
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {LANGUAGES.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={field.value?.includes(language)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, language]);
                            } else {
                              field.onChange(current.filter((l: string) => l !== language));
                            }
                          }}
                        />
                        <label htmlFor={language} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};