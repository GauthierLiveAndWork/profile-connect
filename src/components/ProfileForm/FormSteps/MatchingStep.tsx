import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Target, Plus, X } from 'lucide-react';

interface MatchingStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const MatchingStep = ({ data, onUpdate }: MatchingStepProps) => {
  const [searchTag, setSearchTag] = React.useState('');
  const [offerTag, setOfferTag] = React.useState('');

  const form = useForm({
    defaultValues: {
      search_tags: data.search_tags || [],
      offer_tags: data.offer_tags || [],
      current_projects: data.current_projects || ''
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

  const addSearchTag = () => {
    if (searchTag.trim()) {
      const currentTags = form.getValues('search_tags') || [];
      if (!currentTags.includes(searchTag.trim())) {
        form.setValue('search_tags', [...currentTags, searchTag.trim()]);
      }
      setSearchTag('');
    }
  };

  const removeSearchTag = (tagToRemove: string) => {
    const currentTags = form.getValues('search_tags') || [];
    form.setValue('search_tags', currentTags.filter((tag: string) => tag !== tagToRemove));
  };

  const addOfferTag = () => {
    if (offerTag.trim()) {
      const currentTags = form.getValues('offer_tags') || [];
      if (!currentTags.includes(offerTag.trim())) {
        form.setValue('offer_tags', [...currentTags, offerTag.trim()]);
      }
      setOfferTag('');
    }
  };

  const removeOfferTag = (tagToRemove: string) => {
    const currentTags = form.getValues('offer_tags') || [];
    form.setValue('offer_tags', currentTags.filter((tag: string) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Ce que je cherche</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Décrivez ce que vous recherchez : type de partenaires, projets, collaborations...
            </p>
            
            <FormField
              control={form.control}
              name="search_tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags de recherche</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un tag (ex: investisseur)"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addSearchTag)}
                      />
                      <Button
                        type="button"
                        onClick={addSearchTag}
                        size="icon"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((tag: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeSearchTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
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
              <Target className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Ce que je propose</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Décrivez ce que vous proposez : services, compétences, ressources...
            </p>
            
            <FormField
              control={form.control}
              name="offer_tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags d'offre</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un tag (ex: développement)"
                        value={offerTag}
                        onChange={(e) => setOfferTag(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addOfferTag)}
                      />
                      <Button
                        type="button"
                        onClick={addOfferTag}
                        size="icon"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((tag: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeOfferTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mes projets actuels</h3>
            
            <FormField
              control={form.control}
              name="current_projects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Décrivez vos projets en cours</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Développer LA plateforme de networking, collaboration de référence. Qui permettra de fluidifier le workflow de la plus part des freelances, digital Nomad et entrepreneurs."
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
      </form>
    </Form>
  );
};