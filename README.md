# Keebacy

[Link to website](https://madnight.github.io/keybacy/)

A minimalist typing program inspired by [wpm](https://github.com/cjbassi/wpm-spa) and built for the browser using React and Redux.
It includes different typing modes such as 'words', 'quote', 'wiki', and 'custom', and gives you typing stats based on the current text being typed.
Quotes were taken from wpm which were taken from http://www.typeracerdata.com/texts.

## Keyboard Shortcuts

| Key   |  Action  |
|---|---|
| Ctrl+Delete  | Deletes the last word |
| Escape  | Retry sample  |
| Tab  | Get a new sample |
| F5  | Reset stats |

# FAQ

#### Q: What's the difference to keybr?

The target audience for [keybr](https://keybr.com) are beginner touch typist who want to improve their typing accuracy and speed by fixing their typing weaknesses on individual characters. Keybr does its job very well, but it certainly has its limits. As soon as you are free of weaknesses (everything green and confidence 1) you may be annoyed by their non-sense words and the lack of different typing modes. Keebacy improves on keybr in that it replaces non-sense words by words from the [NGSL](https://en.wikipedia.org/wiki/New_General_Service_List) (covering 90% of written english) and adds Ctrl+Delete (delete last word) plus two additional modes: quote and wiki.

#### Q: What's the difference to typeracer?

[Typeracer](https://typeracer.com) is known for its multiplayer typing racing feature. Keebacy does not have a multiplayer and does not intend to add one. This website is only for training (non-competitive) purposes.

#### Q: What's the difference to 10fastfingers?

[10fastfingers](https://10fastfingers.com) main feature is its typing test, where you type for 60 seconds as fast as you can and get a result. 10fastfingers picks the top 200 or top 1000 most common words, but their top 200 common word list contains not so common words like "Indian". The [NGSL](https://en.wikipedia.org/wiki/New_General_Service_List) which is used by keebacy is much better to train with, since it cover 90% of written english. Also, 10fastfingers does not have a cursor in the text (like typereacer), so you either have to focus on the input text field, but then it's hard to read the next word, or you just read the next word and ignore errors or try to fix errors without looking at it (with mixed results). I think the error handling is better in keebacy since it does not focus on speed or highscore, but on accuracy and also has two additional modes: quotes and wiki.

#### Q: What's the difference to monkey-type?

[Mokey-type](https://monkey-type.com) is a great typing website, if you haven't heard of yet go ahead and check it out. The words mode is not based on the NGSL and therefore contain either way to less words or (if you pick extended mode) some not so common words. The settings do not include a max. error setting, you can go either perfect or with unlimited errors. Monkey-type does not have a wiki mode.

#### Q: Why is it called Keebacy?

Keebacy is a combination of (Kee)p + (Keeb)oard + Accur(acy).

#### Q: What's your target user group?

If you are not able to touch type, then I would recommend you to start with [typingclub](https://typingclub.com) in order to learn touch typing. If you are able to touch type or you have your custom typing system that you're comfortable with and you are below 60 WPM, then I would recommend you to train with [keybr](https://www.keybr.com/). This site helps you fix deficits on certain keys. If you have no individual character weaknesses left, then Keebacy is for you.

#### Q: I'm already typing at 100 WPM+ is this website still for me?

Yes, but you might want to consult [Jashe's Comprehensive (Speed)Typing Guide](https://archive.is/dh9Ch).

#### Q: How do you recommend to train typing speed on your website?

Do not focus on speed. You will get faster as your accuracy increases, since accuracy is the single most important aspect of typing. I would recommend you to set a max. error limit in the settings, one that you are comfortable with. I would recommend to train with the words mode in short sessions of at least 20 samples and with a maximum of 100 samples. The words mode for the english language is based on [NGSL](https://en.wikipedia.org/wiki/New_General_Service_List) a list of the most frequent english words witch covers 90% of written english. Thus, if you are accurate and fast at this mode, then you are accurate and fast in 90% of written english. In order to also train punctuation, capitalization and non-frequent words, I would go with the quote mode. Since the quotes of the quotes mode are the same that are used in typeracer you have the little side effect that you also increase your typeracer speed. If you want to train on academic or exotic words, proper nouns, dates, numbers and more complex texts then pick the wiki mode.

#### Q: What settings do you recommend?

I would recommend you to define a maximum amount of errors (Max. Error) in the settings. Try to set the number of allowed errors as low as possible, but not so low that you are annoyed and have to retype every sample ten times. Do not set it to high, because if your accuracy is too low you won't improve much. Try out different values and see how it affects your WPM. Find a middle ground that slightly gets you out of your comfort zone. Always aim for the 97% - 100% accuracy range, with a mindset of the higher the better.

#### Q: Why do you offer only english and german?

I intend to add more langauges, but I want to have a very high level of quality for every mode of them. For the wiki mode it's rather easy, because all there is to change is the API call to get wiki article in other languages. But for quotes and words it is a little bit more complex. I don't want google auto translations or strange words like other typing websites have. Therefore, I need some assistance here. For the words mode I need the top 10k most frequent words of the language, like the [NGSL](https://en.wikipedia.org/wiki/New_General_Service_List) that I use for english. These lists do not always have a high quality. In case of the german list I had to manually filter out many artifacts.
