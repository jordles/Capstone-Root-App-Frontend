# Capstone Root App Frontend
This is a mockup of a social media application that allows users to post content and chat with other users. I plan to add more features to this app in the future. The focus is that you have full CRUD functionality for users and their posts. You can message other users and login/logout between users. 

This is a simple wireframe of the early stages of my feed/landing page. 



## Sites
[Backend](https://github.com/jordles/Capstone-Root-App-Backend)

## Features and Usage

* Create, Login and Edit, Delete User configurations (Pages: Home, Sign Up, Login, Settings)
* Chat and message people
* Main Feed page for posting content with other media features added onto it  (Pages: Feed)
* Post, edit, delete content on the feed page, which includes emojis, gifs, images and videos

## Requirements

| (20%) Project Structure, Standardization, and Convention | Weight | Finished |
| :-- | :--: | :--: |
| Project is organized into appropriate files and directories, following best practices. | 2% | ✅ |
| Project contains an appropriate level of comments. | 2% | ✅ |
| Project is pushed to GitHub, and contains a README file that documents the project, including an overall description of the project. | 5% | ✅ |
| Standard naming conventions are used throughout the project. | 2% | ✅ |
| Ensure that the program runs without errors (comment out things that do not work, and explain your blockers - you can still receive partial credit). | 4% | ✅ |
| Level of effort displayed in creativity, presentation, and user experience. | 5% | ✅ |

| (12%) Core JavaScript | Weight | Finished |
| :-- | :--: | :--: |
| Demonstrate proper usage of ES6 syntax and tools. | 2% | ✅ |
| Use functions and classes to adhere to the DRY principle. | 2% | ✅ |
| Use Promises and async/await, where appropriate. | 2% | ✅ |
| Use Axios or fetch to retrieve data from an API. | 2% | ✅ |
| Use sound programming logic throughout the application. | 2% | ✅ |
| Use appropriate exception handling. | 2% | ✅ |

| (9%) Database | Weight | Finished |
| :-- | :--: | :--: |
| Use MongoDB to create a database for your application. (used mongoose) | 2% | ✅ |
| Apply appropriate indexes to your database collections. | 2% | ✅ |
| able schemas for your data by following data modeling best practices | 2% | ✅ |

| (19%) Server | Weight | Finished |
| :-- | :--: | :--: |
| Create a RESTful API using Node and Express. <br><br>
* For the purposes of this project, you may forgo the HATEOAS aspect of REST APIs. | 7% | ✅ |
| Include API routes for all four CRUD operations. | 5% | ✅ |
| Utilize the native MongoDB driver or Mongoose to interface with your database. | 5% | ✅ |
~~| Include at least one form of user authentication/authorization within the application. (NOT GRADED ON) | 2% |  |~~

| (35%) Front-End Development | Weight | Finished |
| :-- | :--: | :--: |
| Use React to create the application’s front-end. | 10% | ✅ |
| Use CSS to style the application. | 5% | ✅ |
| Create at least four different views or pages for the application. | 5% | ✅ |
| Create some form of navigation that is included across the application’s pages, utilizing React Router for page rendering. | 5% | ✅ |
| Use React Hooks or Redux for application state management. | 5% | ✅ |
| Interface directly with the server and API that you created. | 5% | ✅ |


## Extra Libraries / Packages
moment-timezone - for timezone conversion from UTC recorded on mongoose data, regarding posts and messaging times  
emoji-picker-react - for emoji picker on posts and messages    
memo - for preventing unnecessary re-renders when react re-renders media preview because of CreatePost parent re-renders  
** useRef: "Keep this value the same between renders" vs memo: "Don't render at all if nothing changed" **  
  
## API (Third Party)
[tenor](https://tenor.com/gifapi)- incorporated gif images into my messages and post functionalities

