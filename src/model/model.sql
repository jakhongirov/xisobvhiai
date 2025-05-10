CREATE TABLE admins (
   admin_id bigserial PRiMARY KEY,
   admin_email text not null,
   admin_password text not null,
   admin_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
   id bigserial PRiMARY KEY,
   name text,
   phone_number text,
   premium boolean DEFAULT false,
   expired_date bigint,
   telegram_bot boolean DEFAULT false,
   chat_id bigint,
   bot_step text,
   bot_lang text,
   paid_msg text,
   duration boolean DEFAULT false,
   source text,
   partner_id bigint,
   partner_name text,
   monthly_amount bigint DEFAULT 0,
   limit_amount bigint DEFAULT 0,
   user_blocked boolean DEFAULT false,
   used_free boolean DEFAULT false,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partners (
   id bigserial PRiMARY KEY,
   name text,
   phone_number text,
   chat_id bigint,
   discount bigint DEFAULT 0,
   additional bigint DEFAULT 0,
   profit int DEFAULT 0,
   duration boolean DEFAULT false,
   balance bigint DEFAULT 0,
   bot_lang text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE balances (
   id bigserial PRiMARY KEY,
   user_id bigint,
   title text,
   currency_code int,
   currency text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
   id bigserial PRiMARY KEY,
   name_uz text,
   name_ru text,
   name_en text,
   emoji text,
   "primary" boolean DEFAULT false,
   from_ai boolean DEFAULT false,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_categories (
   id bigserial PRiMARY KEY,
   name text,
   emoji text,
   user_id bigint,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories_balance (
   id bigserial PRiMARY KEY,
   amount numeric,
   date text,
   comment text,
   category_id bigint,
   balance_id bigint,
   user_id bigint,
   income boolean DEFAULT false,
   voice_message boolean,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE debt (
   id bigserial PRiMARY KEY,
   name text,
   deadline text,
   amount numeric,
   estimate numeric,
   return boolean DEFAULT false,
   balance_id bigint,
   user_id bigint,
   history json [],
   given_date text,
   income boolean DEFAULT false,
   comment text,
   voice_message boolean,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price (
   id bigserial PRiMARY KEY,
   title_uz text,
   title_ru text,
   title_eng text,
   period int,
   price bigint,
   sort_order int,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE atmos_token (
   id bigserial PRIMARY KEY,
   token text,
   expires int
);

CREATE TABLE cards (
   id bigserial PRIMARY KEY,
   card_number_hash text,
   card_id int,
   expiry text,
   otp int,
   card_token text,
   phone_number text,
   card_holder text,
   transaction_id int,
   main boolean DEFAULT false,
   user_id bigint,
   active boolean DEFAULT true,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checks (
   id bigserial PRIMARY KEY,
   user_id bigint,
   success_trans_id text,
   method text,
   amount bigint,
   transaction_id int,
   ofd_url text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
   id bigserial PRIMARY KEY,
   text text,
   premium boolean,
   bot_lang text,
   file_url text,
   file_name text,
   file_type text,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);