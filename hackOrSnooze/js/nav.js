"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logs in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  // $navSubmit.show();
  // $navFavorites.show();
  // $navMyStories.show();
  $navButtons.show();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show "add story" on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  hidePageComponents();
  putStoriesOnPage();
  $addStoryForm.slideDown();
}

$navButtons.on("click", "#nav-submit", navSubmitClick);


/** Show favorited stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putFavoritedStoriesOnPage();
  // $addStoryForm.show();
  // $addStoryForm.slideDown();
}

$navButtons.on("click", "#nav-favs", navFavoritesClick);


/** Show user's own stories on click on "my stories" */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick");
  hidePageComponents();
  putMyStoriesOnPage();
  // $addStoryForm.show();
  // $addStoryForm.slideDown();
}

$navButtons.on("click", "#nav-my-stories", navMyStoriesClick); 
