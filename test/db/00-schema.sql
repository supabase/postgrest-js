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


-- CREATE A ZERO-TO-ONE RELATIONSHIP (User can have profile, but not all of them do)
CREATE TABLE public.user_profiles (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  username text REFERENCES users
);

-- CREATE A TABLE WITH TWO RELATIONS TO SAME DESTINATION WHICH WILL NEED HINTING
CREATE TABLE public.best_friends (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  -- Thoses relations should always be satisfied, never be null
  first_user text REFERENCES users NOT NULL,
  second_user text REFERENCES users NOT NULL,
  -- This relation is nullable, it might be null
  third_wheel text REFERENCES users
);


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

-- SELF REFERENCING TABLE
CREATE TABLE public.collections (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  description text,
  parent_id bigint
);
ALTER TABLE public.messages REPLICA IDENTITY FULL; -- Send "previous data" to supabase
-- SELF REFERENCE via parent_id
ALTER TABLE public.collections
ADD CONSTRAINT collections_parent_id_fkey
FOREIGN KEY (parent_id)
REFERENCES public.collections(id);
COMMENT ON COLUMN public.messages.data IS 'For unstructured data and prototyping.';

-- MANY-TO-MANY RELATIONSHIP USING A JOIN TABLE

-- Create a table for products
CREATE TABLE public.products (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL
);

-- Create a table for categories
CREATE TABLE public.categories (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text
);

-- Create a join table for the many-to-many relationship between products and categories
CREATE TABLE public.product_categories (
  product_id bigint REFERENCES public.products(id) ON DELETE CASCADE,
  category_id bigint REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);


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


create table public.cornercase (
  id        int primary key,
  "column whitespace" text,
  array_column text[]
);

-- Function that returns a single user profile for a user
CREATE OR REPLACE FUNCTION public.get_user_profile(user_row users)
RETURNS SETOF user_profiles
LANGUAGE SQL STABLE
ROWS 1
AS $$
  SELECT * FROM public.user_profiles WHERE username = user_row.username;
$$;

-- Same definition, but will be used with a type override to pretend this can't ever return null
CREATE OR REPLACE FUNCTION public.get_user_profile_non_nullable(user_row users)
RETURNS SETOF user_profiles
LANGUAGE SQL STABLE
ROWS 1
AS $$
  SELECT * FROM public.user_profiles WHERE username = user_row.username;
$$;


CREATE OR REPLACE FUNCTION public.get_messages(channel_row channels)
RETURNS SETOF messages
LANGUAGE SQL STABLE
AS $$
  SELECT * FROM public.messages WHERE channel_id = channel_row.id;
$$;

CREATE OR REPLACE FUNCTION public.get_messages(user_row users)
RETURNS SETOF messages
LANGUAGE SQL STABLE
AS $$
  SELECT * FROM public.messages WHERE username = user_row.username;
$$;


-- Create a view based on users table
CREATE VIEW public.active_users AS
    SELECT * FROM public.users WHERE status = 'ONLINE'::public.user_status;

-- Create a view based on messages table
CREATE VIEW public.recent_messages AS
    SELECT * FROM public.messages ORDER BY id DESC LIMIT 100;

-- Function returning messages using scalar as input (username)
CREATE OR REPLACE FUNCTION public.get_messages_by_username(search_username text)
RETURNS SETOF messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.messages WHERE username = search_username;
$$;

-- Function returning messages using table row as input
CREATE OR REPLACE FUNCTION public.get_user_messages(user_row users)
RETURNS SETOF messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.messages WHERE username = user_row.username;
$$;

-- Function returning messages using view row as input
CREATE OR REPLACE FUNCTION public.get_active_user_messages(active_user_row active_users)
RETURNS SETOF messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.messages WHERE username = active_user_row.username;
$$;

-- Function returning view using scalar as input
CREATE OR REPLACE FUNCTION public.get_recent_messages_by_username(search_username text)
RETURNS SETOF recent_messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.recent_messages WHERE username = search_username;
$$;

-- Function returning view using table row as input
CREATE OR REPLACE FUNCTION public.get_user_recent_messages(user_row users)
RETURNS SETOF recent_messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.recent_messages WHERE username = user_row.username;
$$;
CREATE OR REPLACE FUNCTION public.get_user_recent_messages(active_user_row active_users)
RETURNS SETOF recent_messages
LANGUAGE SQL STABLE
AS $$
    SELECT * FROM public.recent_messages WHERE username = active_user_row.username;
$$;