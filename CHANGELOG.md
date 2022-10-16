# Changelog

## App version v.2_161022

### Changes in common words:

- Added "change avatar"-functionality inside the Profile-screen;
- Floating "Add Task" button repositioned to the 50% of the Bottom Tab.Navigator's top, added shadow to it's SVG;
- Added Alert-confirmations when needed;
- Search-input changed to rneui/themed built-in one with necessary useful icons;
- Fixed OnboardingScreen appearance (now it appears just when user logged-out);
- Card.Image changed into "FullSizeImage" user component for the appropriate images views;
- All the UI-styles (excl. some inline) have been moved into separate utils/Styles-file;
- All the screens re-done following common UI-style (incl. fix margins, paddings, Header everywhere etc.);

### Updated Screenshots

![App Screenshot](https://i2.paste.pics/J7G1U.png)

![App Screenshot](https://i2.paste.pics/J7G21.png)

![App Screenshot](https://i2.paste.pics/J7G24.png)

![App Screenshot](https://i2.paste.pics/J7G25.png)

![App Screenshot](https://i2.paste.pics/J7G2B.png)

![App Screenshot](https://i2.paste.pics/J7G2G.png)

![App Screenshot](https://i2.paste.pics/J7G2M.png)

![App Screenshot](https://i2.paste.pics/J7G2P.png)

![App Screenshot](https://i2.paste.pics/J7G2S.png)

![App Screenshot](https://i2.paste.pics/J7G2V.png)

![App Screenshot](https://i2.paste.pics/J7G31.png)

![App Screenshot](https://i2.paste.pics/J7G35.png)

![App Screenshot](https://i2.paste.pics/J7G3E.png)

![App Screenshot](https://i2.paste.pics/J7G3H.png)

![App Screenshot](https://i2.paste.pics/J7G3J.png)

![App Screenshot](https://i2.paste.pics/J7G3L.png)

![App Screenshot](https://i2.paste.pics/J7G3O.png)

![App Screenshot](https://i2.paste.pics/J7G3U.png)

![App Screenshot](https://i2.paste.pics/J7G40.png)

### Changes in details (auto-generated):

- refactor: change some styles, remove unnecessary console.logs.
- feat: add change user avatar functionality.
- fix: fix OnboardingScreen appearence when APP restarts.
- Merge branch 'main' of https://github.com/Underwerse/cleanme into pavel
- Merge pull request #16 from Underwerse:styles
- refactor: change Image styling: now use FullSizeImage-component.
- refactor: move all styles into separate Styles-module.
- refactor: remove unnecessary Stack.Screens from the Stack.Navigator - now all Screens are handled by bottom Tab.Navigator.
- refactor: add absent Header-components to all the screens.
- refactor: change Navigator.js structure for correct handling moving between Tabs and Stack navigator screens; refactor: change ModifyUser style.
- feat: add paddingBottom to SingleTask ScrollView by contentContainerStyle.
- refactor: change loadMedia function (logic simplified).
- Merge branch 'pavel' of https://github.com/Underwerse/cleanme into pavel
- refactor: change MyTasks and MyFavorites style
- Merge pull request #15 from Underwerse:search
- feat: redo search field.
- refactor: style addBtn shadow.
- feat: move addTaskBtn to Navigator.js, now it's on all the screens with bottom Tab.Navigator. Increase addBtn size, 50% overlap bottom navigator.
- Merge pull request #14 from Underwerse:pavel
- Merge pull request #13 from Underwerse:login-error
- fix: fix avatar loading in Profile.js; fix: fix login error handling when incorrect; refactor: some improvements.
