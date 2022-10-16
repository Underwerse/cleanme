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

![App Screenshot](https://i2.paste.pics/J7G6C.png)

![App Screenshot](https://i2.paste.pics/J7G6J.png)

![App Screenshot](https://i2.paste.pics/J7G6M.png)

![App Screenshot](https://i2.paste.pics/J7G6Q.png)

![App Screenshot](https://i2.paste.pics/J7G6S.png)

![App Screenshot](https://i2.paste.pics/J7G6X.png)

![App Screenshot](https://i2.paste.pics/J7G76.png)

![App Screenshot](https://i2.paste.pics/J7G79.png)

![App Screenshot](https://i2.paste.pics/J7G7B.png)

![App Screenshot](https://i2.paste.pics/J7G7C.png)

![App Screenshot](https://i2.paste.pics/J7G7D.png)

![App Screenshot](https://i2.paste.pics/J7G7E.png)

![App Screenshot](https://i2.paste.pics/J7G7F.png)

![App Screenshot](https://i2.paste.pics/J7G7H.png)

![App Screenshot](https://i2.paste.pics/J7G7N.png)

![App Screenshot](https://i2.paste.pics/J7G7S.png)

![App Screenshot](https://i2.paste.pics/J7G7V.png)

![App Screenshot](https://i2.paste.pics/J7G80.png)

![App Screenshot](https://i2.paste.pics/J7G82.png)

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
