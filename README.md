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
* run command: `FIREBASE_ID=${your-firebase-ID} nw .`
  > uses ENV variable `FIREBASE_ID` and instructs nw to open app in current folder.

## Team Layout

Through your favourite REST client do
* PUT query to {your-firebase-ID}.firebaseio.com/teams.json
* example of json to putted: json/create_team.json
