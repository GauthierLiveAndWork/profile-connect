-- Créer quelques profils de test pour que le matching fonctionne (scores Big Five corrigés)
INSERT INTO profiles (
  first_name, last_name, email, sector, job_role, years_experience,
  top_skills, training_domains, value_proposition, current_search,
  collaboration_type, main_objectives, work_mode, work_speed, 
  favorite_tools, offer_tags, search_tags, current_projects,
  sector_badges, community_badges, core_values, location, bio,
  openness, conscientiousness, extraversion, agreeableness, emotional_stability,
  big_five_responses, is_public, languages
) VALUES 
(
  'Marie', 'Dubois', 'marie.dubois@exemple.com', 'HealthTech', 'Product Designer', '3-5',
  'UX/UI Design, Figma, User Research', 'Design Thinking, Healthcare', 'Conception d''expériences utilisateur centrées sur la santé',
  'Développeur Frontend React', 'Long terme', ARRAY['Trouver un partenaire de projet', 'Développer mon réseau'],
  'Hybride', 'Méthodique', ARRAY['Figma', 'Miro', 'Slack'],
  ARRAY['Design UX/UI', 'Recherche utilisateur'], ARRAY['Développeur React', 'CTO technique'],
  'Plateforme de téléconsultation médicale', ARRAY['HealthTech certified'], 
  ARRAY['Mentor design'], ARRAY['Impact social', 'Innovation', 'Collaboration'],
  'Paris', 'Passionnée par l''innovation en santé digitale',
  3.75, 4.00, 3.00, 4.25, 3.50, ARRAY[4,4,3,2,4,4,5,2,4,3], true,
  '[{"language": "Français", "level": "Natif"}, {"language": "Anglais", "level": "Courant"}]'::jsonb
),
(
  'Thomas', 'Martin', 'thomas.martin@exemple.com', 'SaaS', 'CTO', '5-10',
  'React, Node.js, Architecture Cloud', 'Management technique, DevOps', 'Développement d''applications SaaS scalables',
  'Product Designer UX', 'Court terme', ARRAY['Tester une idée/produit', 'Trouver un co-fondateur'],
  'Remote', 'Agile', ARRAY['VS Code', 'Docker', 'AWS'],
  ARRAY['Développement React', 'Architecture technique'], ARRAY['Designer UX/UI', 'Product Manager'],
  'SaaS B2B pour PME', ARRAY['SaaS expert'], 
  ARRAY['Mentor technique'], ARRAY['Excellence', 'Innovation', 'Autonomie'],
  'Lyon', 'Expert en développement SaaS et architectures scalables',
  4.50, 3.75, 2.25, 3.50, 4.00, ARRAY[5,4,2,3,4,4,4,1,5,4], true,
  '[{"language": "Français", "level": "Natif"}, {"language": "Anglais", "level": "Courant"}]'::jsonb
),
(
  'Sophie', 'Laurent', 'sophie.laurent@exemple.com', 'FinTech', 'Business Developer', '1-3',
  'Développement commercial, Finance', 'Réglementation bancaire, Blockchain', 'Expertise en développement commercial fintech',
  'Développeur Blockchain', 'Long terme', ARRAY['Développer mon réseau', 'Lever des fonds'],
  'Présentiel', 'Dynamique', ARRAY['Salesforce', 'HubSpot', 'LinkedIn'],
  ARRAY['Business development', 'Partenariats bancaires'], ARRAY['Développeur blockchain', 'Expert crypto'],
  'Néo-banque pour freelances', ARRAY['FinTech certified'], 
  ARRAY['Organisatrice événements'], ARRAY['Transparence', 'Innovation', 'Impact social'],
  'Marseille', 'Spécialisée dans le développement commercial en fintech',
  4.00, 4.25, 4.50, 3.75, 3.25, ARRAY[4,5,5,2,3,5,4,1,4,2], true,
  '[{"language": "Français", "level": "Natif"}, {"language": "Espagnol", "level": "Intermédiaire"}]'::jsonb
);