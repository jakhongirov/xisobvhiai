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
   password text,
   premium boolean DEFAULT false,
   expired_date bigint,
   telegram_bot boolean DEFAULT false,
   chat_id bigint,
   bot_step text,
   used_free boolean DEFAULT false,
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
   name text,
   emoji text,
   "primary" boolean DEFAULT false,
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
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price (
   id bigserial PRiMARY KEY,
   title text,
   period int,
   price bigint,
   sort_order int,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);