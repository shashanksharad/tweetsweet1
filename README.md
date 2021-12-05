# Access the Application here:  https://tweetsweet.netlify.app/

# Installing TweetSweet Locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Step-1 Clone this repository to your local machine

From the command line you can run:

### git clone -b master https://github.com/shashanksharad/tweetsweet1.git

## Step-2 Move into the tweetsweet1 directory and remove the package-lock.json file

From the command line you can run:
### rm package-lock.json

## Step-3 Install npm packages

From the command line,run:

### npm install

## Step-4 Remove the API redirects (Otherwise required for deploying on netlify)

### Un-Comment line 148, Comment line 151.
// For Accessing API withour Redirects
149: var url = "http://35.245.119.65:8000/api/v1/handle-analytics?handle="+handle_id.toString().toLowerCase();

// For Redirected API access on Netifly
151://  var url = "/api/api/v1/handle-analytics?handle="+handle_id.toString().toLowerCase();
    

## Step-5 Start the React App
From the command line,run:

### npm start

The app will start running locally.
