# Symbl + Agora Example Application

This tutorial shows you how to quickly create a live app using the Symbl Websocket adapter with Agora Web SDK.

## Prerequisites

- Node.js LTS
- Agora Account
- Symbl App ID and Secret

## Quick Start

This section shows you how to prepare, build, and run the sample application. 

### Obtain Symbl App ID and Secret and Agora App ID

To use the Agora example application with Symbl, you'll need to:
1. Create an account. You can signup at [platform.symbl.ai/#/signup](https://platform.symbl.ai/#/signup). 
2. Head to the [dashboard](https://platform.symbl.ai/#/home)
3. Save your App Id and Secret 

### Obtain an Agora App ID

To build and run the sample application, get an App ID:
1. Create a developer account at [agora.io](https://dashboard.agora.io/signin/). Once you finish the signup process, you will be redirected to the Dashboard.
2. Navigate in the Dashboard tree on the left to **Projects** > **Project List**.
3. Save the **App ID** from the Dashboard for later use.
4. Generate a temp **Access Token** (valid for 24 hours) from dashboard page with given channel name, save for later use.

### Add your Symbl App Id + Secret and Agora App Id to the  `.env` file

    ```bash
    REACT_APP_AGORA_APP_ID=<#YOUR Agora.io APP ID#>
    REACT_APP_AGORA_LOG=true
    SYMBL_API_BASE_PATH="https://api.symbl.ai"
    SYMBL_APP_ID=<#Your Symbl.ai App Id>
    SYMBL_APP_SECRET=<#Your Symbl.ai App Secret>
    ```

### Install dependencies and integrate the Agora Video SDK


1. Using the Terminal app, enter the `install` command in your project directory. This command installs libraries that are required to run the sample application.
    ``` bash
    # install dependencies
    npm install
    ```
2. Start the application by entering the `run dev` or `run build` command.
    The `run dev` command is for development purposes.
    ``` bash
    # serve with hot reload at localhost:8080
    npm run dev
    ```
    The `run build` command is for production purposes and minifies code.
    ``` bash
    # build for production with minification
    npm run build
    ```
3. Your default browser should open and display the sample application.
    **Note:** In some cases, you may need to open a browser and enter `http://localhost:8080` as the URL.


## Contact Us

- You can find Symbl's full API documentation at [Document Center](https://docs.symbl.ai)
- For potential issues with agora, take a look at our [FAQ](https://docs.agora.io/en/faq) first
- If you encounter problems during integration, you can ask questions in our [Slack Developer Community](https://symbldotai.slack.com/join/shared_invite/zt-4sic2s11-D3x496pll8UHSJ89cm78CA#/) 

## License

The MIT License (MIT)
