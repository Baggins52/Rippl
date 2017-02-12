Backlog:
Key:
***** means that the topic is an immediate focus


**********Bug Fixes:
1)Invalid searches (may) eventually return the correct error message (its based on the selected radio button at the time of search), but it takes several minutes.


Features:
*****Client/UX:
1)Implement functionality in the 3rd search option (topic by location) with user-entered topics and geo-coordinates
-to be changed shortly thereafter to incorporate Google's geocode API for location name/address to geo-coord. conversion
2)Pithy explanation or tagline immediately to the right of the title explaining what the app does and is about
-"Are you making waves?" OR "Find out what's making waves" OR "What's making waves near you?"
3)StatsCard entries:
-X button at the top right to change `display` style of entry to `none` on the dom
4)Basic Website flavicon
5)There should be route handling for /login and /home routes to re-direct to just '/' (this ties in with the "Client/UX To-do: Persist logins")
6)Persist logins so that on page refresh, you don't have to re-login every time (or ever, at least cookies are cleared or until logout is clicked)
7)Seek out a way - if possible - to correctly capitalize the characters of twitter handles in user titles (instead of generically using the `capitalizer` function in StatsCard.jsx)
8)Allow users to control the sample size (within reason) by which the sentiment scores are calculated


*****Server:
1)See Client/UX feature #1 (Google geocode API coord. conversion)
2)See Client/UX feature #2-3 ('/login' and '/home' route handling/re-directing when already logged in)
3)See Client/UX feature #5



*****Auth0/Sessions/Tokens:
1)See #2 in Client/UX
2)See #6 regarding persisting DELETIONS of saved card entries removed from the dom via the 'x' bottom at the top right of each card
3)refactor api usage model to `streaming` to remove 15 tweets / 15 minutes api key limitations




Stretch Features:
Google map api iframe (select a location on the globe to simultaneously populate the search bar with a location)

Additional persisting of user-specific location data:
-pull user's location and save to state variable on page load "<web address> wants to: Know your location"
--pre-load coordinates into gmaps iframe if below is achieved
Trending Topics feature/sidebar

Game mode: users estimate what 10(?) random topics, locations, and or celebrities' scores are and - like golf scores - the lowest are tracked on a daily basis




Wrap-up sprint goals:
1)Update project page readme so that the user can get an instant idea of the features that were added via a before-and-after app screenshot
2)Deployment