create table if not exists public.hub_conversations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  conversation_type text not null default 'hub',
  title text not null default 'Hub chat',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hub_conversations_type_check check (conversation_type in ('hub', 'private'))
);

alter table public.hub_conversations enable row level security;

create trigger hub_conversations_updated_at
  before update on public.hub_conversations
  for each row execute function public.set_updated_at();

create unique index if not exists hub_conversations_one_public_hub_idx
  on public.hub_conversations(family_id)
  where conversation_type = 'hub';

create index if not exists hub_conversations_family_type_idx
  on public.hub_conversations(family_id, conversation_type, updated_at desc);

create table if not exists public.hub_conversation_participants (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  conversation_id uuid not null references public.hub_conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  participant_key text not null,
  participant_label text not null,
  participant_role text,
  created_at timestamptz not null default now(),
  constraint hub_conversation_participants_unique_key unique (conversation_id, participant_key)
);

alter table public.hub_conversation_participants enable row level security;

create index if not exists hub_conversation_participants_conversation_idx
  on public.hub_conversation_participants(conversation_id);

create table if not exists public.hub_chat_messages (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  conversation_id uuid not null references public.hub_conversations(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_label text not null default 'LoveKey',
  message_type text not null default 'message',
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  visibility_level text not null default 'summary',
  created_at timestamptz not null default now(),
  constraint hub_chat_messages_type_check check (
    message_type in ('message', 'system', 'event', 'action', 'alert', 'support')
  ),
  constraint hub_chat_messages_visibility_check check (
    visibility_level in ('hidden', 'summary', 'contextual', 'detailed')
  )
);

alter table public.hub_chat_messages enable row level security;

create index if not exists hub_chat_messages_conversation_created_idx
  on public.hub_chat_messages(conversation_id, created_at desc);

create policy "Hub members can create conversations"
  on public.hub_conversations for insert
  with check (public.is_family_member(family_id, auth.uid()) and auth.uid() = created_by);

create policy "Hub members can read hub conversations"
  on public.hub_conversations for select
  using (
    public.is_family_member(family_id, auth.uid())
    and (
      conversation_type = 'hub'
      or created_by = auth.uid()
      or exists (
        select 1
        from public.hub_conversation_participants p
        where p.conversation_id = id
          and p.user_id = auth.uid()
      )
    )
  );

create policy "Conversation creators can update conversations"
  on public.hub_conversations for update
  using (public.is_family_member(family_id, auth.uid()) and created_by = auth.uid());

create policy "Hub members can create conversation participants"
  on public.hub_conversation_participants for insert
  with check (public.is_family_member(family_id, auth.uid()));

create policy "Hub members can read conversation participants"
  on public.hub_conversation_participants for select
  using (public.is_family_member(family_id, auth.uid()));

create policy "Hub members can create chat messages"
  on public.hub_chat_messages for insert
  with check (
    public.is_family_member(family_id, auth.uid())
    and (
      sender_user_id = auth.uid()
      or sender_user_id is null
    )
  );

create policy "Hub members can read chat messages"
  on public.hub_chat_messages for select
  using (
    public.is_family_member(family_id, auth.uid())
    and exists (
      select 1
      from public.hub_conversations c
      where c.id = conversation_id
        and (
          c.conversation_type = 'hub'
          or c.created_by = auth.uid()
          or exists (
            select 1
            from public.hub_conversation_participants p
            where p.conversation_id = c.id
              and p.user_id = auth.uid()
          )
        )
    )
  );
