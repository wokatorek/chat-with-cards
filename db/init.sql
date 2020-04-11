create table users (
    id integer PRIMARY KEY,
    needs_greet bool,
    profile varchar,
    cards varchar
);
create table games (
    id integer PRIMARY KEY,
    owner_id varchar,
    deck varchar,
    stack varchar
);
create table games_users (
    game_id integer,
    user_id integer
);