-- Four tracks, each out of 100, with the rubrics as the sponsors and ALCOMS
-- set them. Keys stay the same where they can, so nothing else has to change.
-- The CBN entry requirement is not a scored line: the judging form asks it as
-- a yes or no above the criteria and stores it as mvp_ok inside the saved
-- scores, which judging_total ignores because it only walks the criteria.

update public.judging_streams
set name = 'ALCOMS Main Track',
    blurb = 'Every team is judged on this. Out of 100.',
    criteria = '[
      {"key":"theme_fit","max":20,"label":"Theme fit and problem",
       "hint":"Clear user, real problem, and a clear link to the theme."},
      {"key":"innovation","max":20,"label":"Innovation",
       "hint":"New idea or a new take on an existing one."},
      {"key":"technical","max":30,"label":"Technical execution",
       "hint":"Working live demo, sound build, built during the event."},
      {"key":"design","max":20,"label":"Design and user experience",
       "hint":"Easy to use, clear flow, accessible."},
      {"key":"pitch","max":10,"label":"Pitch and Q and A",
       "hint":"Clear explanation, direct answers, whole team involved."}
    ]'::jsonb
where key = 'overall';

update public.judging_streams
set name = 'OLG Gold Track',
    blurb = 'Intelligent player protection and fraud detection. Out of 100.',
    criteria = '[
      {"key":"detection","max":20,"label":"Detection of unusual activity",
       "hint":"Identifies anomalous or suspicious player activity from transaction and behaviour data."},
      {"key":"context","max":20,"label":"Contextual risk assessment",
       "hint":"Compares activity against the player profile, history or peer group."},
      {"key":"prioritisation","max":15,"label":"Investigation prioritization",
       "hint":"Interpretable risk scores that rank what an investigator should review first."},
      {"key":"experience","max":20,"label":"Investigator experience",
       "hint":"Evidence based explanations for each alert, shown in a clear dashboard, report or tool."},
      {"key":"demo","max":15,"label":"Working demo and technical soundness",
       "hint":"Runs live on realistic sample data, and the approach is defensible."},
      {"key":"bonus","max":10,"label":"Bonus considerations",
       "hint":"Synthetic data generation, rule validation, automated recommendations, network analysis, unified risk dashboard."}
    ]'::jsonb
where key = 'olg';

update public.judging_streams
set name = 'CBN Silver Track',
    blurb = 'Casino style crash game. Out of 100.',
    criteria = '[
      {"key":"presentation_layer","max":20,"label":"Presentation layer",
       "hint":"User interface quality, responsiveness, theme consistency, feature usability, gameplay feedback."},
      {"key":"backend_layer","max":20,"label":"Backend layer",
       "hint":"Game logic, account management, RNG implementation, security, reliability."},
      {"key":"modularity","max":20,"label":"Modularity and configurability",
       "hint":"Code quality, maintainability, extensibility, localization, ease of future enhancement."},
      {"key":"creativity","max":40,"label":"Creativity and polish",
       "hint":"Innovation, visual appeal, player engagement, overall impact."}
    ]'::jsonb
where key = 'cbn';

update public.judging_streams
set name = 'Algoma Game Jam Track',
    blurb = 'Theme: Urban vs Rural. Out of 100.',
    criteria = '[
      {"key":"theme","max":25,"label":"Theme",
       "hint":"Urban vs Rural drives the gameplay or story and is not only a backdrop."},
      {"key":"gameplay","max":30,"label":"Gameplay and fun",
       "hint":"Playable loop, clear goal, judges want to keep playing."},
      {"key":"art","max":20,"label":"Art and audio",
       "hint":"Consistent style that supports the theme."},
      {"key":"build","max":15,"label":"Playable build",
       "hint":"Runs start to finish on site without the team stepping in."},
      {"key":"originality","max":10,"label":"Originality",
       "hint":"A new mechanic or idea."}
    ]'::jsonb
where key = 'gamejam';

select key, name, jsonb_array_length(criteria) as lines,
       (select sum((c->>'max')::int) from jsonb_array_elements(criteria) c) as out_of
from public.judging_streams order by sort;
