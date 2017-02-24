#nightlife
## Introduction
A web application that searches for businessess around a location provided by the user. It allows the user to view the number of people that have decided to go to a particular business on that night, based on the inputs of users that have been authenticated using Twitter/Facebook. The list of businesses is provided by [Yelp](https://www.yelp.com/developers/documentation/v2/search_api)

## To install
### Clone the repository:
```
git clone https://github.com/ksmai/nightlife.git
cd nightlife
```

### Install dependencies:
```
npm install
```

### Configure API:
Save the following credentials to config.json:
```
"PORT": "The port that the application will be served on",
"DB_URL": "The URL to the mongodb database used by the application",
"TWITTER_CONSUMER_KEY": "Consumer key from your Twitter Application",
"TWITTER_CONSUMER_SECRET": "Consumer secret from your Twitter Application",
"FACEBOOK_APP_ID": "App ID of your Facebook App",
"FACEBOOK_APP_SECRET", "App Secret of your Facebook App",
"YELP_CONSUMER_KEY": "Consumer key of your Yelp account",
"YELP_CONSUMER_SECRET": "Consumer secret of your Yelp account",
"YELP_TOKEN": "Token of your Yelp account",
"YELP_TOKEN_SECRET": "Token secret of your Yelp account"
```
Alternatively, you can also use environment variables for the configuration.
For more details, check [Facebook for developers](https://developers.facebook.com/apps), [Twitter Application Management](https://apps.twitter.com/) and [Yelp API 2.0](https://www.yelp.com/developers/documentation/v2/search_api).

## To run test
### Unit test
```
npm test
```

### End-to-end test
```
npm run protractor
```

## To start
```
npm start
```

## LICENCE
ISC
