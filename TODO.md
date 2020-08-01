TODO:
MUST:
- persist state in DB on sigterm
- greet ze statusem (witaj po raz pierwszy, witaj ponownie, czy jesteś w grze, czy masz coś na ręce)
- komendy specjalne: żądanie (żądam (kolor/karta) albo kolor (kolor) albo karta (karta))
- bezpłciowe broadcasty
- "ręka" leaks who played last card
- komendy bez polskich znaków
- help <command>
- command to leave game

SHOULD:
- handle postback differently
- auth status and panic

COULD:
- eslint?
- lepsze zagraj: rozpoznanie komendy nawet ze złą kartą, verbose or symbolic (<3, <>, ) suit names,
- ludzkie info ile dobrałeś kart zanim napiszesz jakie karty
- transtlations + language picking?
- tutorial video/w chacie?
- game log?
- id data/log is stored gimme some stats on status
- makao rules
- other game rules