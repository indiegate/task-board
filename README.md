# README #
## Task Board Project ##
### Minimalistic non-intrusive realtime agile task board ###
[![Build Status](https://travis-ci.org/indiegate/task-board.svg?branch=master)](https://travis-ci.org/indiegate/task-board)
## Requirements

*  [node.js](https://nodejs.org)
*  [nw.js](nwjs.io/)
*  firebase instance, with an existing user in specific format `developer@${firebaseId}.com` [see more security](https://www.firebase.com/docs/security/guide/user-security.html)

## Install

* be sure nw executable is on $PATH
* git clone task-board
* cd task-board
* run command: `npm install`
* run command: `npm run build`
* run command: `nw .`

## Team Layout

* example team can easily be added into your firebase db by command: `curl -X PUT -d @json/create_team.json https://${your-firebase-ID}.firebaseio.com/`

## License

Software is released under the [GPL-3.0 license] (http://opensource.org/licenses/GPL-3.0)
