# Symbl Agora Demo App


[![Websocket](https://img.shields.io/badge/symbl-websocket-brightgreen)](https://docs.symbl.ai/docs/streamingapi/overview/introduction)

Symbl's APIs empower developers to enable: 
- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## Enable Symbl for Agora Video Calls

<hr />

 * [Introduction](#introduction)
 * [Pre-requisites](#pre-requisites)
 * [Setup and Deploy](#setupanddeploy)
 * [Dependencies](#dependencies)
 * [Community](#community)

## Introduction

This sample implementation shows you how to quickly create a live app using the Symbl Websocket adapter with Agora Web SDK.

### Pre-requisites

* JS ES6+
* Node.js
* npm (or your favorite package manager)
* Agora Account [Agora](https://sso.agora.io/en/v3/signup)

## Setup and Deploy
The first step to getting setup is to [sign up][signup]. 

Update the .env file with the following:
1. SYMBL_APP_ID = your Symbl App ID that you can get from [Platform](https://platform.symbl.ai)
2. SYMBL_APP_SECRET = your Symbl App Secret that you can get from [Platform](https://platform.symbl.ai)
3. REACT_APP_AGORA_APP_ID = App ID for your Agora Project
4. (Optional) If you are implementing a high-security Agora Project you will also need to include an app token.  Low-security Projects only require an App Id.  More on [Agora Authorization](https://docs.agora.io/en/Agora%20Platform/token).  Uncomment line 4 in the .env and update REACT_APP_AGORA_TOKEN = your Agora Project token

```
REACT_APP_AGORA_APP_ID=<your-agora-app_id>

# Uncomment line below if using an Agora Project with high security
# REACT_APP_AGORA_TOKEN=<your-agora-token> 

REACT_APP_AGORA_LOG=true
SYMBL_API_BASE_PATH="https://api.symbl.ai"
SYMBL_APP_ID=<symbl-app-id>
SYMBL_APP_SECRET=<symbl-app-secret> 
```

Run the follwing npm commands:
1. `npm install` to download all the node modules
2. `npm start` to start the application
    * Symbl Access Token server is started on port 8081
    * Agora application is started on port 3000
    * Your default browser should open and display the sample application.  If it does not open automatically open your browser to `http://localhost:3000`.

Enter your Room Name and User Name in the app portal and join the meeting.
**Note**  If you are using a high-security Agora project, Room Name must match the Agora Channel Name used to generate the token

<img src="./src/assets/Agora-Channel-Name.PNG" height="50%" width="50%">

To test adding multiple meeting participants you can open additional instances of localhost:3000.

## Dependencies

```json
  "dependencies": {
    "@material-ui/core": "^4.4.0",
    "@material-ui/icons": "^4.2.1",
    "agora-rtc-sdk": "^3.0.2",
    "bootstrap": "^4.5.2",
    "clsx": "^1.0.4",
    "concurrently": "^5.1.0",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "lodash-es": "^4.17.15",
    "lodash.throttle": "^4.1.1",
    "node-fetch": "^2.6.1",
    "prop-types": "^15.7.2",
    "react": "^16.9.0",
    "react-copy-to-clipboard": "^5.0.2",
    "react-dom": "^16.9.0",
    "react-router-dom": "^5.1.2",
    "react-scripts": "3.1.1",
    "symbl-chime-adapter": "^1.0.9"
  }
```

## Community

If you have any questions, feel free to reach out to us at devrelations@symbl.ai, through our Community [Slack][slack], or [developer community][developer_community]

This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback.  If you liked our integration guide, please star our repo!

This library is released under the [MIT License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[developer_community]: https://community.symbl.ai/?_ga=2.134156042.526040298.1609788827-1505817196.1609788827
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/symblai/symbl-for-zoom/issues
[pulls]: https://github.com/symblai/symbl-for-zoom/pulls
[slack]: https://join.slack.com/t/symbldotai/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA