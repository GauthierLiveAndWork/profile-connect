import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Eye, Zap, Clock } from 'lucide-react';
import { SECTOR_BADGES, COMMUNITY_BADGES, CORE_VALUES } from '@/types/profile';

interface IdentityStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const IdentityStep = ({ data, onUpdate }: IdentityStepProps) => {
  const form = useForm({
    defaultValues: {
      sector_badges: data.sector_badges || [],
      community_badges: data.community_badges || [],
      core_values: data.core_values || [],
      vision: data.vision || '',
      work_style_details: data.work_style_details || '',
      work_rhythm_details: data.work_rhythm_details || ''
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

  const toggleBadge = (fieldName: string, badge: string) => {
    const currentValues = form.getValues(fieldName as any) || [];
    const newValues = currentValues.includes(badge)
      ? currentValues.filter((item: string) => item !== badge)
      : [...currentValues, badge];
    form.setValue(fieldName as any, newValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Badges identitaires</h3>
            <p className="text-muted-foreground mb-6">Sélectionnez les badges qui vous représentent le mieux (5 maximum par catégorie)</p>
            
            <Tabs defaultValue="sectoriels" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sectoriels">Sectoriels</TabsTrigger>
                <TabsTrigger value="communautes">Communautés</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sectoriels" className="space-y-4">
                <FormField
                  control={form.control}
                  name="sector_badges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badges sectoriels ({field.value?.length || 0}/5)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SECTOR_BADGES.map((badge) => (
                          <Badge
                            key={badge}
                            variant={field.value?.includes(badge) ? "default" : "outline"}
                            className="cursor-pointer p-2 text-center justify-center hover:bg-primary/10"
                            onClick={() => {
                              if (field.value?.length < 5 || field.value?.includes(badge)) {
                                toggleBadge('sector_badges', badge);
                              }
                            }}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="communautes" className="space-y-4">
                <FormField
                  control={form.control}
                  name="community_badges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badges communautaires ({field.value?.length || 0}/5)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {COMMUNITY_BADGES.map((badge) => (
                          <Badge
                            key={badge}
                            variant={field.value?.includes(badge) ? "default" : "outline"}
                            className="cursor-pointer p-2 text-center justify-center hover:bg-primary/10"
                            onClick={() => {
                              if (field.value?.length < 5 || field.value?.includes(badge)) {
                                toggleBadge('community_badges', badge);
                              }
                            }}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">Mes 3 valeurs principales</h3>
            </div>
            
            <FormField
              control={form.control}
              name="core_values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sélectionnez vos 3 valeurs principales</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CORE_VALUES.map((value, index) => (
                      <Badge
                        key={value}
                        variant={field.value?.includes(value) ? "default" : "outline"}
                        className="cursor-pointer p-2 text-center justify-center hover:bg-primary/10"
                        onClick={() => {
                          if (field.value?.length < 3 || field.value?.includes(value)) {
                            toggleBadge('core_values', value);
                          }
                        }}
                      >
                        <span className="mr-1">{index + 1}.</span>
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Ma vision</h3>
            </div>
            
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre vision personnelle/professionnelle</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Le monde change, il faut l'anticiper..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Mon style de travail</h3>
              </div>
              
              <FormField
                control={form.control}
                name="work_style_details"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre style de travail..."
                        rows={4}
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
                <Clock className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Mon rythme de travail</h3>
              </div>
              
              <FormField
                control={form.control}
                name="work_rhythm_details"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre rythme de travail..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};