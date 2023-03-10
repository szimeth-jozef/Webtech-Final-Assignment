# Webtech-Final-Assignment

## Checklist:
**Worth 10 points**</br>
- [x] PWA compatible

**Worth 10 points**</br>
- [x] Use of drag and drop
- [x] Must be responsive (obviously)

**Worth 10 points**</br>
- Overall functionality
- [x] At least 5 game levels
- [x] At least 2 difficulties

**Worth 7 points**</br>
- [x] Use of a mobile sensor

**Worth 7 points**</br>
- Idea
- Graphics, Design
- [x] Add favicon
- [x] Come up with a name for the game

**Worth 6 points**</br>
- [x] Game levels and difficulties must be stored in json or xml

**Worth 6 points**</br>
- [x] Game must be playable repeatedly
- [x] Progress of the player must be stored (cached)
- [x] Game levels must be served in random order (but keeping the same difficulty)
- [x] Hints must be always available
- [x] Player is able to end the game and see the rigth answers/solutions

**Worth 4 points**</br>
- [x] Description of the game
- [x] Guide how to play the game (with parts that are available only on mobile devices)
- [x] Guide must be printable

## TODOs:
- [ ] Handle when player exits fullscreen mode (that also means that screen rotation won't be prevented anymore) with popup or warning or even better go back to start page
- [x] Bug(should be fixed): when pickboard has a none tile placing from pick board to pick board causes unwanted behaviour
- [ ] Bug: when game is started the control event listeners are already active and the ball is rollable even when invisible and if you somehow manage to roll it to the finish unknowingly the level gonna be done

## Notes:
- Service worker must stay in the top level dir to be able to intercept all the asset files
