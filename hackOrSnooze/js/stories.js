"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  let hideUnfav = " hidden", hideFav =" hidden", hideBin = " hidden";

  if(currentUser) {
    const usersFavStoryIdsList = currentUser.favorites
                                  .map(fav => fav.storyId);
    const isTheStoryFaved = usersFavStoryIdsList.includes(story.storyId);

    if (isTheStoryFaved) hideUnfav = "";
    else hideFav = "";
  }

  return $(`
      <li id="${story.storyId}">
        <a href="#" class="trash${hideBin}" id="delete-${story.storyId}">
          <i class="far fa-trash-alt"></i>
        </a>
        
        <a href="#" class="star fav-button${hideFav}" id="fav-${story.storyId}">
          <i class="far fa-star"></i>
        </a>
        <a href="#" class="star unfav-button${hideUnfav}" id="unfav-${story.storyId}">
          <i class="fas fa-star"></i>
        </a>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** */

async function postNewStory(evt) {
  console.debug("postNewStory");
  evt.preventDefault();

  const author = $('#story-author').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();
  $('#story-author').val('');
  $('#story-title').val('');
  $('#story-url').val('');

  $addStoryForm.slideUp();

  await StoryList.addStory(currentUser, {url, title, author});

  await updateLocalStoryLists();
  putStoriesOnPage();
}

$addStoryForm.on("submit", postNewStory);


/** Gets list of favorited stories from server, generates their HTML, and puts on page. */

function putFavoritedStoriesOnPage() {
  console.debug("putFavoritedStoriesOnPage");

  $favStoriesList.empty();

  // loop through all of fav stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }

  if (!currentUser.favorites.length) {
    $favStoriesList.append(`<p>No favorites added!</p>`);
  }

  hidePageComponents();
  $favStoriesList.show();
}


/** Gets list of user's own stories from server, generates their HTML, and puts on page. */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $ownStoriesList.empty();

  // loop through all of user's own stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $ownStoriesList.append($story);
  }
  $(".trash").toggleClass("hidden");

  if (!currentUser.ownStories.length) {
    $ownStoriesList.append(`<p>No stories submitted!</p>`);
  }

  hidePageComponents();
  $ownStoriesList.show();
}


/** Update all the local story lists after any API DB change */

async function updateLocalStoryLists() {
  console.debug("updateLocalStoryLists");

  if (!!currentUser) await currentUser.updateStories();
  storyList = await StoryList.getStories();
}