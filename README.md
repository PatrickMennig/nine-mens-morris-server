# Nine Mens Morris Server

## Current Status

This project is still under development, please consider this when you are interested in using this project.
The main functionality is due on March 15, 2017 but we will continue to add more features over the course of the semester.

Things we plan to add:

* [ ] Several different strengths of bots, ranging from weak to strong to always give a good experience to students working on their own AIs.
* [ ] Achievements all participating teams can unlock over the course of the semester, to increase their motivation to also work together.

We also have a website associated with this project that shows statistics about the teams performance, gives more info etc.
Maybe we also publish this open source (if you are interested, drop me a mail).



## Motivation

In order to change the way we teach programming at the University of Applied Sciences Würzburg-Schweinfurt (Germany) computer science faculty we decide to let students implement a nine mens morris client.
This is the server project for the course.

**Disclaimer** This code is used at the University of Applied Sciences Würzburg-Schweinfurt but all terms of the MIT license apply, especially:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

This server allows clients to play nine mens morris with different bots as well as versus games with other clients.

We chose node / JavaScript for the server in order to create a larger scale project with this technique and learn about it.
The clients are implemented in Java, but as we use HTTP to communicate between client and server, any programming language is suitable.

If you want to learn more about the ups and downs while developing this server, read on in this readme.



## Functionality

This server's main goal is to allow students to create their own client programmings able to play nine mens morris.
Our goal is to teach programming within a larger scale and to allow quick feedback.
Hence we provide a stable implementation of a complete client and students will replace more and more modules with their own code over the course of the semeser.

The servers functionality is directly derived from this goal:
* Create and play games against different levels of bot players (only one strength is activated at a time so all teams have equal experience).
* Offer and play games with other clients.
* Save game results to a database to publicly display teams performances.
* Check the game rules, moves, etc. on the server to prevent fraud.
* Provide extensive information about running games to allow teams to implement functionality as they like, in order to not restrict the creativity and willingness to work more than the minimum.

If you plan to use this software for a diffrent scenario, feel free to do so.
We even encourage you to explore more ways of using this server in the wild and would like to hear from your experiences.
If you use this also for teaching purposes, **please share your own ideas and experiences**, we all will benefit from this.


## Getting started

### Prerequisites

This project requires to have node.js and npm installed on your machine.
You can get your enviroment up and running by following this guide: <a href="http://blog.npmjs.org/post/85484771375/how-to-install-npm" target="_blank">How to install npm</a>. 
To manage your node versions, I recommend the <a href="https://github.com/creationix/nvm" target="_blank">Node Version Manager</a>.
It should be straightforward to setup your environment by following these guides.

This project **requires at least node version 6.9** as we are using ES6 features, I recommend using version 6.9.2 (LTS Boron). 
ES6 features that are not supported in older versions of node.

### Installing

To actually run this project check it out, open your terminal and navigate to the root folder of the project.
Go then to server/nineMensMorris (this is the server's root folder) and run the following command:
 ```
 npm install
 ```
 
This will download the project's dependencies locally.

### Tests

Check your copy by running:
 ```
 npm run test
 ```
in the root folder of the server. Test cases for rules, the board representation and games are present.
Tests for the actual interaction with the client over HTTP are still missing.

## Starting the server

Go to the server's root folder and run:
```
npm run run
```
or 
```
node main.js
```
to start the server. It will run on the port specified in /config.js.



## Project Structure

We will briefly explain the structure of the project:
```
.
+-- node_modules
+-- routes
+-- src
|   +-- botGame
|   +-- db
|   +-- game
|   +-- versus
+-- test
config.js
LICENSE.md
main.js
package.json
README.md
```
In the root folder you will find the main.js file which starts the server.
It fetches the routes from ./routes/routes.js which itself defines some top level functions and requires sub-routes from other modules like the bot game and versus game.
Constants for HTTP verbs are also defined here, to avoid any naming problems.

Game results are saved to a database, we chose mongo for fast development and deployment.
You can quickly create a mongo database with an online hoster like mlab, etc.

In ./src/db the setup for the database connection is done, the main.js file will call init() to notify the driver to connect to the database.
All model classes are also in this folder.

The ./src folder contains the main server logic.
It is split into the public available endpoints ./src/botGame/public.js and ./src/versus/public.js.
Each public endpoint defines it's available routes and the associated handler functions.
These source files are relatively long but should still be handleable.
We wanted to keep the HTTP functionalities close together.
Their focus lies on the handling of dependencies with the HTTP connection, e. g. they have to check if all necessary info is passed.
Right now, the versus and bot games sources resemble each other extremely and some code is even exactly duplicated.
Maybe this code smell is eliminated in later versions.

In ./src/game all game functionality can be found.
This includes the game class, players, the rules etc.
Each instance of a game is able to execute moves and check their validity as long as valid data is passed.


## Learnings we had when developing this in node and ES6

We briefly want to share our experiences with you and explain why we implemented the server the way it is.





## Contributing

If you clone, fork or use this server we love you :)
In case you run into any problems, file an issue or (even better) a pull request.
Just make sure all tests run through and you have tested at least some games over the HTTP endpoints.
**We especially appreciate pull requests with tests for the HTTP endpoints**.


## Authors

* **Patrick Mennig** - *Main work*
* **Tobias Fertig** - *Idea and support*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

In short words, do whatever you want with this code! Just be awesome!

## Acknowledgments

Special thanks goes to our faculty's dean Professor Peter Braun and to Professor Steffen Heinzl for allowing us to make this possible.

