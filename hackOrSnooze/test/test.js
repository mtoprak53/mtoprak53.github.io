let newStory = await storyList.addStory(
  currentUser, 
  {
    title: "Test",
    author: "Me",
    url: "https://meow.com"
  }
);

newStory instanceof Story;