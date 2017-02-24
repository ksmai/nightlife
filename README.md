#nightlife
## Introduction
A web application that
  * searches for businessess around a user-provided location
  * show the number of people that will be going to a particular business on that night, based on the inputs of authenticated users
  * authenticate user with Twitter/Facebook

The list of businesses is provided by [Yelp](https://www.yelp.com/developers/documentation/v2/search_api).

## Installation
1. Clone the repository:
```
git clone https://github.com/ksmai/nightlife.git
cd nightlife
```

2. Install dependencies:
```
npm install
```

3. Configure API:
Save the following credentials to config.json:
```
"PORT"                    : "The port that the application will be served on",
"DB_URL"                  : "The URL to the mongodb database used by the application",
"TWITTER_CONSUMER_KEY"    : "Consumer key from your Twitter Application",
"TWITTER_CONSUMER_SECRET" : "Consumer secret from your Twitter Application",
"FACEBOOK_APP_ID"         : "App ID of your Facebook App",
"FACEBOOK_APP_SECRET"     : "App Secret of your Facebook App",
"YELP_CONSUMER_KEY"       : "Consumer key of your Yelp account",
"YELP_CONSUMER_SECRET"    : "Consumer secret of your Yelp account",
"YELP_TOKEN"              : "Token of your Yelp account",
"YELP_TOKEN_SECRET"       : "Token secret of your Yelp account"
```
Alternatively, you can also use environment variables for the configuration.
For more details, check [Facebook for developers](https://developers.facebook.com/apps), [Twitter Application Management](https://apps.twitter.com/) and [Yelp API 2.0](https://www.yelp.com/developers/documentation/v2/search_api).

## Testing
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

## Licence
ISC
