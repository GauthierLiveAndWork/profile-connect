import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Zap, Wrench } from 'lucide-react';
import { WORK_MODES, WORK_SPEEDS, FAVORITE_TOOLS } from '@/types/profile';

interface PreferencesStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const PreferencesStep = ({ data, onUpdate }: PreferencesStepProps) => {
  const form = useForm({
    defaultValues: {
      work_mode: data.work_mode || '',
      work_speed: data.work_speed || '',
      favorite_tools: data.favorite_tools || []
    }
  });

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [watchedFields, onUpdate]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Mode de travail</h3>
            </div>
            
            <FormField
              control={form.control}
              name="work_mode"
              rules={{ required: "Veuillez sélectionner un mode de travail" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de travail préféré *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Comment préférez-vous travailler ?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORK_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-medium">Rythme de travail</h3>
            </div>
            
            <FormField
              control={form.control}
              name="work_speed"
              rules={{ required: "Veuillez sélectionner un rythme de travail" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitesse de travail *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Quel est votre rythme de travail ?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORK_SPEEDS.map((speed) => (
                        <SelectItem key={speed} value={speed}>
                          {speed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-medium">Outils de travail</h3>
            </div>
            
            <FormField
              control={form.control}
              name="favorite_tools"
              rules={{ required: "Sélectionnez au moins un outil" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outils favoris *</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FAVORITE_TOOLS.map((tool) => (
                      <div key={tool} className="flex items-center space-x-2">
                        <Checkbox
                          id={tool}
                          checked={field.value?.includes(tool)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, tool]);
                            } else {
                              field.onChange(current.filter((t: string) => t !== tool));
                            }
                          }}
                        />
                        <label htmlFor={tool} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {tool}
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
      </div>
    </Form>
  );
};