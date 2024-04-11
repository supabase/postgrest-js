-- Create the Replication publication
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- Create a second schema
CREATE SCHEMA personal;

-- USERS
CREATE TYPE public.user_status AS ENUM ('ONLINE', 'OFFLINE');
CREATE TABLE public.users (
  username text primary key,
  data jsonb DEFAULT null,
  age_range int4range DEFAULT null,
  status user_status DEFAULT 'ONLINE'::public.user_status,
  catchphrase tsvector DEFAULT null
);
ALTER TABLE public.users REPLICA IDENTITY FULL; -- Send "previous data" to supabase
COMMENT ON COLUMN public.users.data IS 'For unstructured data and prototyping.';

-- CHANNELS
CREATE TABLE public.channels (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  data jsonb DEFAULT null,
  slug text
);
ALTER TABLE public.users REPLICA IDENTITY FULL; -- Send "previous data" to supabase
COMMENT ON COLUMN public.channels.data IS 'For unstructured data and prototyping.';

create table public.channel_details (
  id bigint primary key references channels(id),
  details text default null
);

-- MESSAGES
CREATE TABLE public.messages (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  data jsonb DEFAULT null,
  message text,
  username text REFERENCES users NOT NULL,
  channel_id bigint REFERENCES channels NOT NULL
);
ALTER TABLE public.messages REPLICA IDENTITY FULL; -- Send "previous data" to supabase
COMMENT ON COLUMN public.messages.data IS 'For unstructured data and prototyping.';

-- STORED FUNCTION
CREATE FUNCTION public.get_status(name_param text)
RETURNS user_status AS $$
  SELECT status from users WHERE username=name_param;
$$ LANGUAGE SQL IMMUTABLE;

CREATE FUNCTION public.get_username_and_status(name_param text)
RETURNS TABLE(username text, status user_status) AS $$
  SELECT username, status from users WHERE username=name_param;
$$ LANGUAGE SQL IMMUTABLE;

CREATE FUNCTION public.offline_user(name_param text)
RETURNS user_status AS $$
  UPDATE users SET status = 'OFFLINE' WHERE username=name_param
  RETURNING status;
$$ LANGUAGE SQL VOLATILE;

CREATE FUNCTION public.void_func()
RETURNS void AS $$
$$ LANGUAGE SQL;

create schema extensions;
create extension postgis schema extensions;

create table public.shops (
  id        int primary key
, address   text
, shop_geom extensions.geometry(POINT, 4326)
);

create view public.non_updatable_view as
  select username from public.users limit 1;

create view public.updatable_view as
  select username, 1 as non_updatable_column from public.users;

-- SECOND SCHEMA USERS
CREATE TYPE personal.user_status AS ENUM ('ONLINE', 'OFFLINE');
CREATE TABLE personal.users(
  username text primary key,
  data jsonb DEFAULT null,
  age_range int4range DEFAULT null,
  status user_status DEFAULT 'ONLINE'::public.user_status
);

-- SECOND SCHEMA STORED FUNCTION
CREATE FUNCTION personal.get_status(name_param text)
RETURNS user_status AS $$
  SELECT status from users WHERE username=name_param;
$$ LANGUAGE SQL IMMUTABLE;

create function public.function_with_optional_param(param text default '')
returns text as $$
  select param;
$$ language sql immutable;

create function public.function_with_array_param(param uuid[])
returns void as '' language sql immutable;
