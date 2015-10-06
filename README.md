# README #
## Task Board Project ##
### Minimalistic non-intruisive realtime agile task board ###

## Requirements

*  [node.js](https://nodejs.org)
*  [nw.js](nwjs.io/)

## Install

* be sure nw executalbe is on $PATH
* git clone task-board
* cd task-board
* run command: `npm install`
* run command: `FIREBASE_ID=${your-firebase-ID} npm  run build` *FIREBASE_ID as ENV variable will be used in the build process.*
* run command: `nw .`

## Team Layout

* example team can easily be added into your firebsae db by command: `curl -X PUT -d @json/create_team.json https://${your-firebase-ID}.firebaseio.com/teams.json`

## License

Software is released under the [GPL-3.0 license] (http://opensource.org/licenses/GPL-3.0)

