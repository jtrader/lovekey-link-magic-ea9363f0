alter table public.families
  add column if not exists hub_type text not null default 'immediate_family';

alter table public.families
  drop constraint if exists families_hub_type_check;

alter table public.families
  add constraint families_hub_type_check check (
    hub_type in (
      'immediate_family',
      'birth_family',
      'blended_family',
      'co_parenting',
      'elder_care',
      'sporting_group',
      'book_club',
      'corporate_team',
      'recovery_circle'
    )
  );
