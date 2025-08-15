import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { BIG_FIVE_QUESTIONS } from '@/types/profile';

interface BigFiveStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const BigFiveStep = ({ data, onUpdate }: BigFiveStepProps) => {
  const form = useForm({
    defaultValues: {
      big_five_responses: data.big_five_responses || Array(10).fill(null)
    }
  });

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [watchedFields, onUpdate]);

  const likertLabels = [
    'Pas du tout d\'accord',
    'Plutôt pas d\'accord',
    'Neutre',
    'Plutôt d\'accord',
    'Tout à fait d\'accord'
  ];

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Test de personnalité Big Five</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Veuillez indiquer votre niveau d'accord avec chacune des affirmations suivantes.
              Il n'y a pas de bonnes ou de mauvaises réponses, répondez de manière spontanée.
            </p>

            <div className="space-y-8">
              {BIG_FIVE_QUESTIONS.map((question, index) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={`big_five_responses.${index}`}
                  rules={{ required: "Veuillez répondre à cette question" }}
                  render={({ field }) => (
                    <FormItem>
                      <Card className="border border-border/50">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <FormLabel className="text-lg font-semibold text-foreground">
                              {question.id}. {question.text}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                value={field.value?.toString()}
                                className="space-y-3"
                              >
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <div key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} />
                                    <label 
                                      htmlFor={`q${question.id}-${value}`}
                                      className="text-base font-medium leading-relaxed cursor-pointer flex-1"
                                    >
                                      <span className="inline-block w-6 text-primary font-semibold">{value}</span>
                                      <span className="text-muted-foreground"> - </span>
                                      <span>{likertLabels[value - 1]}</span>
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </CardContent>
                      </Card>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
};