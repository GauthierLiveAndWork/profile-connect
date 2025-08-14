import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, Goal } from 'lucide-react';
import { COLLABORATION_TYPES, MAIN_OBJECTIVES } from '@/types/profile';

interface NeedsStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const NeedsStep = ({ data, onUpdate }: NeedsStepProps) => {
  const form = useForm({
    defaultValues: {
      current_search: data.current_search || '',
      collaboration_type: data.collaboration_type || '',
      main_objectives: data.main_objectives || []
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
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Votre recherche actuelle</h3>
            </div>
            
            <FormField
              control={form.control}
              name="current_search"
              rules={{ required: "Veuillez décrire ce que vous recherchez" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ce que vous recherchez actuellement *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez précisément ce que vous recherchez : type de partenaire, compétences recherchées, projet spécifique..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-medium">Type de collaboration</h3>
            </div>
            
            <FormField
              control={form.control}
              name="collaboration_type"
              rules={{ required: "Veuillez sélectionner un type de collaboration" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de collaboration souhaitée *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de collaboration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLLABORATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              <Goal className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-medium">Vos objectifs</h3>
            </div>
            
            <FormField
              control={form.control}
              name="main_objectives"
              rules={{ required: "Sélectionnez au moins un objectif" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectif principal sur Live&Work *</FormLabel>
                  <div className="space-y-3">
                    {MAIN_OBJECTIVES.map((objective) => (
                      <div key={objective} className="flex items-center space-x-2">
                        <Checkbox
                          id={objective}
                          checked={field.value?.includes(objective)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, objective]);
                            } else {
                              field.onChange(current.filter((o: string) => o !== objective));
                            }
                          }}
                        />
                        <label htmlFor={objective} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {objective}
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