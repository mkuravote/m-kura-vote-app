<!-- TITLE -->
<p align="center"> 
  
 <h2 align="center">SecuraVote</h2>
</p>

## Introduction

  <p align="center">
    
<p>In this build, we will be learning how to create an application for Minipay.</p>
  <p align="center">
    <h2>What is Minipay?</h2>
  </p>
   MiniPay is a blockchain-based dollar wallet built on Celo and integrated right into the Opera Mini browser. With MiniPay your funds are stored in cUSD – a stable asset tied to the value of the US Dollar
</p>
  </p>
</p>

## TABLE OF CONTENTS

- [Introduction](#introduction)

- [Tech Stack](#tech-stack)

- [Celo Composer](#celo-composer)
- [Bootstrap the Application](#bootstrap-the-application)

- [Build the withdraw component](#build-the-withdraw-component)

- [Building the UI](#building-the-ui)

  - [Building the header component](#building-the-header-component)

  - [Creating a button component](#creating-a-button-component)

  - [Building the home component](#building-the-home-component)

- [Testing our app](#testing-our-app)

  - [Instructions to test the app on Minipay](#instructions-to-test-the-app-on-minipay)

- [Conclusion](#conclusion)

### Tech Stack

<p>Here’s the stack that we will be working with:
  
-   [Next.js](https://nextjs.org/) app framework
-   [TailwindCSS](https://tailwindcss.com/) for UI styling
-   [rainbowkit-celo](https://www.npmjs.com/package/@celo/rainbowkit-celo), a plugin to help rainbowkit developers support the CELO protocol faster.
-   [Typescript](https://www.typescriptlang.org/)

## Celo Composer

The easiest way to start with Celo Composer is using `@celo/celo-composer`. This CLI tool lets you quickly start building dApps on Celo for multiple frameworks, including React (with either react-celo or rainbowkit-celo), React Native (w/o Expo), Flutter, and Angular. In our case, we will work with React, specifically NextJS.

## Bootstrap the Application

Bootstrap the application using this Celo Composer command.

```sh
npx @celo/celo-composer create
```

1. Select the below choices as you move through each option and rename the app with a name of your choice.

![Screenshot from 2024-01-30 10-38-35](https://github.com/dancankimutai/securavote/assets/59916500/264a0ad5-497c-43cb-926d-884b2a7daca1)

2. Move to the project's root directory and run `yarn` or `npm install` to install the dependencies required in the project, in my case am using yarn.

![Screenshot from 2024-01-30 10-40-44](https://github.com/dancankimutai/securavote/assets/59916500/6ea9290d-da64-474b-8f33-5d825ea57df1)

3. Then open the app in your code editor of choice, if visual studio code type `code .` in the project’s root directory to launch vs code.
   Change the directory in your terminal and run `yarn dev` to check if there is anything else we may need.

![Screenshot from 2024-01-30 11-00-55](https://github.com/dancankimutai/securavote/assets/59916500/821c00f5-c762-4e58-b780-70762d806b1e)

4. Visit the localhost URL displayed there in your browser to view our rendered app. We find this error.

![Screenshot from 2024-01-30 11-01-26](https://github.com/dancankimutai/securavote/assets/59916500/81d0c7a2-8c3c-40d8-a50e-03db9368696b)

5. We visit our `_app.tsx` file and find:

`*const* projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as *string*; // get one at https://cloud.walletconnect.com/app`

6. We thus visit the URL and create an account. We then create a project ID by typing the name of our app and on type select the app then click Create as shown below.

![Screenshot from 2024-01-30 10-59-10](https://github.com/dancankimutai/securavote/assets/59916500/7b09cae5-b63a-46ba-9a71-5911c4d45525)

7. We then copy the project ID that is generated:

![Screenshot from 2024-01-30 11-08-21](https://github.com/dancankimutai/securavote/assets/59916500/aae31475-1ad8-4497-b093-8d8b21f744c1)

8. In your `packages/react-app/` directory create a file called .env and paste your id there as below.

![Screenshot from 2024-01-30 11-10-51](https://github.com/dancankimutai/securavote/assets/59916500/382afa5e-de7d-47f6-a41a-af001b93b7ab)

9. When you now go back to the localhost page on your browser it should now display as below and not an error.

![Screenshot from 2024-01-30 11-11-31](https://github.com/dancankimutai/securavote/assets/59916500/041bb0ba-bf85-4ffb-a253-87ca11907f6a)

## Testing our app

To test our app we must put it online by creating a forwarding URL, you can use a free tool like ngrok. It'sInstructions can be found here:
[https://ngrok.com/docs/getting-started/](https://ngrok.com/docs/getting-started/)

Personally am using gitpod which is an online dev environment. When I run yarn dev it prompts me to either leave the service on the port private or make it public so that I can access it over another device via a URL and I do so.

![Screenshot from 2024-01-30 12-51-21](https://github.com/dancankimutai/securavote/assets/59916500/e1c25420-ff74-473a-8bc2-6f306e40514a)

We copy the URL address provided for use later.

### Instructions to test the app on Minipay

1. Install Opera mini Browser from the app store.

2. Open it and at the bottom click on the opera logo and click MiniPay in the menu that appears.

3. If you don't have an account create one and load tokens to your Minipay using the various options provided in MiniPay. You can even deposit from valora or another crypto wallet. If having challenges finding the add cash button, at the page below swipe down from the part of your screen below your balance to find it.

![image](https://github.com/dancankimutai/securavote/assets/59916500/0dfecbd3-0e13-406d-bfcd-240db15f3222)

![image](https://github.com/dancankimutai/securavote/assets/59916500/39ccd211-e3bb-4138-aff9-0ad7d2bdc19c)

4. After depositing, click the compass Icon just below your balance on the minipay homepage scroll down to the Discover page that opens, and select Site Tester.

5. Paste the project URL/address we copied earlier and click Go. For this tutorial, you can use the link in this tutorial description or this

[https://securavote-react-app.vercel.app/](https://securavote-react-app.vercel.app/)

![image](https://github.com/dancankimutai/securavote/assets/59916500/d0e706d3-1030-46e6-8ecf-45948448e0a8)

## Conclusion

Congratulations! You have learned how to build an app for the Minipay wallet.

Now you have the skills and knowledge needed to build a functional Minipay application on your own and test that it works.

<p align="right">(<a href="#top">back to top</a>)</p>
