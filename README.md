# README #
## Task Board Project ##
### Minimalistic non-intruisive realtime agile task board ###

## Reuqirements

*  [node.js](https://nodejs.org)
*  [nw.js](nwjs.io/)

## Install

* be sure nw executalbe is on $PATH
* git clone {this-repository-name}
* cd {this-repository-name}
* run command: `npm install`
* run command: `FIREBASE_ID=${your-firebase-ID} npm  run build` *# FIREBASE_ID as ENV variable will be used in the build process.*
* run command: `nw .`

## Team Layout

* Through your favourite REST client do
  > PUT query to {your-firebase-ID}.firebaseio.com/teams.json
* example of json to be putted: json/create_team.json

## License

Software is released under the GPL-3.0 license (http://opensource.org/licenses/GPL-3.0)

