# MiniLD #58 - Pong theme

This is a Javascript game made for the Mini Ludum Dare 58. The theme was announced on the 20th of March 2015 and I decided to make a game!

Note that this is my first "Real" game.

I plan to make this an incremental style game (Most of you might recognize Cookie Clicker as an example of an incremental game).


<sub>-Blab-.</sub>



---

Plans:

* `modules` folder:
* * Contains tree of modules (`modules/name/name.js`), and a main `modules/index.json` file
* * Module `.js` files have a settings file, `.json`. It configures the dependencies.
* * `index.json`: JSON file (duh) conatining an entry for every module. `entries: {name: {metadata}}, ...`
* * modules, when loaded, are wrapped in a `function modulenameinit(deps, done)`, where: `deps` contains an assoc. array of dependent modules on init, when fully loaded, should call the `done` callback with the exported function object. Note that a module will only be loaded once.
